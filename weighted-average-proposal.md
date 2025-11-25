# Weighted Average Implementation Proposal for Multi-Format Data Processing

## Overview

This proposal outlines how to implement a weighted average calculation across all formats (Sealed, TradSealed, PickTwoDraft, PickTwoTradDraft) for the "Overall" data in the preprocessing main.js file.

## Current State Analysis

### Current Implementation
- Currently fetches data for only `SELECTED_FORMAT` (currently set to SEALED)
- Processes one format at a time and stores it as "Overall" data
- Data structure: Each card has `gihWRByColors["Overall"]` containing:
  - `gihWR`: ever_drawn_win_rate
  - `gihWRCount`: ever_drawn_game_count
  - `avgPick`: average pick position
  - `avgSeen`: average seen count

### Identified Issues
1. Single format limitation
2. No weighted averaging across formats
3. Missing data for formats with insufficient sample sizes

## Critical Issues Identified & Fixed

### ❌ **Original Logic Flaw**: Zero Win Rate Filtering
**Problem**: Initial proposal filtered out 0% win rates (`data.gihWR > 0`)
**Fix**: 0% is mathematically valid - only filter `null/undefined` values
**Reason**: API returns `null` for insufficient data quality, not for true 0% performance

### ❌ **Error Handling Gap**: Promise.all() Fragility
**Problem**: Single format failure would crash entire process
**Fix**: Use `Promise.allSettled()` with graceful degradation
**Impact**: Partial data better than no data

### ❌ **Efficiency Issue**: Multiple Reduce Passes
**Problem**: Separate reduces for win rate, avgPick, avgSeen calculations
**Fix**: Single-pass accumulation for better performance
**Benefit**: O(n) instead of O(3n) complexity

### ❌ **Missing Consideration**: Color Combination Strategy
**Problem**: Unclear whether color-specific data should also be weighted across formats
**Fix**: Explicit decision point with recommendation (Option A: Overall only)
**Impact**: Prevents scope creep while maintaining clarity

## Proposed Solution

### 1. Multi-Format Data Fetching

**Replace single format fetch with multiple format fetches:**

```javascript
// Replace current BASE_URL with format-agnostic function
const buildFormatURL = (formatSlug) =>
  `https://www.17lands.com/card_ratings/data?expansion=${EXPANSION_CODE}&format=${formatSlug}&start_date=${startDate}&end_date=${endDate}`;

// Fetch all formats in parallel with graceful failure handling
const formatPromises = Object.values(FORMATS).map(format => ({
  format: format.slug,
  promise: fetch(buildFormatURL(format.slug))
    .then(res => res.ok ? res.json() : [])
    .catch(() => []) // Return empty array on failure
}));

const formatResults = await Promise.allSettled(formatPromises.map(f => f.promise));
const formatData = formatResults.map((result, index) => ({
  format: Object.values(FORMATS)[index].slug,
  data: result.status === 'fulfilled' ? result.value : []
}));
```

### 2. Simplified Data Processing

**No permanent storage of individual format data needed - compute weighted average on-the-fly:**

```javascript
// Keep existing data structure unchanged
dict[shortName] = {
  name,
  colors,
  keywords,
  cmc: parseInt(cmc),
  rarity,
  image,
  backImage,
  type,
  gihWRByColors: {} // Unchanged - just populate with weighted averages
};
```

### 3. Weighted Average Calculation Algorithm

**Core weighting formula:**
```
weighted_average = Σ(format_win_rate × format_game_count) / Σ(format_game_count)
```

**Implementation approach:**

```javascript
const calculateWeightedOverall = (cardFormatData, minGameCount = 0) => {
  const validFormats = Object.entries(cardFormatData)
    .filter(([format, data]) =>
      data.gihWR !== null &&
      data.gihWR !== undefined &&
      data.gihWRCount > minGameCount
    );

  if (validFormats.length === 0) return null;

  // Single-pass calculation for efficiency
  let totalWeightedWinRate = 0;
  let totalWeightedPick = 0;
  let totalWeightedSeen = 0;
  let totalGameCount = 0;

  validFormats.forEach(([format, data]) => {
    totalWeightedWinRate += data.gihWR * data.gihWRCount;
    totalWeightedPick += (data.avgPick || 0) * data.gihWRCount;
    totalWeightedSeen += (data.avgSeen || 0) * data.gihWRCount;
    totalGameCount += data.gihWRCount;
  });

  return {
    gihWR: totalWeightedWinRate / totalGameCount,
    gihWRCount: totalGameCount,
    avgPick: totalWeightedPick / totalGameCount,
    avgSeen: totalWeightedSeen / totalGameCount,
    formatCount: validFormats.length
  };
};
```

### 4. Critical Decision: Color Combinations

**Question: Should color-specific data (WU, WB, etc.) also use weighted averages across formats?**

The current system fetches both:
1. Overall format data (what we're changing to weighted average)
2. Color-specific format data (WU, WB, WR, WG, UB, UR, UG, BR, BG, RG)

**Options:**
- **Option A**: Only weight "Overall" across formats, keep color combos single-format
- **Option B**: Weight both "Overall" and color combos across formats (more consistent but 10x more API calls)

**Recommendation: Option A** for initial implementation - simpler, fewer API calls, maintains existing color-specific behavior.

### 5. Implementation Steps

#### Step 1: Refactor Data Fetching
- Replace single format fetching with multi-format parallel fetching
- Update URL generation to be format-agnostic
- Maintain backward compatibility with existing color combinations

#### Step 2: Enhanced Data Processing
- Apply weighted averaging only to cards with valid data (gihWR not null/undefined)
- Use single-pass calculation for efficiency
- Handle edge cases where no formats have valid data
- No need to store individual format data permanently

#### Step 3: Data Output Structure
- Keep existing `gihWRByColors["Overall"]` structure for backward compatibility
- Add metadata about which formats contributed to the calculation
- Ensure null/empty data handling remains consistent

### 5. Comprehensive Edge Case Handling

#### No Valid Data Scenarios
- **0 formats with data**: Set Overall to null/undefined
- **1 format with data**: Use that format's data directly (no averaging needed)
- **2+ formats with data**: Apply weighted averaging

#### Data Quality Filters
- Ignore formats where `ever_drawn_win_rate` is null or undefined (0% is valid!)
- Ignore formats where `ever_drawn_game_count` is 0, null, or undefined
- Consider minimum game count thresholds per format (e.g., 50 games minimum)

#### Network & API Edge Cases
- **Individual format API failures**: Continue with available formats
- **Malformed JSON responses**: Treat as empty data for that format
- **Rate limiting**: Current parallel approach should be fine, but monitor
- **Empty responses vs error responses**: Handle both gracefully

#### Data Precision Edge Cases
- **avgPick/avgSeen null handling**: Use 0 as fallback with `(data.avgPick || 0)`
- **Very large game counts**: JavaScript number precision should be sufficient
- **Format unavailability**: Some formats may not exist for certain sets/time periods

### 6. Performance Considerations

#### Parallel Processing
- Fetch all format data simultaneously using Promise.all()
- Process cards in batches if memory becomes an issue

#### Memory Management
- Store only necessary format data during processing
- Clean up intermediate data structures after weighted calculation

### 7. Testing and Validation

#### Test Cases
1. **Single format data**: Verify direct passthrough
2. **Multiple formats**: Verify weighted calculation matches manual calculation
3. **Mixed valid/invalid data**: Ensure proper filtering
4. **All invalid data**: Verify null handling

#### Example Calculation Verification
For a card with:
- Sealed: 80% win rate, 1000 games
- TradSealed: 60% win rate, 500 games

Expected weighted average: `(0.8 × 1000 + 0.6 × 500) / (1000 + 500) = 73.33%`

### 8. Migration Strategy

#### Backward Compatibility
- Existing `gihWRByColors["Overall"]` structure unchanged
- Color-specific processing remains identical
- Output JSON format stays consistent

#### Rollback Plan
- Keep current implementation as fallback
- Add feature flag for weighted vs single format mode
- Gradual rollout with monitoring

### 9. Code Quality Improvements

#### Refactoring Opportunities
- Eliminate duplicate data processing loops
- Create reusable functions for card data processing
- Improve error handling and logging

#### Maintainability Enhancements
- Add comprehensive comments explaining weighting logic
- Create constants for minimum game count thresholds
- Separate format fetching from data processing logic

## Expected Benefits

1. **More Representative Data**: Overall ratings reflect performance across all active formats
2. **Better Sample Sizes**: Combines data from multiple formats for more reliable statistics
3. **Format Balance**: Automatic weighting prevents any single format from dominating
4. **Future Flexibility**: Easy to add/remove formats or adjust weighting algorithms

## Conclusion

**This revised proposal addresses critical logic flaws and provides a robust, scalable solution** for creating truly representative "Overall" card ratings by:

✅ **Mathematically correct** weighted averaging across formats
✅ **Resilient error handling** with graceful degradation
✅ **Efficient single-pass** calculation algorithm
✅ **Comprehensive edge case** coverage
✅ **Clear scope definition** with explicit design decisions
✅ **Backward compatibility** maintained

**Ready for implementation** with significantly reduced risk of data quality issues or system failures.
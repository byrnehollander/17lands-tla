import { AVERAGE_WIN_RATE, WIN_RATES_BY_COLOR } from './aggregateData'

export const calculateDiffFromAverageWinRate = (colorWinRate) => {
  let delta = (colorWinRate - AVERAGE_WIN_RATE).toFixed(1)
  if (delta > 0) {
    delta = '+' + delta
  }
  return `${delta}%`
}

export const calculateDiffFromAverageBGWinRate = (colorWinRate) => {
  let delta = (colorWinRate - WIN_RATES_BY_COLOR["Golgari (BG)"]).toFixed(1)
  if (delta > 0) {
    delta = '+' + delta
  }
  return `${delta}%`
}

export const calculateDiffFromAverageBRWinRate = (colorWinRate) => {
  let delta = (colorWinRate - WIN_RATES_BY_COLOR["Rakdos (BR)"]).toFixed(1)
  if (delta > 0) {
    delta = '+' + delta
  }
  return `${delta}%`
}

export const calculateDiffFromAverageRGWinRate = (colorWinRate) => {
  let delta = (colorWinRate - WIN_RATES_BY_COLOR["Gruul (RG)"]).toFixed(1)
  if (delta > 0) {
    delta = '+' + delta
  }
  return `${delta}%`
}

export const calculateDiffFromAverageUBWinRate = (colorWinRate) => {
  let delta = (colorWinRate - WIN_RATES_BY_COLOR["Dimir (UB)"]).toFixed(1)
  if (delta > 0) {
    delta = '+' + delta
  }
  return `${delta}%`
}

export const calculateDiffFromAverageUGWinRate = (colorWinRate) => {
  let delta = (colorWinRate - WIN_RATES_BY_COLOR["Simic (GU)"]).toFixed(1)
  if (delta > 0) {
    delta = '+' + delta
  }
  return `${delta}%`
}

export const calculateDiffFromAverageURWinRate = (colorWinRate) => {
  let delta = (colorWinRate - WIN_RATES_BY_COLOR["Izzet (UR)"]).toFixed(1)
  if (delta > 0) {
    delta = '+' + delta
  }
  return `${delta}%`
}

export const calculateDiffFromAverageWBWinRate = (colorWinRate) => {
  let delta = (colorWinRate - WIN_RATES_BY_COLOR["Orzhov (WB)"]).toFixed(1)
  if (delta > 0) {
    delta = '+' + delta
  }
  return `${delta}%`
}

export const calculateDiffFromAverageWGWinRate = (colorWinRate) => {
  let delta = (colorWinRate - WIN_RATES_BY_COLOR["Selesnya (GW)"]).toFixed(1)
  if (delta > 0) {
    delta = '+' + delta
  }
  return `${delta}%`
}

export const calculateDiffFromAverageWRWinRate = (colorWinRate) => {
  let delta = (colorWinRate - WIN_RATES_BY_COLOR["Boros (RW)"]).toFixed(1)
  if (delta > 0) {
    delta = '+' + delta
  }
  return `${delta}%`
}

export const calculateDiffFromAverageWUWinRate = (colorWinRate) => {
  let delta = (colorWinRate - WIN_RATES_BY_COLOR["Azorius (WU)"]).toFixed(1)
  if (delta > 0) {
    delta = '+' + delta
  }
  return `${delta}%`
}
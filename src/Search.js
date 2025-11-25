import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import React, { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import styled from "styled-components";

const Container = styled.div`
  margin-bottom: 40px;
`;

const SearchInputAndClearButton = styled.div`
  display: flex;
`;

const Search = ({ searchTerm, setSearchTerm }) => {
  const textRef = useRef(null);

  useHotkeys("meta+k", () => textRef.current.focus());

  const clearSearchInputAndFocus = () => {
    textRef.current.focus();
    setSearchTerm("");
  };

  return (
    <Container>
      <SearchInputAndClearButton>
        <FormControl
          color="secondary"
          variant="outlined"
          style={{ width: 300 }}
        >
          <InputLabel style={{ color: "white" }} htmlFor="search-input">
            Search
          </InputLabel>
          <OutlinedInput
            autoFocus
            inputRef={textRef}
            color="secondary"
            id="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            label="Search"
          />
        </FormControl>
        <Button
          size="large"
          variant="outlined"
          style={{
            marginLeft: 20,
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.23)",
          }}
          onClick={clearSearchInputAndFocus}
        >
          Clear
        </Button>
      </SearchInputAndClearButton>
      <div style={{ marginLeft: 5, marginTop: 10 }}>
        When searching, your other filters will be ignored
      </div>
    </Container>
  );
};

export default Search;

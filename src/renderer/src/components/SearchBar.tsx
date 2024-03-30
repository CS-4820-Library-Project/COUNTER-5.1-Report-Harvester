import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useTheme } from "@mui/material/styles";
import { FlexCenter } from "./flex";
import { Box, IconButton } from "@mui/material";

type Props = {
  onValueChange: (value: string) => void;
  placeholder: string;
  style?: React.CSSProperties;
};

const SearchBar = ({ onValueChange, placeholder }: Props) => {
  const { palette } = useTheme();
  const styles = {
    input: {
      width: "100%",
      fontSize: "16px",
      padding: "7px 7px 7px 35px",
      borderRadius: "25px",
      backgroundColor: "transparent",
      borderColor: palette.primary.main,
      border: `1px solid ${palette.primary.light}`,
      color: palette.text.main,
      ":focus": {
        outline: `solid 1px ${palette.primary.main}`,
      },
      "::placeholder": {
        color: palette.primary.light,
      },
    },
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
    onValueChange(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onValueChange("");
  };

  return (
    <Box width="100%" position="relative">
      <Box
        component="input"
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        sx={styles.input}
      />
      {searchTerm && (
        <FlexCenter
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: "8px",
          }}
        >
          <IconButton
            aria-label="Clear search"
            size="small"
            onClick={clearSearch}
          >
            <ClearIcon />
          </IconButton>
        </FlexCenter>
      )}
      <FlexCenter
        sx={{
          color: palette.primary.main,
          // padding: "5px",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: "8px",
        }}
      >
        <SearchIcon />
      </FlexCenter>
    </Box>
  );
};

export default SearchBar;

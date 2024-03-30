import {
  Button,
  ButtonProps,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { FlexColumn } from "../../components/flex";
import { SortOptions } from "src/types/vendors";

type Props = {
  sortby: string;
  setSortBy: (sortBy: SortOptions) => void;
};

const FiltersPopUp = ({ setSortBy, sortby }: Props) => {
  const { palette } = useTheme();

  return (
    <FlexColumn
      position='absolute'
      top='0'
      zIndex={9}
      bgcolor={palette.background.paper}
      boxShadow={"0px 0px 10px 0px rgba(0,0,0,0.1)"}
      p='20px'
      gap='10px'
      borderRadius='25px'
    >
      <Typography variant='h5'>Sort By</Typography>
      <Option onClick={() => setSortBy("name")} selected={sortby === "name"}>
        Name
      </Option>

      <Option
        onClick={() => setSortBy("updatedAt")}
        selected={sortby === "updatedAt"}
      >
        Recently Used
      </Option>

      <Option
        onClick={() => setSortBy("createdAt")}
        selected={sortby === "createdAt"}
      >
        Creation Date
      </Option>
    </FlexColumn>
  );
};

export default FiltersPopUp;

type OptionProps = {
  selected: boolean;
};
const Option = styled(Button, {
  shouldForwardProp: (prop) => prop !== "selected",
})<ButtonProps & OptionProps>(({ theme, selected }) => ({
  borderRadius: "50px",
  padding: "0.1rem 1rem",
  width: "100%",
  justifyContent: "flex-start",
  textTransform: "capitalize",
  backgroundColor: selected ? theme.palette.background.hover : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.background.hover,
  },
}));

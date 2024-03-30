import { Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  title?: ReactNode;
  children?: ReactNode;
};
const PageTitle = ({ title, children }: Props) => {
  return (
    <Typography variant='h1' color='primary' width='100%'>
      {title || children}
    </Typography>
  );
};

export default PageTitle;

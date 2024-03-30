import { ReactElement } from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

type Props = {
  hint: string;
  children: ReactElement<any, any>;
};

const TooltipBottom = ({ hint, children }: Props) => {
  return (
    <Tooltip
      title={hint}
      enterDelay={2000}
      enterNextDelay={200}
      leaveDelay={100}
      slotProps={{
        popper: {
          sx: {
            [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
              {
                marginTop: "5px",
              },
            [`& .${tooltipClasses.tooltip}`]: {
              fontSize: "12px",
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipBottom;

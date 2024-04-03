import { Box, IconButton, Typography } from "@mui/material";
import { FlexBetween } from "../flex";
import { ArticleOutlined, FolderOutlined } from "@mui/icons-material";

type ResultsHeaderProps = {
  message: string;
  directory?: string;
  file?: string;
  color?: "primary" | "error";
};

/**
 * Results Header Display a Title and Icon for a result message.
 * It takes in the following props:
 * @prop {message}: A message or Title that will be displayed it accepts ** to bold parts of the text.
 * Example: "standard reports were saved in **Main Reports** directory" will display
 * --- "standard reports were saved in Main Reports directory" with Main Reports bolded.
 * @prop {directory}: The progress percentage 1-100.
 * @prop {file}: The progress percentage 1-100.
 * @prop {color}: The color in palette you want to use for your message
 */

const ResultsHeader = ({
  message,
  directory,
  file,
  color = "primary",
}: ResultsHeaderProps) => {
  const openPath = () => {
    const path = directory || file || "";
    window.settings.openPath(path);
  };

  const renderMessage = () => {
    return (
      <Typography
        color={color === "error" ? color + ".main" : color + ".dark"}
        variant="h4"
      >
        {message.split("**").map((part, index) =>
          index % 2 === 0 ? (
            part
          ) : (
            <Box component="span" color={color + ".main"} key={index}>
              {part}
            </Box>
          )
        )}
      </Typography>
    );
  };

  return (
    <FlexBetween gap="40px" padding="10px" width="100%">
      {renderMessage()}

      <IconButton
        color={color}
        onClick={openPath}
        //
      >
        {directory && <FolderOutlined />}
        {file && <ArticleOutlined />}
      </IconButton>
    </FlexBetween>
  );
};

export default ResultsHeader;

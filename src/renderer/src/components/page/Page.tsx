import { FlexBetween } from "../flex";

const Page = ({ children }) => {
  return (
    <FlexBetween width="100%" height="100%" gap="20px" padding="30px 20px">
      {children}
    </FlexBetween>
  );
};

export default Page;

import { Button, CircularProgress, Typography, useTheme } from "@mui/material";
import { FlexCenter, FlexColumn, FlexColumnStart } from "../flex";
import VendorToggle from "./vendorToggle";
import { LocalLibrary } from "@mui/icons-material";
import { SortOptions, VendorRecord, VendorVersions } from "src/types/vendors";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import VendorServiceInstance from "../../service/VendorService";

type Props = {
  selected: VendorRecord[];
  setSelected: (vendor: VendorRecord | VendorRecord[]) => void;
  query: string | null;
  sortBy: string;
  reload?: boolean;
  selectAll?: boolean;
  version: VendorVersions;
};

const VendorList = ({
  selected,
  setSelected,
  sortBy,
  query,
  reload,
  selectAll,
  version,
}: Props) => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const { auth } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  const [vendors, setVendors] = useState<VendorRecord[]>([]);

  const hiddenVendors =
    query == null || query == ""
      ? []
      : vendors.filter(
          (v) => !v.name.toLowerCase().includes(query.toLowerCase())
        );

  const resetVendorList = (version?: VendorVersions) => {
    const fetchVendors = async () => {
      await VendorServiceInstance.refreshVendors();
      let vendorsResponse = await VendorServiceInstance.getVendors(
        sortBy as SortOptions
      );

      if (version === "5.0")
        vendorsResponse = await VendorServiceInstance.get_5_0_Vendors(
          sortBy as SortOptions
        );

      if (version === "5.1")
        vendorsResponse = await VendorServiceInstance.get_5_1_Vendors(
          sortBy as SortOptions
        );

      // Make a full copy to avoid reference issues. Passing the array directly will cause the component to not re-render.
      // Since it already has a reference to the array, it is considered the same and will not re-render when the array is updated.
      const newVendors = JSON.parse(JSON.stringify(vendorsResponse));

      setVendors([...newVendors]);

      setIsLoading(false);
    };

    fetchVendors();
  };

  useEffect(
    () => (selectAll ? setSelected(vendors) : setSelected([])),
    [selectAll]
  );

  //
  useEffect(() => {
    if (auth) VendorServiceInstance.setPassword(auth.password);
    resetVendorList(version);
  }, [auth]);

  useEffect(() => {
    resetVendorList(version);
  }, [version, reload, sortBy]);

  // Filter Selected Vendors based on the selected version
  useEffect(() => {
    if (version === "All") return;
    const filtered = selected.filter((v) => {
      return version === "5.0"
        ? v.data5_0 !== undefined
        : v.data5_1 !== undefined;
    });
    if (JSON.stringify(filtered) !== JSON.stringify(selected)) {
      setSelected(filtered);
    }
  }, [version, selected]);

  const renderVendorToggles = () => {
    if (vendors.length === 0)
      return (
        <FlexColumn width="100%" height="100%" gap="10px">
          <LocalLibrary color="primary" fontSize="large" />

          <Typography variant="h4" fontSize={16} color="primary">
            {version === "All"
              ? "No vendors found in your app."
              : "No vendors compliant with COUNTER " + version + " were found."}
          </Typography>

          <Typography variant="body1" fontSize={16} color="primary">
            Import a TSV file to add vendors or add one manually.
          </Typography>

          {location !== "/vendors" && (
            <Button
              variant="text"
              onClick={() => navigate("/vendors")}
              sx={{
                borderRadius: "25px",
                padding: "0 20px",
              }}
            >
              Go to Vendors Page
            </Button>
          )}
        </FlexColumn>
      );

    let vendorToggles: JSX.Element[] = [];

    vendors
      .filter((v) => !hiddenVendors.includes(v))
      .map((vendor: VendorRecord, index) => {
        vendorToggles.push(
          <VendorToggle
            key={`${vendor.name}-${index}`}
            vendor={vendor}
            selected={selected.some((v) => v.id === vendor.id)}
            setSelected={() => setSelected(vendor)}
          />
        );
      });

    return vendorToggles;
  };

  return (
    <>
      <FlexColumnStart
        width="100%"
        maxWidth="100%"
        height="100%"
        overflow="auto"
        gap="8px"
        pr="5px"
      >
        {isLoading ? (
          <FlexCenter width="100%" height="100%">
            <CircularProgress />
          </FlexCenter>
        ) : (
          renderVendorToggles()
        )}
      </FlexColumnStart>

      <Typography variant="caption">
        {"You have "}
        <Typography
          fontSize={14}
          fontWeight={600}
          component="span"
          color={palette.primary.main}
        >
          {vendors.length}
        </Typography>
        {` vendor${vendors.length > 1 ? "s" : ""} in your app`}
      </Typography>
    </>
  );
};

export default VendorList;

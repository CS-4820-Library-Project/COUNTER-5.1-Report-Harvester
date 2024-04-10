import { useEffect, useState } from "react";
import DeleteVendorPopup from "./DeleteVendorPopup";

import {
  FlexBetween,
  FlexBetweenColumn,
  FlexColumnStart,
  FlexRowStart,
} from "../../components/flex";
import { Typography, useTheme } from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import InputField from "../../components/form/InputField";
import ActionButton from "../../components/buttons/ActionButton";
import { DeleteForeverOutlined, SaveOutlined } from "@mui/icons-material";
import * as Yup from "yup";
import TabButton from "../../components/buttons/TabButton";
import ToggleInput from "../../components/form/ToggleInput";
import VendorServiceInstance from "../../service/VendorService";
import { VendorData, VendorRecord, VendorVersions } from "src/types/vendors";
import { useNotification } from "../../components/NotificationBadge";
import TextButton from "../../components/buttons/TextButton";
import SupportedReportsModal from "./SupportedReportsModal";

type Props = {
  selectedVendor: VendorRecord | null;
  isAdding: boolean;
  refreshVendors: () => void;
};

/**
 * The "VendorForm" component is designed to facilitate the addition of new vendors to the system or the editing of existing vendor information.
 * It integrates with the application's backend services to fetch and update vendor details.
 * This form supports dynamic field rendering based on selected specifications (e.g., Counter 5.0 vs. Counter 5.1 standards)
 * and provides a user-friendly interface for data input, including validation feedback.
 *
 * Props:
 * - selectedVendor: The vendor record being edited, or null for adding a new vendor.
 * - isAdding: A boolean indicating if the form is in 'add' mode.
 * - refreshVendors: A function to refresh the list of vendors upon successful submission.
 */

const VendorForm = ({ selectedVendor, isAdding, refreshVendors }: Props) => {
  const { palette } = useTheme();
  const setNotification = useNotification();

  const [vendorsToValidate, setVendorToValidate] = useState<VendorData>();
  const [validatePopUp, setValidatePopUp] = useState<boolean>(false);

  const [isConfirmDelete, setConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<VendorVersions>("5.0"); // Default to Counter 5.1 specification.
  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState<VendorData>(); // Form initial values

  const commonSchema = Yup.object().shape({
    customerId: Yup.string().required("Required"),
    requestorId: Yup.string(),
    apiKey: Yup.string(),
    platform: Yup.string(),
    provider: Yup.string(),
    notes: Yup.string(),
    startingYear: Yup.number()
      .min(2024, "Minimum 2024")
      .max(2099, "Maximum 2099"),
    requireTwoAttemptsPerReport: Yup.boolean(),
    requireRequestsThrottled: Yup.boolean(),
  });

  const data5_1_Schema = commonSchema.shape({
    baseURL: Yup.string()
      .required("Required")
      .matches(
        /^(https|http):\/\/.*\/r51/i,
        'Base URL must start with "http://" or "https://" and include "/r51"'
      ),
  });

  const data5_0_Schema = commonSchema.shape({
    baseURL: Yup.string()
      .required("Required")
      .matches(
        /^(https|http):\/\//i,
        'Base URL must start with "http://" or "https://"'
      ),
    requireIpChecking: Yup.boolean(),
  });

  // Validation schema for the form, conditional based on the active specification tab.
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    data5_1: activeTab === "5.1" ? data5_1_Schema : Yup.object().shape({}),
    data5_0: activeTab === "5.0" ? data5_0_Schema : Yup.object().shape({}),
  });

  // Handles validating the vendor data against the selected specification.
  const handleValidateVendor = (vendorData: VendorData) => {
    setValidatePopUp(true);
    const { name, data5_0, data5_1 } = vendorData;
    const newVendor =
      activeTab === "5.0" ? { name, data5_0 } : { name, data5_1 };

    setVendorToValidate(newVendor);
  };

  const handleCloseValidatePopUp = () => {
    setValidatePopUp(false);
    setVendorToValidate(undefined);
  };

  // Handles saving changes to the vendor record, either updating an existing vendor or adding a new one.
  const handleSaveChanges = async (
    vendorData: VendorData,
    { resetForm }: FormikHelpers<VendorData>
  ) => {
    let result: boolean | null | number;

    // Send data according to the active tab, other data will be ignored. Not validated by schema.
    const { name, data5_0, data5_1 } = vendorData;
    const newVendor =
      activeTab === "5.0" ? { name, data5_0 } : { name, data5_1 };

    !isAdding && selectedVendor
      ? (result = await VendorServiceInstance.updateVendor(
          selectedVendor.id,
          newVendor
        ))
      : (result = await VendorServiceInstance.addVendor(newVendor));

    setNotification({
      type: result ? "success" : "error",
      message: result ? "Vendor Saved" : "Vendor couldn't be saved",
    });

    resetForm();
    refreshVendors();
  };

  // Handles setting up the form values based on the selected vendor or defaults for adding a new vendor.
  const handleFormValues = () => {
    const commonValues = {
      customerId: "",
      requestorId: "",
      baseURL: "",
      apiKey: "",
      platform: "",
      provider: "",
      notes: "",
      startingYear: 2024,
      requireTwoAttemptsPerReport: false,
      requireRequestsThrottled: false,
    };

    // Populate Form with Selected Vendor Data
    if (selectedVendor) {
      const { data5_1, data5_0, name } = selectedVendor;
      setInitialValues({
        name,
        data5_1: data5_1 || commonValues,
        data5_0: data5_0 || { ...commonValues, requireIpChecking: false },
      });
    }

    // Empty Form to Add Vendor
    else {
      setInitialValues({
        name: "",
        data5_1: {
          ...commonValues,
        },
        data5_0: {
          ...commonValues,
          requireIpChecking: false,
        },
      });
    }
  };

  // Resets the form back to its initial state.
  const handleUndoChanges = () => {
    setLoading(true);
    refreshVendors();
    handleFormValues();
  };

  const handleDeleteVendor = () => {
    if (selectedVendor) {
      const result = VendorServiceInstance.deleteVendor(
        selectedVendor.id,
        activeTab
      );
      const notification = result
        ? { type: "success" as const, message: "Vendor Deleted" }
        : { type: "error" as const, message: "Error Deleting Vendor" };

      setNotification(notification);
    }

    handleConfirmDeleteClose();
    refreshVendors();
  };

  const handleConfirmDelete = () => setConfirmDelete(true);

  const handleConfirmDeleteClose = () => setConfirmDelete(false);

  // Effects for initializing form values based on props and re-initializing when necessary.
  useEffect(() => {
    setLoading(true);
    handleFormValues();
  }, [selectedVendor, isAdding]);

  // Update view based on vendor content version
  useEffect(() => {
    if (selectedVendor) {
      const { data5_1, data5_0 } = selectedVendor;
      if (data5_1 && !data5_0) setActiveTab("5.1");
      if (data5_0 && !data5_1) setActiveTab("5.0");
    }
  }, [selectedVendor]);

  // Everytime the form changes - Refresh Form
  useEffect(() => setLoading(false), [loading]);

  return (
    <FlexColumnStart width="100%" height="100%">
      {/* Render form UI components, such as specification tabs, input fields, and action buttons */}
      {/* Conditional rendering for loading states and the delete confirmation popup */}
      {/* Tabs */}
      <FlexRowStart width="100%" ml="-1px">
        <TabButton
          isActive={activeTab === "5.1"}
          label="Counter 5.1"
          onClick={() => setActiveTab("5.1")}
        />
        <TabButton
          isActive={activeTab === "5.0"}
          label="Counter 5.0"
          onClick={() => setActiveTab("5.0")}
        />
      </FlexRowStart>

      {/* Form */}
      <FlexColumnStart
        className="invisible-scroll"
        position="relative"
        zIndex={4}
        width="100%"
        gap="0px"
        height="100%"
        padding=" 20px"
        pb="50px"
        borderRadius=" 0 25px 25px 25px"
        sx={{
          outline: `${palette.primary.main} solid 1px`,
          boxShadow:
            selectedVendor || isAdding
              ? `0 0 10px ${palette.primary.main}`
              : "none",
        }}
        overflow="auto"
      >
        {/* Fields */}
        {!loading && initialValues && (
          <Formik
            initialValues={initialValues}
            onSubmit={handleSaveChanges}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {({ values }) => (
              <Form className="form expand">
                <FlexBetween width="100%">
                  <Typography variant="h3" color="primary">
                    {(!selectedVendor ? "Add New " : "Edit ") +
                      "Vendor " +
                      activeTab}
                  </Typography>

                  <TextButton onClick={() => handleValidateVendor(values)}>
                    Validate Vendor
                  </TextButton>
                </FlexBetween>

                <FlexBetweenColumn width="100%" height="100%">
                  {/* Common Fields */}
                  <InputField
                    ratio={0.3}
                    type="text"
                    name="name"
                    label="Name*"
                  />

                  {/* COUNTER 5.1 FIELDS */}
                  {activeTab === "5.1" && (
                    <>
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_1.baseURL"
                        label="Base URL*"
                      />
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_1.customerId"
                        label="Customer ID*"
                      />
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_1.requestorId"
                        label="Requestor ID (Optional)"
                      />

                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_1.apiKey"
                        label="API Key (Optional)"
                      />
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_1.platform"
                        label="Platform (Optional)"
                      />
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_1.provider"
                        label="Provider (Optional)"
                      />
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_1.startingYear"
                        label="Starting Year (Optional)"
                      />
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_1.notes"
                        label="Notes (Optional)"
                      />
                      {/* Toggles */}
                      <ToggleInput
                        name="data5_1.requireTwoAttemptsPerReport"
                        label="Does it require two attempts per report?*"
                      />
                      <ToggleInput
                        name="data5_1.requireRequestsThrottled"
                        label="Does it need requests throttled?* "
                      />
                    </>
                  )}

                  {/* COUNTER 5.0 FIELDS */}
                  {activeTab === "5.0" && (
                    <>
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_0.baseURL"
                        label="Base URL*"
                      />
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_0.customerId"
                        label="Customer ID*"
                      />
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_0.requestorId"
                        label="Requestor ID (Optional)"
                      />

                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_0.apiKey"
                        label="API Key (Optional)"
                      />
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_0.platform"
                        label="Platform (Optional)"
                      />
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_0.provider"
                        label="Provider (Optional)"
                      />
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_1.startingYear"
                        label="Starting Year (Optional)"
                      />
                      <InputField
                        ratio={0.3}
                        type="text"
                        name="data5_0.notes"
                        label="Notes (Optional)"
                      />
                      <ToggleInput
                        name="data5_0.requireIpChecking"
                        label="Does it require  IP checking?*"
                      />
                      <ToggleInput
                        name="data5_0.requireTwoAttemptsPerReport"
                        label="Does it require two attempts per report?*"
                      />
                      <ToggleInput
                        name="data5_0.requireRequestsThrottled"
                        label="Does it need requests throttled?* "
                      />
                    </>
                  )}

                  {/* Actions */}
                  <FlexBetween pt="10px" width="100%">
                    <ActionButton
                      label="Save Changes"
                      icon={<SaveOutlined />}
                      // onClick={handleSaveChanges}
                      color="secondary"
                      submit
                    />

                    <ActionButton
                      label="Undo Changes"
                      icon={
                        <span className="material-symbols-outlined">undo</span>
                      }
                      color="background"
                      onClick={handleUndoChanges}
                    />

                    <ActionButton
                      label="Remove Vendor"
                      icon={<DeleteForeverOutlined />}
                      color="error"
                      onClick={handleConfirmDelete}
                      disabled={!selectedVendor}
                    />
                  </FlexBetween>
                </FlexBetweenColumn>
              </Form>
            )}
          </Formik>
        )}
      </FlexColumnStart>

      {/* DeleteVendorPopup Component */}
      <DeleteVendorPopup
        open={isConfirmDelete}
        onClose={handleConfirmDeleteClose}
        onDelete={handleDeleteVendor}
        vendor={selectedVendor}
      />

      {/* Validate Pop Up - Supported Reports Pop Up */}
      {vendorsToValidate && (
        <SupportedReportsModal
          isPopupOpen={validatePopUp}
          onClose={handleCloseValidatePopUp}
          vendor={vendorsToValidate}
        />
      )}
    </FlexColumnStart>
  );
};

export default VendorForm;

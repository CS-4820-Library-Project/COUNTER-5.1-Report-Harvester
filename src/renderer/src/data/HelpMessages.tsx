import Strong from "../components/text/Strong";

const HelpMessages = {
  vendors: {
    import: {
      replace: `This will erase all current vendors, replacing them with 
    those found in the supplied file. Are you sure you wish to continue?`,
      add: `This will add the new vendors found in the supplied file.
      And replace the existing vendors with the same id.`,
    },
    delete: `This action is permanent. By deleting a vendor you cannot recover it
    from the app. You have to import or add the vendor again.`,
  },
  searchReportsPage: {
    Help: {
      message: "You can search the Vendor Reports here.",
    },
  },
  settings: {
    //
    password: {
      set: `Set up password in your counter harvester app to secure your vendor's
      information within the app and encrypt the vendor data.`,

      unset: `Unset the password in your counter harvester app and decrypt your vendor data. 
      You can set a password again later.`,

      resetApp: `We are unable to recover your vendor information if you forgot your password.
      But you can reset the app to start afresh.`,

      resetAppAlert: `This action is permanent. By resetting the app, you will lose all your vendor data.
       And won't be able to recover it. Are you sure you want to continue?`,

      permanentAction: (
        <>
          You <Strong>WILL NOT</Strong> be able to recover your password if you
          forget it.
        </>
      ),

      strongPassword: (
        <>
          <li> Be at least 8 characters</li>
          <li> Include a lowercase letter</li>
          <li> Include an uppercase letter</li>
          <li> Include a number</li>
          <li> Include a special character</li>
        </>
      ),
    },
    //
    directories: {
      main: `In this directory, the app will save all standard view reports
      including yearly reports and other reports.`,
      custom: `In this directory, the app will save your custom reports. These
            reports are retrieved when you choose custom options when fetching
            your reports.`,
      search: `In this directory, the app will save your search results from your
      database query reports.`,
      vendorFile: `In this directory, the app will save your vendor file reports.`,
    },
  },
};

export default HelpMessages;

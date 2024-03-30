
/** A list of SUSHI API error code explanations, directly from the COUNTER documentation. */

export const SushiExceptionDictionary: Record<number, string> = {
    0: "Any. These messages will never be standardized, and service providers can design them as they see fit.",
    1000: "Service is executing a request, but due to internal errors cannot complete the request.",
    1010: "Service is too busy to execute the incoming request.",
    1020: "If the server sets a limit on the number of requests a client can make within a given timeframe.",
    1030: "There is insufficient data in the request to begin processing.",
    2000: "If Requestor ID is not recognized or not authorized by the service.",
    2020: "The service being called requires a valid APIKey to access usage data and the key provided was not valid.",
    3000: "The requested report name, version, or other means of identifying a report that the service can process is not matched against the supported reports.",
    3010: "Requested version of the data is not supported by the service.",
    3020: "Any format or logic errors involving date computations.",
    3030: "Service did not find any data for the date range specified.",
    3031: "Service has not yet processed the usage for one or more of the requested months.",
    3040: "Request could not be fulfilled in its entirety.",
    3050: "Request contained one or more parameters that are not recognized by the Server.",
    3060: "Request contained one or more Filter values in the ReportDefinition that are not supported by the Server.",
    3061: "A filter element includes multiple values in a pipe-delimited list.",
    3062: "Request contained one or more ReportAttribute values in the ReportDefinition that are not supported.",
    3070: "A required filter was not included in the request.",
    3071: "A required report attribute was not included in the request.",
    3080: "The requested value for limit exceeds the server limit."
};


/** A generic SUSHI API error code explanation, whenever a code is reserved for a specific vendor. */

export const SushiGeneralWarningMeaning: string = "Vendor-specific error / warning. Please contact the vendor for assistance."
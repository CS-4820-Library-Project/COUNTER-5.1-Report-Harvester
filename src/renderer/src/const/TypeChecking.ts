import { IReport } from "src/renderer/src/interface/IReport";
import { IFetchError } from "src/renderer/src/interface/IFetchError";

// FETCHING

/** Returns true/false depending on whether or not the object passed to it is a report. */

export const isReport = (r: any): r is IReport => !!r?.reportHeader;

/** Returns true/false depending on whether or not the object passed to it is a fetch error. */

export const isFetchError = (f: any): f is IFetchError => !!f?.code;

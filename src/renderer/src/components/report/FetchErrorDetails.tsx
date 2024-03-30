import React from "react";
import {IFetchError} from "src/renderer/src/interface/IFetchError";

const FetchErrorDetails = ({ errP }) => {
    const err = errP as IFetchError
    return (
        <div>
            <h3>
                {err.code}: {err.message}
            </h3>
            <h4>Severity: {err.severity}</h4>
            <p>
                {err.meaning}
            </p>
        </div>
    )
};

export default FetchErrorDetails;

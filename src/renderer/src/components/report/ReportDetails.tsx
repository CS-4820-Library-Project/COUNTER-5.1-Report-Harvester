import React from "react";
import {IReport} from "src/renderer/src/interface/IReport"

const ReportDetails = ({ reportP }) => {
    const report = reportP as IReport;
    return (
        <div>
            <h2>{report.Report_Header.Report_Name}</h2>
            <p>Institution Name: {report.Report_Header.Institution_Name}</p>
            <h3>Report Items:</h3>
            <div>
                {report.Report_Items.map((item, index) => (
                    <div key={index}>
                        <h4>{item.Title}</h4>
                        <p>Publisher: {item.Publisher}</p>
                        <div>
                            {item.Performance.map((performance, idx) => (
                                <div key={idx}>
                                    <p>Period: {performance.Period.Begin_Date} to {performance.Period.End_Date}</p>
                                    <ul>
                                        {performance.Instance.map((instance, i) => (
                                            <li key={i}>
                                                {instance.Metric_Type}: {instance.Count}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportDetails;

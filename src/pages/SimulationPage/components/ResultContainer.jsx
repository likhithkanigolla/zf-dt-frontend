import React from 'react';

const ResultCard = ({ title, value }) => {
    return (
      <div className="result-card">
        <h5>{title}</h5>
        <p>{value}</p>
      </div>
    );
  };

const ResultContainer = ({ result, data, sensorValues,PermeateFlowRate }) => {
    return (
        <div style={{ flex: 1 }}>
            <div className="result-container">
                <p>Results:</p>
                <div className="result-cards">
                    <ResultCard
                        title="TDS Value(mg/L) - At SUMP"
                        value={result?.calculated_tds_value ?? "N/A"}
                    />
                    <ResultCard
                        title="Permeate Flow Rate(l/s)"
                        value={PermeateFlowRate ?? "N/A"}
                    />
                    <ResultCard
                        title="Final TDS Concentration After RO Tank(mg/L)"
                        value={result?.final_tds_concentration_after_ro_tank ?? "N/A"}
                    />
                    <ResultCard
                        title="Cycle Count"
                        value={result?.cycle_count ?? "N/A"}
                    />
                    <ResultCard
                        title="Time Estimation (hours)"
                        value={result?.time_estimation_hours ?? "N/A"}
                    />
                </div>
                <br></br>
                <div className="result-cards">
                {Object.entries(sensorValues).map(([title, value], index) => (
                  <ResultCard key={index} title={title} value={value} />
                ))}
              </div>
              <br></br>
              <div className="result-cards">
                {data.map((item, index) => (
                  <ResultCard key={index} title={item.title} value={item.value} />
                ))}
              </div>
            <br />
            </div>
        </div>
    );
};

export default ResultContainer;
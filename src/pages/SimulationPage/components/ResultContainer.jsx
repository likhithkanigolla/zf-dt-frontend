import React from 'react';

const ResultCard = ({ title, value, previousValue }) => {
  const difference = value - previousValue;
  const differenceColor = difference < 0 ? 'red' : 'green';

  return (
    <div className="result-card">
      <h5>{title}</h5>
      <p>{value}</p>
      <p style={{ color: differenceColor }}>
        {difference.toFixed(3)} {difference < 0 ? '↓' : '↑'}
      </p>
    </div>
  );
};

const ResultContainer = ({ result, previousResult, data, sensorValues, PermeateFlowRate, PreviousPermeateFlowRate }) => {
  return (
    <div style={{ flex: 1 }}>
      <div className="result-container">
        <p>Results:</p>
        <div className="result-cards">
          <ResultCard
            title="TDS Value(mg/L) - At SUMP"
            value={result?.calculated_tds_value ?? "N/A"}
            previousValue={previousResult?.calculated_tds_value ?? 0}
          />
          <ResultCard
            title="Permeate Flow Rate(l/s)"
            value={PermeateFlowRate ?? "N/A"}
            previousValue={PreviousPermeateFlowRate ?? 0}
          />
          <ResultCard
            title="Final TDS Concentration After RO Tank(mg/L)"
            value={result?.final_tds_concentration_after_ro_tank ?? "N/A"}
            previousValue={previousResult?.final_tds_concentration_after_ro_tank ?? 0}
          />
          <ResultCard
            title="Cycle Count"
            value={result?.cycle_count ?? "N/A"}
            previousValue={previousResult?.cycle_count ?? 0}
          />
          <ResultCard
            title="Time Estimation (hours)"
            value={result?.time_estimation_hours ?? "N/A"}
            previousValue={previousResult?.time_estimation_hours ?? 0}
          />
        </div>
        <br></br>
        <div className="result-cards">
          {Object.entries(sensorValues).map(([title, value], index) => (
            <ResultCard
              key={index}
              title={title+"(Virtual Sensor)"}
              value={value}
              // previousValue={result?.previous_sensor_values?.[title] ?? 0}
            />
          ))}
        </div>
        <br></br>
        <div className="result-cards">
          {data.map((item, index) => (
            <ResultCard
              key={index}
              title={item.title}
              value={item.value}
              previousValue={item.previousValue ?? 0}
            />
          ))}
        </div>
        <br />
      </div>
    </div>
  );
};

export default ResultContainer;
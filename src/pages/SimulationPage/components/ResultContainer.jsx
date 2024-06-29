import React from 'react';

const ResultCard = ({ title, value, previousValue }) => {
  const difference = value - previousValue;
  const differenceColor = difference < 0 ? 'red' : 'green';

  return (
    <div className="result-card">
      <h5>{title}</h5>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '0vw' }}>
        <p>{value}</p>
        <p style={{ color: differenceColor, marginLeft: '10px' }}>
          {difference.toFixed(3)} {difference < 0 ? '↓' : '↑'}
        </p>
      </div>
    </div>
  );
};

const ResultContainer = ({ result, previousResult, data, sensorValues, PermeateFlowRate, PreviousPermeateFlowRate }) => {
  return (
    <div style={{ flex: 1}}>
      <div className="result-container">
        <div style={{ backgroundColor: '#123462',
           padding: '0%', 
           textAlign: 'center',
          height : '2.6vw',
           width: '17vw',
           borderRadius: '0.3vw',
           color: 'white' }}>
          <h2>Results:</h2>
        </div>
        <div className="result-cards">
          <ResultCard
            title="TDS Value(mg/L) - At SUMP"
            value={result?.calculated_tds_value.toFixed(4) ?? "N/A"}
            previousValue={previousResult?.calculated_tds_value ?? 0}
          />
          <ResultCard
            title="Permeate Flow Rate(l/s)"
            value={PermeateFlowRate.toFixed(4) ?? "N/A"}
            previousValue={PreviousPermeateFlowRate ?? 0}
          />
          <ResultCard
            title="Final TDS After RO(mg/L)"
            value={result?.final_tds_concentration_after_ro_tank.toFixed(4) ?? "N/A"}
            previousValue={previousResult?.final_tds_concentration_after_ro_tank ?? 0}
          />
          <ResultCard
            title="Cycle Count"
            value={result?.cycle_count ?? "N/A"}
            previousValue={previousResult?.cycle_count ?? 0}
          />
          <ResultCard
            title="Time Estimation (hours)"
            value={result?.time_estimation_hours.toFixed(4) ?? "N/A"}
            previousValue={previousResult?.time_estimation_hours ?? 0}
          />
        </div>
        <br></br>
        <div className="result-cards">
          {Object.entries(sensorValues).map(([title, value], index) => (
            <ResultCard
              key={index}
              title={title + "(Virtual Sensor)"}
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

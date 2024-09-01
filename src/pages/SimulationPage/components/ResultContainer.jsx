import React from 'react';
import LineGraph from './LineGraph/Graph';

const ResultTable = ({ title, value, previousValue }) => {
  const difference = value - previousValue;
  const differenceColor = difference < 0 ? 'red' : 'green';

  return (
    <tr style={{ borderBottom: '1px solid #ddd' , backgroundColor: 'white', width: '2vw'}}>
      <td style={{ padding: '0.620rem', 
        textAlign: 'left', 
        fontWeight: 'bold', 
        width: '2vw', 
        fontSize: '1.2vw'
        }}>{title}</td>
      <td style={{ padding: '0.520rem', textAlign: 'center' }}>{value}
      </td>

      <td style={{ padding: '0.520rem', textAlign: 'center', color: differenceColor, fontSize: '1.2vw'}}>
        {difference.toFixed(2)} {difference < 0 ? '↓' : '↑'}
      </td>
    </tr>
  );
};

const ResultContainer = ({ result, previousResult, data, sensorValues, PermeateFlowRate, PreviousPermeateFlowRate, datagraph , flowgraph}) => {
  return (
    <div style={{ flex: 1, width: '2vw'}}>
      <h1 style={{ textAlign: 'center',
         color: '#123462',
         fontSize: '2.5vw',
         marginBottom: '1vw',
         marginTop: '0.6vw',
         }}>Results</h1>
      <LineGraph data={datagraph} title={'IMPURITIES vs TDS(ppm) Timeseries'} feild={'tds'}/>
      <LineGraph data={flowgraph} title={'Permeative Flow Rate(L/S)'} feild={'flowrate'}/>
      <div className="result-container" style={{ height:"9vw",  marginLeft: '0.5vw', width:'20vw' }}>
        <table style={{  marginTop: '-1vw', borderCollapse: 'collapse', border: '0.063rem solid #ddd'}}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', width: '2vw', height: '1vw', }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '0.063rem solid #ddd', fontSize: '1.2vw' }}>Parameter</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '0.063rem solid #ddd', fontSize: '1.2vw' }}>Value</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '0.063rem solid #ddd', fontSize: '1.2vw' }}>Difference</th>
            </tr>
          </thead>
          <tbody>
            {/* <ResultTable
              title="TDS Value(mg/L) - At SUMP"
              value={result?.calculated_tds_value.toFixed(4) ?? "N/A"}
              previousValue={previousResult?.calculated_tds_value ?? 0}
            />
            <ResultTable
              title="Permeate Flow Rate(l/s)"
              value={PermeateFlowRate.toFixed(4) ?? "N/A"}
              previousValue={PreviousPermeateFlowRate ?? 0}
            /> */}
            <ResultTable
              title="Final TDS"
              value={result?.final_tds_concentration_after_ro_tank.toFixed(2) ?? "N/A"}
              previousValue={previousResult?.final_tds_concentration_after_ro_tank ?? 0}
            />
            <ResultTable
              title="RO Cycle Count"
              value={result?.cycle_count ?? "N/A"}
              previousValue={previousResult?.cycle_count ?? 0}
            />
            <ResultTable
              title="Time Est (hr)"
              value={result?.time_estimation_hours.toFixed(2) ?? "N/A"}
              previousValue={previousResult?.time_estimation_hours ?? 0}
            />
            {/* {Object.entries(sensorValues).map(([title, value], index) => (
              <ResultTable
                key={index}
                title={title}
                value={value.toFixed(2) ?? "N/A"}
                // previousValue={result?.previous_sensor_values?.[title] ?? 0}
              />
            ))} */}
            {data.map((item, index) => (
              <ResultTable
                key={index}
                title={item.title}
                value={item.value}
                previousValue={item.previousValue ?? 0}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultContainer;

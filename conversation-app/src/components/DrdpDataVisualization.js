import React, { useState } from 'react';

const DrdpDataVisualization = ({ assessments = [], domains = [] }) => {
  const [visualizationType, setVisualizationType] = useState('radar');
  const [selectedAssessments, setSelectedAssessments] = useState([]);

  // Graph color palette
  const colors = [
    '#4F46E5', // Indigo-600
    '#059669', // Emerald-600
    '#DC2626', // Red-600
    '#7C3AED', // Violet-600
    '#2563EB', // Blue-600
    '#D97706', // Amber-600
    '#4338CA', // Indigo-700
    '#065F46', // Emerald-800
  ];

  // Generate data for radar chart
  const generateRadarChartData = () => {
    if (!assessments.length) return [];

    // Use filtered assessments based on selection
    const assessmentsToShow = selectedAssessments.length > 0
      ? assessments.filter(assessment => selectedAssessments.includes(assessment.id))
      : assessments;

    return assessmentsToShow.map((assessment, index) => {
      const dataPoints = [];
      const color = colors[index % colors.length];

      domains.forEach(domain => {
        const domainId = domain.id === 'all' ? null : domain.id;
        if (!domainId) return;

        dataPoints.push({
          domain: domain.name,
          value: assessment.domains[domainId] || 0,
          color
        });
      });

      return {
        id: assessment.id,
        date: new Date(assessment.date).toLocaleDateString(),
        color,
        dataPoints
      };
    });
  };

  // Generate data for line chart
  const generateLineChartData = () => {
    if (!assessments.length) return [];

    // Use filtered assessments based on selection
    const assessmentsToShow = selectedAssessments.length > 0
      ? assessments.filter(assessment => selectedAssessments.includes(assessment.id))
      : assessments;

    const sortedAssessments = [...assessmentsToShow].sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );

    const datasets = [];
    domains.forEach((domain, domainIndex) => {
      const domainId = domain.id === 'all' ? null : domain.id;
      if (!domainId) return;

      const color = colors[domainIndex % colors.length];
      const dataPoints = sortedAssessments.map(assessment => ({
        date: new Date(assessment.date).toLocaleDateString(),
        value: assessment.domains[domainId] || 0
      }));

      datasets.push({
        id: domain.id,
        name: domain.name,
        color,
        dataPoints
      });
    });

    return datasets;
  };

  // Generate bar chart data
  const generateBarChartData = () => {
    if (!assessments.length) return [];

    // For bar chart, we use the latest assessment by default
    const latestAssessment = [...assessments].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    )[0];

    const dataPoints = [];
    domains.forEach((domain, index) => {
      const domainId = domain.id === 'all' ? null : domain.id;
      if (!domainId) return;

      dataPoints.push({
        domain: domain.name,
        value: latestAssessment.domains[domainId] || 0,
        color: colors[index % colors.length]
      });
    });

    return dataPoints;
  };

  // Toggle assessment selection for comparison
  const toggleAssessmentSelection = (assessmentId) => {
    if (selectedAssessments.includes(assessmentId)) {
      setSelectedAssessments(selectedAssessments.filter(id => id !== assessmentId));
    } else {
      setSelectedAssessments([...selectedAssessments, assessmentId]);
    }
  };

  // Get visualization data based on type
  const visualizationData =
    visualizationType === 'radar' ? generateRadarChartData() :
      visualizationType === 'line' ? generateLineChartData() :
        generateBarChartData();

  // Render radar chart
  const renderRadarChart = () => {
    if (!visualizationData.length) return null;

    // For this implementation, we're creating a mock radar chart
    // In a real-world scenario, you would use a chart library like Chart.js, D3.js, or Recharts
    return (
      <div className="border rounded-md p-6 bg-white">
        <div className="h-64 w-full flex items-center justify-center relative">
          {/* Radar chart mock */}
          <div className="w-48 h-48 rounded-full border-2 border-gray-200 relative">
            <div className="w-36 h-36 rounded-full border-2 border-gray-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-24 h-24 rounded-full border-2 border-gray-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-12 h-12 rounded-full border-2 border-gray-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* Spokes */}
            {domains.map((domain, index) => {
              if (domain.id === 'all') return null;
              const angle = (index * (360 / (domains.length - 1))) * (Math.PI / 180);
              const lineStyle = {
                transform: `rotate(${angle}rad)`,
                transformOrigin: 'center',
                top: '50%',
                left: 0,
                width: '100%',
                height: '1px'
              };

              return (
                <div
                  key={domain.id}
                  className="absolute bg-gray-300"
                  style={lineStyle}
                ></div>
              );
            })}

            {/* Data points for each assessment */}
            {visualizationData.map((assessment) => (
              <div key={assessment.id} className="absolute top-0 left-0 w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <polygon
                    points={assessment.dataPoints.map((dp, i) => {
                      const angle = (i * (360 / assessment.dataPoints.length)) * (Math.PI / 180);
                      const value = dp.value / 10; // Assuming max value is 10
                      const radius = 50 * value;
                      const x = 50 + radius * Math.cos(angle - Math.PI / 2);
                      const y = 50 + radius * Math.sin(angle - Math.PI / 2);
                      return `${x},${y}`;
                    }).join(' ')}
                    fill={`${assessment.color}33`} // 20% opacity
                    stroke={assessment.color}
                    strokeWidth="1"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render line chart
  const renderLineChart = () => {
    if (!visualizationData.length) return null;

    // For this implementation, we're creating a mock line chart
    return (
      <div className="border rounded-md p-6 bg-white">
        <div className="h-64 w-full flex items-end justify-between relative">
          {/* Y axis */}
          <div className="absolute bottom-0 left-0 w-10 h-full flex flex-col justify-between">
            <span className="text-xs text-gray-500">10</span>
            <span className="text-xs text-gray-500">7.5</span>
            <span className="text-xs text-gray-500">5</span>
            <span className="text-xs text-gray-500">2.5</span>
            <span className="text-xs text-gray-500">0</span>
          </div>

          {/* Grid lines */}
          <div className="absolute bottom-0 left-10 w-full h-full flex flex-col justify-between">
            <div className="w-full border-t border-gray-100"></div>
            <div className="w-full border-t border-gray-100"></div>
            <div className="w-full border-t border-gray-100"></div>
            <div className="w-full border-t border-gray-100"></div>
            <div className="w-full border-t border-gray-200"></div>
          </div>

          {/* Line chart */}
          <div className="absolute bottom-0 left-10 w-full h-full">
            {visualizationData.map(dataset => (
              <div key={dataset.id} className="absolute bottom-0 left-0 w-full h-full">
                <svg className="w-full h-full overflow-visible">
                  <polyline
                    points={dataset.dataPoints.map((dp, i, arr) => {
                      const x = (i / (arr.length - 1)) * 100;
                      const y = 100 - (dp.value * 10); // Assuming max value is 10
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke={dataset.color}
                    strokeWidth="2"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap mt-4">
          {visualizationData.map(dataset => (
            <div key={dataset.id} className="flex items-center mr-4 mb-2">
              <div className="w-3 h-3 mr-1" style={{ backgroundColor: dataset.color }}></div>
              <span className="text-xs">{dataset.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render bar chart
  const renderBarChart = () => {
    if (!visualizationData.length) return null;

    return (
      <div className="border rounded-md p-6 bg-white">
        <div className="h-64 w-full flex items-end justify-between relative">
          {/* Y axis */}
          <div className="absolute bottom-0 left-0 w-10 h-full flex flex-col justify-between">
            <span className="text-xs text-gray-500">10</span>
            <span className="text-xs text-gray-500">7.5</span>
            <span className="text-xs text-gray-500">5</span>
            <span className="text-xs text-gray-500">2.5</span>
            <span className="text-xs text-gray-500">0</span>
          </div>

          {/* Grid lines */}
          <div className="absolute bottom-0 left-10 w-full h-full flex flex-col justify-between">
            <div className="w-full border-t border-gray-100"></div>
            <div className="w-full border-t border-gray-100"></div>
            <div className="w-full border-t border-gray-100"></div>
            <div className="w-full border-t border-gray-100"></div>
            <div className="w-full border-t border-gray-200"></div>
          </div>

          {/* Bars */}
          <div className="absolute bottom-0 left-12 right-0 h-full flex items-end">
            {visualizationData.map((dp, index) => {
              const barWidth = 100 / visualizationData.length;
              const barHeight = dp.value * 10; // Percentage of height

              return (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  style={{ width: `${barWidth}%` }}
                >
                  <div
                    className="w-4/5 rounded-t"
                    style={{
                      height: `${barHeight}%`,
                      backgroundColor: dp.color
                    }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: '100%' }}>
                    {dp.domain.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Development Progress Visualization</h3>
        <div className="flex">
          <button
            className={`px-3 py-1 rounded-l-md text-sm ${visualizationType === 'radar'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            onClick={() => setVisualizationType('radar')}
          >
            Radar
          </button>
          <button
            className={`px-3 py-1 text-sm ${visualizationType === 'line'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            onClick={() => setVisualizationType('line')}
          >
            Line
          </button>
          <button
            className={`px-3 py-1 rounded-r-md text-sm ${visualizationType === 'bar'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            onClick={() => setVisualizationType('bar')}
          >
            Bar
          </button>
        </div>
      </div>

      {assessments.length > 0 ? (
        <>
          {/* Assessment selection for comparison */}
          {visualizationType !== 'bar' && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {visualizationType === 'radar' ? 'Compare Assessments:' : 'Select Domains:'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {assessments.map(assessment => (
                  <label
                    key={assessment.id}
                    className={`flex items-center px-3 py-1 rounded-md border cursor-pointer text-sm ${selectedAssessments.includes(assessment.id)
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={selectedAssessments.includes(assessment.id)}
                      onChange={() => toggleAssessmentSelection(assessment.id)}
                    />
                    {new Date(assessment.date).toLocaleDateString()}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Visualization */}
          <div className="mt-6">
            {visualizationType === 'radar' && renderRadarChart()}
            {visualizationType === 'line' && renderLineChart()}
            {visualizationType === 'bar' && renderBarChart()}
          </div>

          {/* Domains legend */}
          {visualizationType === 'radar' && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {domains.map(domain => {
                if (domain.id === 'all') return null;
                return (
                  <div key={domain.id} className="flex items-center text-sm">
                    <span className="font-medium">{domain.id}:</span>
                    <span className="ml-1 text-gray-600">{domain.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-40 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No assessment data available for visualization</p>
        </div>
      )}
    </div>
  );
};

export default DrdpDataVisualization; 
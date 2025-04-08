import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Bar, Line, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, RadialLinearScale);

// Component for chart controls
const ChartControls = ({ viewType, setViewType, chartType, setChartType, selectedDomain, setSelectedDomain, timePeriod, setTimePeriod, domains }) => (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">View Type</label>
                <select
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                >
                    <option value="individual">Individual Student</option>
                    <option value="class">Class Overview</option>
                    <option value="domain">Domain Analysis</option>
                    <option value="progress">Progress Over Time</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chart Type</label>
                <select
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="radar">Radar Chart</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain Filter</label>
                <select
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                >
                    <option value="all">All Domains</option>
                    {domains.map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                <select
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                >
                    <option value="recent">Most Recent</option>
                    <option value="last3">Last 3 Months</option>
                    <option value="last6">Last 6 Months</option>
                    <option value="lastyear">Last Year</option>
                </select>
            </div>
        </div>
    </div>
);

// Component for level legends
const LevelLegend = () => (
    <div className="flex flex-wrap gap-3 mb-4 text-sm">
        <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-1"></div>
            <span>Exploring</span>
        </div>
        <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-1"></div>
            <span>Building</span>
        </div>
        <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-1"></div>
            <span>Integrating</span>
        </div>
    </div>
);

// Component for data insights
const DataInsights = ({ chartData }) => {
    // Calculate insights only if we have valid chart data
    const insights = useMemo(() => {
        if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
            return { strongest: 'No data available', needsSupport: 'No data available' };
        }

        try {
            // Find domains with highest and lowest average scores
            const data = chartData.datasets[0].data;
            const labels = chartData.labels;

            if (!data || !labels || data.length === 0) {
                return { strongest: 'Insufficient data', needsSupport: 'Insufficient data' };
            }

            let maxIndex = 0;
            let minIndex = 0;

            for (let i = 1; i < data.length; i++) {
                if (data[i] > data[maxIndex]) maxIndex = i;
                if (data[i] < data[minIndex]) minIndex = i;
            }

            return {
                strongest: labels[maxIndex],
                needsSupport: labels[minIndex]
            };
        } catch (error) {
            console.error("Error calculating insights:", error);
            return { strongest: 'Error calculating insights', needsSupport: 'Error calculating insights' };
        }
    }, [chartData]);

    return (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Data Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-green-800">Strongest Area</h4>
                    <p className="text-sm text-green-700">{insights.strongest}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-yellow-800">Needs Support</h4>
                    <p className="text-sm text-yellow-700">{insights.needsSupport}</p>
                </div>
            </div>
        </div>
    );
};

// Main DrdpDataVisualization component
function DrdpDataVisualization({ assessments, students, measures, selectedStudent }) {
    // State for visualization controls
    const [viewType, setViewType] = useState('individual');
    const [chartType, setChartType] = useState('bar');
    const [selectedDomain, setSelectedDomain] = useState('all');
    const [timePeriod, setTimePeriod] = useState('recent');
    const [chartData, setChartData] = useState(null);

    // Extract available domains from the measures (memoized)
    const domains = useMemo(() => {
        const uniqueDomains = [...new Set(measures.map(m => m.domain))];
        return uniqueDomains;
    }, [measures]);

    // Map level names to numeric values for charting
    const levelToValue = useCallback((level) => {
        const levelMap = {
            'exploring-earlier': 1, 'exploring-middle': 2, 'exploring-later': 3,
            'building-earlier': 4, 'building-middle': 5, 'building-later': 6,
            'integrating-earlier': 7, 'integrating-middle': 8, 'integrating-later': 9
        };
        return levelMap[level] || 0;
    }, []);

    // Filter assessments based on student selection
    const studentAssessments = useMemo(() => {
        if (!selectedStudent) return assessments;
        return assessments.filter(a => a.studentId === selectedStudent.id);
    }, [assessments, selectedStudent]);

    // Prepare data for individual student view
    const prepareIndividualData = useCallback(() => {
        if (!selectedStudent || studentAssessments.length === 0) {
            return { labels: [], datasets: [] };
        }

        // Get the most recent assessment for the selected student
        const studentAssessmentsByDate = [...studentAssessments].sort((a, b) =>
            new Date(b.date) - new Date(a.date));
        const recentAssessment = studentAssessmentsByDate[0];

        if (!recentAssessment) return { labels: [], datasets: [] };

        // Filter measures by domain if a domain is selected
        let filteredMeasures = measures;
        if (selectedDomain !== 'all') {
            filteredMeasures = measures.filter(m => m.domain === selectedDomain);
        }

        // Map measure IDs to names for better readability
        const measureMap = {};
        filteredMeasures.forEach(m => {
            measureMap[m.id] = m.name;
        });

        // Prepare data for the chart
        const labels = [];
        const data = [];
        const measureEntries = recentAssessment.measures || [];

        measureEntries.forEach(measure => {
            const measureInfo = measures.find(m => m.id === measure.measureId);
            if (measureInfo && (!selectedDomain || selectedDomain === 'all' || measureInfo.domain === selectedDomain)) {
                labels.push(measure.measureId);
                data.push(levelToValue(measure.level));
            }
        });

        return {
            labels,
            datasets: [
                {
                    label: `${selectedStudent.name}'s Development Levels`,
                    data,
                    backgroundColor: data.map(value =>
                        value <= 3 ? 'rgba(239, 68, 68, 0.7)' :   // red for exploring
                            value <= 6 ? 'rgba(245, 158, 11, 0.7)' :  // yellow for building
                                'rgba(16, 185, 129, 0.7)'                 // green for integrating
                    ),
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1
                }
            ]
        };
    }, [selectedStudent, studentAssessments, measures, selectedDomain, levelToValue]);

    // Prepare data for class overview
    const prepareClassData = useCallback(() => {
        if (!students || !assessments || students.length === 0 || assessments.length === 0) {
            return { labels: [], datasets: [] };
        }

        // Get the most recent assessment for each student
        const studentData = {};
        students.forEach(student => {
            const studentAssessments = assessments
                .filter(a => a.studentId === student.id)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            if (studentAssessments.length > 0) {
                studentData[student.id] = {
                    name: student.name,
                    assessment: studentAssessments[0]
                };
            }
        });

        // Filter domains
        let domainToUse = selectedDomain;
        if (selectedDomain === 'all') {
            // If all domains selected, calculate average scores across all domains
            domainToUse = null;
        }

        // Calculate average level for each student
        const labels = [];
        const data = [];

        Object.values(studentData).forEach(({ name, assessment }) => {
            labels.push(name);

            // Filter measures by domain if needed
            let totalValue = 0;
            let count = 0;

            assessment.measures.forEach(measure => {
                const measureInfo = measures.find(m => m.id === measure.measureId);
                if (measureInfo && (!domainToUse || measureInfo.domain === domainToUse)) {
                    totalValue += levelToValue(measure.level);
                    count++;
                }
            });

            const averageValue = count > 0 ? totalValue / count : 0;
            data.push(averageValue);
        });

        return {
            labels,
            datasets: [
                {
                    label: domainToUse ? `Average Level in ${domainToUse}` : 'Average Development Level',
                    data,
                    backgroundColor: data.map(value =>
                        value <= 3 ? 'rgba(239, 68, 68, 0.7)' :   // red for exploring
                            value <= 6 ? 'rgba(245, 158, 11, 0.7)' :  // yellow for building
                                'rgba(16, 185, 129, 0.7)'                 // green for integrating
                    ),
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1
                }
            ]
        };
    }, [students, assessments, measures, selectedDomain, levelToValue]);

    // Prepare data for domain analysis
    const prepareDomainData = useCallback(() => {
        if (!assessments || assessments.length === 0) {
            return { labels: [], datasets: [] };
        }

        // Group measures by domain
        const domainMeasures = {};
        measures.forEach(measure => {
            if (!domainMeasures[measure.domain]) {
                domainMeasures[measure.domain] = [];
            }
            domainMeasures[measure.domain].push(measure.id);
        });

        // Calculate average level for each domain
        const domainsToShow = selectedDomain === 'all' ? Object.keys(domainMeasures) : [selectedDomain];
        const labels = domainsToShow;
        const data = [];

        // Filter assessments by student if one is selected
        const relevantAssessments = selectedStudent
            ? assessments.filter(a => a.studentId === selectedStudent.id)
            : assessments;

        // Get recent assessments
        const recentAssessments = {};
        relevantAssessments.forEach(assessment => {
            const studentId = assessment.studentId;
            if (!recentAssessments[studentId] || new Date(assessment.date) > new Date(recentAssessments[studentId].date)) {
                recentAssessments[studentId] = assessment;
            }
        });

        // Calculate domain averages
        domainsToShow.forEach(domain => {
            const domainIds = domainMeasures[domain] || [];
            let totalValue = 0;
            let count = 0;

            Object.values(recentAssessments).forEach(assessment => {
                assessment.measures.forEach(measure => {
                    if (domainIds.includes(measure.measureId)) {
                        totalValue += levelToValue(measure.level);
                        count++;
                    }
                });
            });

            const averageValue = count > 0 ? totalValue / count : 0;
            data.push(averageValue);
        });

        return {
            labels,
            datasets: [
                {
                    label: selectedStudent ? `${selectedStudent.name}'s Domain Averages` : 'Class Domain Averages',
                    data,
                    backgroundColor: data.map(value =>
                        value <= 3 ? 'rgba(239, 68, 68, 0.7)' :   // red for exploring
                            value <= 6 ? 'rgba(245, 158, 11, 0.7)' :  // yellow for building
                                'rgba(16, 185, 129, 0.7)'                 // green for integrating
                    ),
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1
                }
            ]
        };
    }, [assessments, measures, selectedDomain, selectedStudent, levelToValue]);

    // Prepare data for progress over time view
    const prepareProgressData = useCallback(() => {
        if (!selectedStudent || studentAssessments.length <= 1) {
            return { labels: [], datasets: [] };
        }

        // Sort assessments by date
        const sortedAssessments = [...studentAssessments]
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Filter by time period
        let filteredAssessments = sortedAssessments;
        if (timePeriod !== 'all') {
            const now = new Date();
            let cutoffDate;

            switch (timePeriod) {
                case 'last3':
                    cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
                    break;
                case 'last6':
                    cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
                    break;
                case 'lastyear':
                    cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
                    break;
                default:
                    // For 'recent', use the last 3 assessments at most
                    filteredAssessments = sortedAssessments.slice(-3);
            }

            if (timePeriod !== 'recent') {
                filteredAssessments = sortedAssessments.filter(assessment =>
                    new Date(assessment.date) >= cutoffDate);
            }
        }

        // If no assessments after filtering, return empty data
        if (filteredAssessments.length === 0) {
            return { labels: [], datasets: [] };
        }

        // Filter measures by domain if needed
        let relevantMeasureIds = measures.map(m => m.id);
        if (selectedDomain !== 'all') {
            relevantMeasureIds = measures
                .filter(m => m.domain === selectedDomain)
                .map(m => m.id);
        }

        // Calculate average levels for each assessment date
        const labels = filteredAssessments.map(a => a.date);
        const data = [];

        filteredAssessments.forEach(assessment => {
            let totalValue = 0;
            let count = 0;

            assessment.measures.forEach(measure => {
                if (relevantMeasureIds.includes(measure.measureId)) {
                    totalValue += levelToValue(measure.level);
                    count++;
                }
            });

            const averageValue = count > 0 ? totalValue / count : 0;
            data.push(averageValue);
        });

        return {
            labels,
            datasets: [
                {
                    label: 'Average Development Level Over Time',
                    data,
                    backgroundColor: 'rgba(99, 102, 241, 0.5)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    tension: 0.1
                }
            ]
        };
    }, [selectedStudent, studentAssessments, measures, selectedDomain, timePeriod, levelToValue]);

    // Update chart data when selections change
    useEffect(() => {
        let newData;

        switch (viewType) {
            case 'individual':
                newData = prepareIndividualData();
                break;
            case 'class':
                newData = prepareClassData();
                break;
            case 'domain':
                newData = prepareDomainData();
                break;
            case 'progress':
                newData = prepareProgressData();
                break;
            default:
                newData = prepareIndividualData();
        }

        setChartData(newData);
    }, [viewType, selectedDomain, timePeriod, selectedStudent, prepareIndividualData, prepareClassData, prepareDomainData, prepareProgressData]);

    // Chart rendering with options based on chart type
    const renderChart = useCallback(() => {
        if (!chartData || chartData.labels.length === 0) {
            return (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No data available for the selected filters.</p>
                </div>
            );
        }

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 9,
                    title: {
                        display: true,
                        text: 'Development Level'
                    },
                    ticks: {
                        callback: function (value) {
                            if (value === 0) return '';
                            if (value <= 3) return `Exploring (${value})`;
                            if (value <= 6) return `Building (${value - 3})`;
                            return `Integrating (${value - 6})`;
                        }
                    }
                }
            }
        };

        // Radar chart requires different options
        const radarOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 9,
                    ticks: {
                        stepSize: 3
                    }
                }
            }
        };

        switch (chartType) {
            case 'bar':
                return <Bar data={chartData} options={options} height={300} />;
            case 'line':
                return <Line data={chartData} options={options} height={300} />;
            case 'radar':
                return <Radar data={chartData} options={radarOptions} height={300} />;
            default:
                return <Bar data={chartData} options={options} height={300} />;
        }
    }, [chartType, chartData]);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-6">DRDP Data Visualization</h2>

                {/* Chart Controls */}
                <ChartControls
                    viewType={viewType}
                    setViewType={setViewType}
                    chartType={chartType}
                    setChartType={setChartType}
                    selectedDomain={selectedDomain}
                    setSelectedDomain={setSelectedDomain}
                    timePeriod={timePeriod}
                    setTimePeriod={setTimePeriod}
                    domains={domains}
                />

                {/* Legend */}
                <LevelLegend />

                {/* Chart Display */}
                <div className="bg-white p-4 rounded-lg h-80">
                    {renderChart()}
                </div>

                {/* Data Insights */}
                <DataInsights chartData={chartData} />
            </div>
        </div>
    );
}

export default DrdpDataVisualization; 
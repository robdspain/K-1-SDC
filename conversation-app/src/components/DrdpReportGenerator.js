import React, { useState } from 'react';

const DrdpReportGenerator = ({ student, assessments = [], domains = [] }) => {
  // State for report configuration
  const [reportType, setReportType] = useState('comprehensive');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(
    assessments.length > 0 ? assessments[0].id : null
  );
  const [includeDomains, setIncludeDomains] = useState(
    domains.filter(d => d.id !== 'all').map(d => d.id)
  );
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeObservations, setIncludeObservations] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Get selected assessment
  const selectedAssessment = assessments.find(a => a.id === selectedAssessmentId) || null;

  // Handle domain selection toggle
  const handleDomainToggle = (domainId) => {
    if (includeDomains.includes(domainId)) {
      setIncludeDomains(includeDomains.filter(id => id !== domainId));
    } else {
      setIncludeDomains([...includeDomains, domainId]);
    }
  };

  // Handle generate report
  const handleGenerateReport = () => {
    setGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      // In a real implementation, you would:
      // 1. Generate a PDF using a library like jsPDF or react-pdf
      // 2. Include the selected data in a well-formatted report
      // 3. Allow the user to download or print the report

      // Mock download operation
      alert('Report generated successfully! In a real implementation, this would download a PDF file.');
    }, 2000);
  };

  // Helper to get domain name by ID
  const getDomainName = (domainId) => {
    const domain = domains.find(d => d.id === domainId);
    return domain ? domain.name : domainId;
  };

  // Determine if generate button should be disabled
  const isGenerateDisabled = !selectedAssessment || includeDomains.length === 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">DRDP Report Generator</h3>

      {student && (
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h4 className="text-lg font-medium mb-2">Student Information</h4>
          <div className="flex items-center">
            {student.photoUrl && (
              <img
                src={student.photoUrl}
                alt={student.name}
                className="h-12 w-12 rounded-full mr-4"
              />
            )}
            <div>
              <p className="text-lg font-medium">{student.name}</p>
              <p className="text-sm text-gray-600">
                Grade: {student.grade} | Age: {student.age}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Report Configuration */}
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-4">Report Configuration</h4>

        {/* Report Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
          <div className="flex">
            <button
              className={`px-4 py-2 text-sm rounded-l-md ${reportType === 'comprehensive'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              onClick={() => setReportType('comprehensive')}
            >
              Comprehensive
            </button>
            <button
              className={`px-4 py-2 text-sm ${reportType === 'summary'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              onClick={() => setReportType('summary')}
            >
              Summary
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-r-md ${reportType === 'progress'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              onClick={() => setReportType('progress')}
            >
              Progress
            </button>
          </div>
        </div>

        {/* Assessment Selection */}
        <div className="mb-4">
          <label
            htmlFor="assessment-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select Assessment
          </label>
          <select
            id="assessment-select"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedAssessmentId || ''}
            onChange={(e) => setSelectedAssessmentId(parseInt(e.target.value))}
            disabled={assessments.length === 0}
          >
            {assessments.length === 0 ? (
              <option value="">No assessments available</option>
            ) : (
              assessments.map(assessment => (
                <option key={assessment.id} value={assessment.id}>
                  {new Date(assessment.date).toLocaleDateString()} - {assessment.type}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Domain Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Include Domains</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {domains.map(domain => {
              if (domain.id === 'all') return null;
              return (
                <label
                  key={domain.id}
                  className={`flex items-center px-3 py-2 rounded-md border cursor-pointer ${includeDomains.includes(domain.id)
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={includeDomains.includes(domain.id)}
                    onChange={() => handleDomainToggle(domain.id)}
                  />
                  <span>{domain.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Additional Options */}
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={includeNotes}
              onChange={(e) => setIncludeNotes(e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-700">Include Notes</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={includeObservations}
              onChange={(e) => setIncludeObservations(e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-700">Include Observations</span>
          </label>
        </div>
      </div>

      {/* Report Preview */}
      {selectedAssessment && (
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-2">Report Preview</h4>
          <div className="border rounded-md p-4 bg-gray-50">
            <h5 className="text-md font-medium mb-2">
              {reportType === 'comprehensive' ? 'Comprehensive DRDP Assessment Report' :
                reportType === 'summary' ? 'DRDP Assessment Summary' :
                  'DRDP Progress Report'}
            </h5>

            <p className="text-sm mb-2">
              <strong>Date:</strong> {new Date(selectedAssessment.date).toLocaleDateString()}
            </p>

            <p className="text-sm mb-2">
              <strong>Assessment Type:</strong> {selectedAssessment.type}
            </p>

            <p className="text-sm mb-2">
              <strong>Completed By:</strong> {selectedAssessment.completedBy}
            </p>

            <p className="text-sm mb-2">
              <strong>Domains Included:</strong> {includeDomains.map(getDomainName).join(', ')}
            </p>

            {reportType === 'comprehensive' && (
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  This report will include detailed information for each measure, including:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-500 ml-2">
                  <li>Developmental level ratings</li>
                  {includeNotes && <li>Teacher notes</li>}
                  {includeObservations && <li>Recorded observations</li>}
                </ul>
              </div>
            )}

            {reportType === 'summary' && (
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  This report will include aggregated developmental levels for each domain with brief descriptions.
                </p>
              </div>
            )}

            {reportType === 'progress' && (
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  This report will compare progress across multiple assessments with visualizations.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${isGenerateDisabled || generating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          onClick={handleGenerateReport}
          disabled={isGenerateDisabled || generating}
        >
          {generating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Report'
          )}
        </button>
      </div>
    </div>
  );
};

export default DrdpReportGenerator; 
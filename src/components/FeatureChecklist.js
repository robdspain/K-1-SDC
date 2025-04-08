import React from 'react';

function FeatureChecklist() {
  const features = [
    {
      title: 'Domains of Development',
      description: 'Support for different DRDP domains (ATL-REG, SED, LLD, etc.)',
      implemented: {
        current: 'Language and Literacy (LLD), Cognition/Math (COG)',
        planned: 'Support for all DRDP domains with customizable templates'
      },
      inMvp: true
    },
    {
      title: 'Developmental Levels',
      description: 'Track progress along DRDP\'s continuum',
      implemented: {
        current: 'Color-coded levels for Exploring, Building, and Integrating stages',
        planned: 'Automated milestone suggestions based on previous assessments'
      },
      inMvp: true
    },
    {
      title: 'Observation-Based Assessment',
      description: 'Record observations directly into the system',
      implemented: {
        current: 'Text-based observation entry and notes for each measure',
        planned: 'Photo/video uploads, speech-to-text, and AI suggestions'
      },
      inMvp: true
    },
    {
      title: 'Criteria-Based Rubrics',
      description: 'Aligned with DRDP scoring criteria',
      implemented: {
        current: 'Example behaviors for each measure',
        planned: 'Customizable rubrics for special education'
      },
      inMvp: true
    },
    {
      title: 'Rating Scales',
      description: 'Select appropriate developmental levels',
      implemented: {
        current: 'Interactive buttons for selecting developmental levels',
        planned: 'Automated rating suggestions and trend analysis'
      },
      inMvp: true
    },
    {
      title: 'Cultural & Linguistic Responsiveness',
      description: 'Support for diverse student populations',
      implemented: {
        current: 'None',
        planned: 'Multiple languages, customized cultural notes, bias detection'
      },
      inMvp: false
    },
    {
      title: 'Validity & Reliability',
      description: 'Ensure consistent assessment results',
      implemented: {
        current: 'None',
        planned: 'Double-rater agreement, inter-rater reliability scoring'
      },
      inMvp: false
    },
    {
      title: 'Comprehensive Coverage',
      description: 'Cover all relevant developmental areas',
      implemented: {
        current: 'Limited set of key measures from LLD and COG domains',
        planned: 'Complete measure set with custom reporting dashboards'
      },
      inMvp: true
    },
    {
      title: 'Observational & Authentic Assessment',
      description: 'Capture real classroom behaviors',
      implemented: {
        current: 'Text-based observation entry',
        planned: 'Mobile/tablet support, offline mode, family engagement'
      },
      inMvp: true
    },
    {
      title: 'Clear Scoring Criteria',
      description: 'Help teachers understand rating options',
      implemented: {
        current: 'Basic descriptions and examples for measures',
        planned: 'Video tutorials, AI-powered recommendations'
      },
      inMvp: true
    },
    {
      title: 'User-Friendly Design',
      description: 'Simple, intuitive UI with minimal learning curve',
      implemented: {
        current: 'Step-by-step assessment flow with progress indicators',
        planned: 'Drag-and-drop tools, customizable workflows'
      },
      inMvp: true
    },
    {
      title: 'Culturally Responsive & Inclusive',
      description: 'Support diverse learning contexts',
      implemented: {
        current: 'None',
        planned: 'Custom annotations, multilingual support, adaptive assessments'
      },
      inMvp: false
    },
    {
      title: 'Actionable Results & Data Insights',
      description: 'Visualize and export assessment data',
      implemented: {
        current: 'Basic results display',
        planned: 'Analytics dashboards, trend prediction, export options'
      },
      inMvp: true
    }
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">DRDP Feature Implementation Checklist</h2>
        <p className="text-indigo-100 text-sm mt-1">
          Track progress on implementing DRDP assessment components
        </p>
      </div>

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="inline-flex items-center mr-4">
              <span className="h-3 w-3 bg-green-500 rounded-full mr-1"></span>
              <span>Implemented in MVP</span>
            </span>
            <span className="inline-flex items-center">
              <span className="h-3 w-3 bg-yellow-500 rounded-full mr-1"></span>
              <span>Planned for Future</span>
            </span>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In MVP
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {features.map((feature, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {feature.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {feature.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>
                      <p className="font-medium">Current:</p>
                      <p className={feature.implemented.current === 'None' ? 'text-red-500' : ''}>
                        {feature.implemented.current}
                      </p>
                      <p className="font-medium mt-2">Planned:</p>
                      <p className="text-gray-400">{feature.implemented.planned}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {feature.inMvp ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Future
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-md font-medium text-gray-900 mb-2">MVP Implementation Notes</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>
              <strong>Current Focus:</strong> Core assessment functionality with key DRDP measures
            </li>
            <li>
              <strong>Next Phase:</strong> Enhanced data visualization, mobile support, and multilingual capabilities
            </li>
            <li>
              <strong>Future Vision:</strong> AI-assisted assessments, customizable workflows, and family engagement
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FeatureChecklist; 
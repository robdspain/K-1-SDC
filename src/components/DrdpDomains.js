import React, { useState } from 'react';

function DrdpDomains() {
  const [selectedView, setSelectedView] = useState('preschool');

  const preschoolDomains = [
    {
      id: 'ATL-REG',
      name: 'Approaches to Learning–Self-Regulation',
      description: 'How children learn through exploration and persistence, manage emotions, and maintain attention.',
      measures: [
        'Attention maintenance',
        'Engagement and persistence',
        'Curiosity and initiative',
        'Self-comforting and self-control of emotions and behavior'
      ]
    },
    {
      id: 'SED',
      name: 'Social and Emotional Development',
      description: 'How children develop close relationships with adults and peers, and understand and respond to emotions.',
      measures: [
        'Identity of self in relation to others',
        'Emotional understanding',
        'Relationships with adults and peers',
        'Symbolic and sociodramatic play'
      ]
    },
    {
      id: 'LLD',
      name: 'Language and Literacy Development',
      description: 'How children develop communication skills, engage with literature, and build early reading and writing skills.',
      measures: [
        'Receptive and expressive language',
        'Interest in literacy activities',
        'Comprehension of books and stories',
        'Early writing skills'
      ]
    },
    {
      id: 'ELD',
      name: 'English-Language Development',
      description: 'How children who are dual language learners develop skills to communicate in English.',
      note: 'Only for dual language learners',
      measures: [
        'Comprehension of English',
        'Self-expression in English',
        'Participation in English literacy activities',
        'Knowledge of print and letters in English'
      ]
    },
    {
      id: 'COG',
      name: 'Cognition, Including Math and Science',
      description: 'How children develop mathematical thinking, scientific reasoning, and problem-solving skills.',
      measures: [
        'Spatial relationships',
        'Cause and effect',
        'Number sense and mathematical operations',
        'Patterning and shapes',
        'Scientific inquiry'
      ]
    },
    {
      id: 'PD-HLTH',
      name: 'Physical Development–Health',
      description: 'How children develop fine and gross motor skills, personal care routines, and an understanding of healthy practices.',
      measures: [
        'Perceptual-motor skills and movement concepts',
        'Gross and fine motor development',
        'Nutrition, safety, and hygiene'
      ]
    },
    {
      id: 'HSS',
      name: 'History-Social Science',
      description: 'How children develop an understanding of themselves in time and place, and their role in social systems.',
      measures: [
        'Sense of time',
        'Sense of place and environment',
        'Responsible conduct and conflict negotiation'
      ]
    },
    {
      id: 'VPA',
      name: 'Visual and Performing Arts',
      description: 'How children engage with and express themselves through various artistic mediums.',
      measures: [
        'Visual art',
        'Music',
        'Dance',
        'Drama'
      ]
    }
  ];

  const kindergartenDomains = [
    {
      id: 'ATL-REG',
      name: 'Approaches to Learning–Self-Regulation',
      description: 'How children manage attention, engage with learning materials, and regulate emotions and behavior.',
      measures: [
        'Engagement and persistence',
        'Curiosity and initiative',
        'Self-regulation of emotions and behavior'
      ]
    },
    {
      id: 'SED',
      name: 'Social and Emotional Development',
      description: 'How children develop identity, relationships, and social-emotional understanding.',
      measures: [
        'Understanding self and relationships',
        'Emotional understanding',
        'Social interactions with peers and adults'
      ]
    },
    {
      id: 'LLD',
      name: 'Language and Literacy Development',
      description: 'How children develop communication, reading, and writing skills aligned with early academic expectations.',
      measures: [
        'Understanding and using language',
        'Engaging with books and print',
        'Writing development'
      ]
    },
    {
      id: 'ELD',
      name: 'English-Language Development',
      description: 'How English learners develop English language skills in academic and social contexts.',
      note: 'For English learners',
      measures: [
        'Comprehension and expression in English',
        'Developing English literacy skills'
      ]
    },
    {
      id: 'COG',
      name: 'Cognition, Including Math and Science',
      description: 'How children develop mathematical concepts, reasoning, and scientific understanding.',
      measures: [
        'Problem-solving and reasoning',
        'Mathematical and scientific thinking'
      ]
    },
    {
      id: 'PD-HLTH',
      name: 'Physical Development–Health',
      description: 'How children develop physical coordination, health awareness, and self-care skills.',
      measures: [
        'Motor development',
        'Personal care and health habits'
      ]
    },
    {
      id: 'HSS',
      name: 'History-Social Science',
      description: 'How children develop understanding of social systems, rules, community, and personal history.',
      measures: [
        'Understanding rules, roles, and social systems',
        'Developing a sense of time and place'
      ]
    },
    {
      id: 'VPA',
      name: 'Visual and Performing Arts',
      description: 'How children engage with artistic expression and appreciation in various forms.',
      measures: [
        'Creating and responding to art, music, and drama'
      ]
    },
    {
      id: 'SPAN',
      name: 'Language and Literacy in Spanish',
      description: 'How children in bilingual programs develop Spanish language and literacy skills.',
      note: 'For bilingual programs',
      measures: [
        'Spanish language and literacy development'
      ]
    },
    {
      id: 'COG-MATH',
      name: 'Measurement and Geometry',
      description: 'How children develop spatial understanding, measurement concepts, and geometric reasoning.',
      measures: [
        'Understanding shapes, patterns, and measurement'
      ]
    },
    {
      id: 'COG-SCI',
      name: 'Inquiry and Observation in Science',
      description: 'How children develop scientific inquiry skills through hands-on exploration and experimentation.',
      measures: [
        'Exploring scientific concepts through hands-on observation and experimentation'
      ]
    }
  ];

  const keyDifferences = [
    { feature: 'Number of Domains', preschool: '8', kindergarten: '11' },
    { feature: 'Focus', preschool: 'Foundational early learning skills', kindergarten: 'School readiness and academic skills' },
    { feature: 'Language & Literacy', preschool: 'Basic engagement with books, storytelling', kindergarten: 'Advanced comprehension, reading, and writing' },
    { feature: 'Mathematics', preschool: 'Early number sense, patterning', kindergarten: 'Measurement, geometry, and complex problem-solving' },
    { feature: 'Scientific Thinking', preschool: 'Observing, exploring materials', kindergarten: 'Scientific reasoning and inquiry' }
  ];

  const implementationAreas = [
    {
      title: 'Modular Design by Developmental Domain',
      description: 'The app organizes assessment by domain with a comprehensive dashboard view.',
      current: 'Basic domain structure for LLD and COG domains',
      planned: 'Complete implementation of all domains with customizable views'
    },
    {
      title: 'Observation & Documentation System',
      description: 'Teachers can document evidence through various media.',
      current: 'Text-based observation notes for each measure',
      planned: 'Photo/video uploads, voice recording, and tagging system'
    },
    {
      title: 'Rubric-Based Scoring',
      description: 'Interactive rating system aligned with developmental continuums.',
      current: 'Basic developmental level selection with color-coding',
      planned: 'Customizable rubrics and expanded developmental indicators'
    },
    {
      title: 'Data Visualization & Reports',
      description: 'Visual representations of progress and automated reporting.',
      current: 'Basic results display by measure',
      planned: 'Interactive charts, progress tracking, and shareable reports'
    },
    {
      title: 'Integration with Other Systems',
      description: 'Connectivity with existing school systems and data portability.',
      current: 'None',
      planned: 'SIS integration, data export (PDF/Excel), and API connectivity'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">DRDP Domain Structure</h2>
        <p className="text-indigo-100 text-sm mt-1">
          Comprehensive breakdown of Desired Results Developmental Profile domains and measures
        </p>
      </div>

      {/* View selector */}
      <div className="border-b border-gray-200">
        <div className="flex justify-center p-4">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setSelectedView('preschool')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${selectedView === 'preschool'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-indigo-300`}
            >
              TK/Preschool View
            </button>
            <button
              onClick={() => setSelectedView('kindergarten')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${selectedView === 'kindergarten'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-indigo-300`}
            >
              Kindergarten View
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Domain overview */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {selectedView === 'preschool'
              ? 'DRDP (2015) Preschool/TK View - 8 Domains'
              : 'DRDP (2015) Kindergarten View - 11 Domains'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(selectedView === 'preschool' ? preschoolDomains : kindergartenDomains).map(domain => (
              <div key={domain.id} className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-indigo-50 px-4 py-2 border-b">
                  <h4 className="font-medium text-indigo-800">{domain.id}: {domain.name}</h4>
                  {domain.note && (
                    <span className="inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mt-1">
                      {domain.note}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{domain.description}</p>
                  <h5 className="text-xs font-medium text-gray-700 uppercase mb-2">Measures:</h5>
                  <ul className="text-sm space-y-1 text-gray-500">
                    {domain.measures.map((measure, index) => (
                      <li key={index} className="flex">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key differences table */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Key Differences Between TK/Preschool and Kindergarten DRDP
          </h3>

          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preschool/TK DRDP
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kindergarten DRDP
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keyDifferences.map((diff, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {diff.feature}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {diff.preschool}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {diff.kindergarten}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Implementation areas */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Implementation in Our Web App
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {implementationAreas.map((area, index) => (
              <div key={index} className="border rounded-md overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h4 className="font-medium text-gray-900">{area.title}</h4>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{area.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-md">
                      <h5 className="text-xs font-medium text-green-800 uppercase mb-1">Current Implementation:</h5>
                      <p className="text-sm text-green-700">{area.current}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h5 className="text-xs font-medium text-blue-800 uppercase mb-1">Planned Enhancements:</h5>
                      <p className="text-sm text-blue-700">{area.planned}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Essential Skills & IEP Goals</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              DRDP measures directly correlated to Preschool Life Skills for IEP goal generation
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Skills Assessment</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Assess essential skills across DRDP domains to establish baselines for IEP goals
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">IEP Goal Generation</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Automatically generate appropriate IEP goals based on current skill levels
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Get Started</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a href="/essential-skills" className="text-indigo-600 hover:text-indigo-500">
                    Go to Essential Skills Assessment →
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrdpDomains; 
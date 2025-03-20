import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DrdpAssessment({ student, onSaveAssessment, onCancel }) {
  const navigate = useNavigate();
  const [selectedMeasures, setSelectedMeasures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // DRDP measures for Language and Literacy + Cognition (Math/Science)
  // In a real app, these would be loaded from an API
  const drdpMeasures = [
    { id: 'LLD1', name: 'Understanding of Language (Receptive)', domain: 'Language and Literacy Development' },
    { id: 'LLD2', name: 'Responsiveness to Language', domain: 'Language and Literacy Development' },
    { id: 'LLD3', name: 'Communication and Use of Language (Expressive)', domain: 'Language and Literacy Development' },
    { id: 'LLD4', name: 'Reciprocal Communication and Conversation', domain: 'Language and Literacy Development' },
    { id: 'LLD5', name: 'Interest in Literacy', domain: 'Language and Literacy Development' },
    { id: 'LLD6', name: 'Comprehension of Age-Appropriate Text', domain: 'Language and Literacy Development' },
    { id: 'LLD7', name: 'Concepts About Print', domain: 'Language and Literacy Development' },
    { id: 'LLD8', name: 'Phonological Awareness', domain: 'Language and Literacy Development' },
    { id: 'LLD9', name: 'Letter and Word Knowledge', domain: 'Language and Literacy Development' },
    { id: 'LLD10', name: 'Emergent Writing', domain: 'Language and Literacy Development' },
    { id: 'COG1', name: 'Spatial Relationships', domain: 'Cognition, Including Math and Science' },
    { id: 'COG2', name: 'Classification', domain: 'Cognition, Including Math and Science' },
    { id: 'COG3', name: 'Number Sense of Quantity', domain: 'Cognition, Including Math and Science' },
    { id: 'COG4', name: 'Number Sense of Math Operations', domain: 'Cognition, Including Math and Science' },
    { id: 'COG5', name: 'Measurement', domain: 'Cognition, Including Math and Science' }
  ];

  // Developmental levels
  const developmentLevels = [
    { value: 'exploring-earlier', label: 'Exploring Earlier', color: '#FFEBEE' },
    { value: 'exploring-middle', label: 'Exploring Middle', color: '#FFCDD2' },
    { value: 'exploring-later', label: 'Exploring Later', color: '#EF9A9A' },
    { value: 'building-earlier', label: 'Building Earlier', color: '#E3F2FD' },
    { value: 'building-middle', label: 'Building Middle', color: '#BBDEFB' },
    { value: 'building-later', label: 'Building Later', color: '#90CAF9' },
    { value: 'integrating-earlier', label: 'Integrating Earlier', color: '#E8F5E9' },
    { value: 'integrating-middle', label: 'Integrating Middle', color: '#C8E6C9' },
    { value: 'integrating-later', label: 'Integrating Later', color: '#A5D6A7' }
  ];

  // Initialize assessment measures
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      // Initialize with 5 measures for the MVP
      const initialMeasures = drdpMeasures.slice(0, 5).map(measure => ({
        measureId: measure.id,
        level: '',
        notes: '',
        observations: [],
        examples: getMeasureExamples(measure.id)
      }));

      setSelectedMeasures(initialMeasures);
      setLoading(false);
    }, 500);
  }, []);

  // Get example behaviors for a measure (in a real app, this would come from a database)
  const getMeasureExamples = (measureId) => {
    const examples = {
      'LLD1': [
        'Responds to simple comments or questions about a text read aloud',
        'Shows understanding of vocabulary in everyday conversations',
        'Follows one-step directions'
      ],
      'LLD2': [
        'Responds to language (verbal and nonverbal)',
        'Makes facial expressions or vocalizes in response to familiar words',
        'Follows along with simple songs or rhymes'
      ],
      'LLD3': [
        'Uses words, phrases, or simple sentences to communicate',
        'Combines words to express ideas',
        'Asks and answers simple questions'
      ],
      'LLD4': [
        'Engages in back-and-forth conversations',
        'Takes turns speaking with others',
        'Responds appropriately to others\' comments'
      ],
      'LLD5': [
        'Shows interest in books or print materials',
        'Asks to be read to or looks at books independently',
        'Points to pictures or text while being read to'
      ],
      'COG3': [
        'Counts small sets of objects',
        'Recognizes and names numerals',
        'Understands the relationship between numbers and quantities'
      ],
      'COG4': [
        'Adds and subtracts small numbers',
        'Understands concepts of adding to and taking away',
        'Solves simple addition or subtraction problems'
      ]
    };

    return examples[measureId] || [
      'Observe how the child demonstrates this measure',
      'Look for specific behaviors related to this developmental area',
      'Note the context in which skills are demonstrated'
    ];
  };

  const handleLevelChange = (index, level) => {
    const updatedMeasures = [...selectedMeasures];
    updatedMeasures[index].level = level;
    setSelectedMeasures(updatedMeasures);
  };

  const handleNotesChange = (index, notes) => {
    const updatedMeasures = [...selectedMeasures];
    updatedMeasures[index].notes = notes;
    setSelectedMeasures(updatedMeasures);
  };

  const handleAddObservation = (index, observation) => {
    if (!observation.trim()) return;

    const updatedMeasures = [...selectedMeasures];
    updatedMeasures[index].observations.push({
      text: observation,
      date: new Date().toISOString()
    });
    setSelectedMeasures(updatedMeasures);
  };

  const handleSaveAssessment = () => {
    // Check if all required fields are filled
    const isComplete = selectedMeasures.every(measure => measure.level);

    if (!isComplete) {
      setShowConfirmation(true);
      return;
    }

    // Otherwise save directly
    saveAssessment();
  };

  const saveAssessment = () => {
    const assessment = {
      id: Date.now().toString(),
      studentId: student.id,
      date: new Date().toISOString().split('T')[0],
      type: 'DRDP',
      measures: selectedMeasures.map(({ measureId, level, notes }) => ({
        measureId,
        level,
        notes
      }))
    };

    onSaveAssessment(assessment);
  };

  const navigateToPrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const navigateToNext = () => {
    if (activeIndex < selectedMeasures.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const currentMeasure = selectedMeasures[activeIndex];
  const measureInfo = currentMeasure ? drdpMeasures.find(m => m.id === currentMeasure.measureId) : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">DRDP Assessment for {student.name}</h2>
          <span className="text-sm">Grade: {student.grade}</span>
        </div>
        <p className="text-sm mt-1 text-indigo-100">
          {new Date().toLocaleDateString()} - Select developmental levels and add observations
        </p>
      </div>

      {/* Progress indicator */}
      <div className="bg-gray-100 px-4 py-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Measure {activeIndex + 1} of {selectedMeasures.length}</span>
          <div className="flex space-x-1">
            {selectedMeasures.map((measure, index) => (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-8 rounded-full cursor-pointer ${index === activeIndex
                    ? 'bg-indigo-500'
                    : measure.level
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Current measure */}
      {measureInfo && (
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{measureInfo.id}: {measureInfo.name}</h3>
                <p className="text-sm text-gray-500">{measureInfo.domain}</p>
              </div>
              <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                {selectedMeasures[activeIndex].level ? 'Rated' : 'Not Rated'}
              </div>
            </div>
          </div>

          {/* Examples */}
          <div className="mb-6 bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Examples to observe:</h4>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              {currentMeasure.examples.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>

          {/* Developmental levels */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Developmental Level:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {developmentLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleLevelChange(activeIndex, level.value)}
                  className={`p-3 border rounded-md text-sm 
                    ${currentMeasure.level === level.value
                      ? 'border-indigo-500 ring-2 ring-indigo-200'
                      : 'border-gray-200 hover:bg-gray-50'}`}
                  style={{ backgroundColor: currentMeasure.level === level.value ? level.color : '' }}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes and Evidence:
            </label>
            <textarea
              id="notes"
              rows="3"
              value={currentMeasure.notes}
              onChange={(e) => handleNotesChange(activeIndex, e.target.value)}
              placeholder="Add notes about observations, context, and evidence..."
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          {/* Observations */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Observations ({currentMeasure.observations.length}):
              </label>
            </div>
            {currentMeasure.observations.length > 0 ? (
              <ul className="space-y-2 mb-4">
                {currentMeasure.observations.map((observation, index) => (
                  <li key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <p className="text-sm">{observation.text}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(observation.date).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No observations added yet.</p>
            )}

            <div className="flex">
              <input
                type="text"
                id="new-observation"
                placeholder="Add a new observation..."
                className="block w-full border border-gray-300 rounded-l-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddObservation(activeIndex, e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = document.getElementById('new-observation');
                  handleAddObservation(activeIndex, input.value);
                  input.value = '';
                }}
                className="bg-indigo-100 text-indigo-700 px-4 rounded-r-md hover:bg-indigo-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              onClick={navigateToPrevious}
              disabled={activeIndex === 0}
              className={`px-4 py-2 rounded-md text-sm ${activeIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Previous
            </button>
            <div className="flex space-x-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              {activeIndex === selectedMeasures.length - 1 ? (
                <button
                  onClick={handleSaveAssessment}
                  className="px-4 py-2 bg-indigo-600 rounded-md text-sm text-white hover:bg-indigo-700"
                >
                  Save Assessment
                </button>
              ) : (
                <button
                  onClick={navigateToNext}
                  className="px-4 py-2 bg-indigo-600 rounded-md text-sm text-white hover:bg-indigo-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Incomplete Assessment</h3>
            <p className="text-gray-500 mb-4">
              Some measures don't have a developmental level selected. Are you sure you want to save this assessment?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  saveAssessment();
                }}
                className="px-4 py-2 bg-indigo-600 rounded-md text-sm text-white hover:bg-indigo-700"
              >
                Save Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DrdpAssessment; 
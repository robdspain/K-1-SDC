import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Component for displaying a single domain section with its measures
const DomainSection = ({ domain, measures, selectedMeasure, onSelectMeasure, getMeasureStatus }) => (
  <div key={domain} className="space-y-2">
    <h3 className="text-sm font-medium text-gray-900 border-b pb-1">
      {domain}
    </h3>
    <ul className="space-y-1">
      {measures.map(measure => {
        const status = getMeasureStatus(measure);
        return (
          <li key={measure.id}>
            <button
              onClick={() => onSelectMeasure(measure)}
              className={`w-full text-left px-2 py-1 rounded text-sm ${selectedMeasure && selectedMeasure.id === measure.id
                ? 'bg-indigo-100 text-indigo-700'
                : status === 'complete'
                  ? 'text-green-700 hover:bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center">
                <span className="mr-1">{measure.id}:</span>
                {status === 'complete' && (
                  <svg className="h-4 w-4 text-green-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{measure.name}</span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  </div>
);

// Component for displaying measure examples
const LevelExamplesDisplay = ({ selectedMeasure, levelExamples, developmentLevels }) => (
  <div className="mb-6 bg-gray-50 p-4 rounded-md">
    <h3 className="text-md font-medium text-gray-900 mb-2">Examples for Each Level</h3>
    <div className="space-y-3">
      {developmentLevels.map(level => {
        const domainExamples = levelExamples[selectedMeasure.domain] || {};
        const example = domainExamples[level.value] || 'No example available for this level.';

        return (
          <div key={level.value} className="text-sm">
            <span className="font-medium">{level.label}:</span> {example}
          </div>
        );
      })}
    </div>
  </div>
);

// Component for observations list
const ObservationsList = ({ observations, onRemoveObservation }) => (
  observations.length === 0 ? (
    <p className="text-sm text-gray-500">No observations recorded yet.</p>
  ) : (
    <ul className="space-y-2">
      {observations.map((obs) => (
        <li key={obs.id} className="flex justify-between items-start border-b pb-2">
          <div className="flex-1">
            <p className="text-sm">{obs.text}</p>
            <p className="text-xs text-gray-500">Recorded: {obs.date}</p>
          </div>
          <button
            onClick={() => onRemoveObservation(obs.id)}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  )
);

// Progress indicator component
const ProgressIndicator = ({ assessedCount, totalCount }) => (
  <div>
    <span className="text-sm text-gray-500">
      Assessed {assessedCount} of {totalCount} measures
    </span>
    <div className="w-48 bg-gray-200 rounded-full h-2 mt-1">
      <div
        className="bg-indigo-600 h-2 rounded-full"
        style={{ width: `${(assessedCount / totalCount) * 100}%` }}
      ></div>
    </div>
  </div>
);

// Main DrdpAssessment component
function DrdpAssessment({ student, onSaveAssessment, onCancel }) {
  const navigate = useNavigate();

  // State management
  const [selectedMeasure, setSelectedMeasure] = useState(null);
  const [observations, setObservations] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [observationText, setObservationText] = useState('');
  const [levelNotes, setLevelNotes] = useState('');
  const [assessedMeasures, setAssessedMeasures] = useState([]);
  const [showExamples, setShowExamples] = useState(false);

  // All DRDP domains and measures
  const drdpMeasures = [
    // Language and Literacy Development (LLD)
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

    // Cognition, Including Math and Science (COG)
    { id: 'COG1', name: 'Spatial Relationships', domain: 'Cognition, Including Math and Science' },
    { id: 'COG2', name: 'Classification', domain: 'Cognition, Including Math and Science' },
    { id: 'COG3', name: 'Number Sense of Quantity', domain: 'Cognition, Including Math and Science' },
    { id: 'COG4', name: 'Number Sense of Math Operations', domain: 'Cognition, Including Math and Science' },
    { id: 'COG5', name: 'Measurement', domain: 'Cognition, Including Math and Science' },
    { id: 'COG6', name: 'Patterning', domain: 'Cognition, Including Math and Science' },
    { id: 'COG7', name: 'Shapes', domain: 'Cognition, Including Math and Science' },
    { id: 'COG8', name: 'Cause and Effect', domain: 'Cognition, Including Math and Science' },
    { id: 'COG9', name: 'Inquiry Through Observation and Investigation', domain: 'Cognition, Including Math and Science' },
    { id: 'COG10', name: 'Documentation and Communication of Inquiry', domain: 'Cognition, Including Math and Science' },
    { id: 'COG11', name: 'Knowledge of the Natural World', domain: 'Cognition, Including Math and Science' },

    // Social and Emotional Development (SED)
    { id: 'SED1', name: 'Identity of Self in Relation to Others', domain: 'Social and Emotional Development' },
    { id: 'SED2', name: 'Social and Emotional Understanding', domain: 'Social and Emotional Development' },
    { id: 'SED3', name: 'Relationships and Social Interactions with Familiar Adults', domain: 'Social and Emotional Development' },
    { id: 'SED4', name: 'Relationships and Social Interactions with Peers', domain: 'Social and Emotional Development' },
    { id: 'SED5', name: 'Symbolic and Sociodramatic Play', domain: 'Social and Emotional Development' },

    // Approaches to Learning–Self-Regulation (ATL-REG)
    { id: 'ATL-REG1', name: 'Attention Maintenance', domain: 'Approaches to Learning–Self-Regulation' },
    { id: 'ATL-REG2', name: 'Self-Comforting', domain: 'Approaches to Learning–Self-Regulation' },
    { id: 'ATL-REG3', name: 'Imitation', domain: 'Approaches to Learning–Self-Regulation' },
    { id: 'ATL-REG4', name: 'Curiosity and Initiative in Learning', domain: 'Approaches to Learning–Self-Regulation' },
    { id: 'ATL-REG5', name: 'Self-Control of Feelings and Behavior', domain: 'Approaches to Learning–Self-Regulation' },
    { id: 'ATL-REG6', name: 'Engagement and Persistence', domain: 'Approaches to Learning–Self-Regulation' },
    { id: 'ATL-REG7', name: 'Shared Use of Space and Materials', domain: 'Approaches to Learning–Self-Regulation' },

    // Physical Development–Health (PD-HLTH)
    { id: 'PD-HLTH1', name: 'Perceptual-Motor Skills and Movement Concepts', domain: 'Physical Development–Health' },
    { id: 'PD-HLTH2', name: 'Gross Locomotor Movement Skills', domain: 'Physical Development–Health' },
    { id: 'PD-HLTH3', name: 'Gross Motor Manipulative Skills', domain: 'Physical Development–Health' },
    { id: 'PD-HLTH4', name: 'Fine Motor Manipulative Skills', domain: 'Physical Development–Health' },
    { id: 'PD-HLTH5', name: 'Safety', domain: 'Physical Development–Health' },
    { id: 'PD-HLTH6', name: 'Personal Care Routines: Hygiene', domain: 'Physical Development–Health' },
    { id: 'PD-HLTH7', name: 'Personal Care Routines: Feeding', domain: 'Physical Development–Health' },
    { id: 'PD-HLTH8', name: 'Personal Care Routines: Dressing', domain: 'Physical Development–Health' },
    { id: 'PD-HLTH9', name: 'Active Physical Play', domain: 'Physical Development–Health' },
    { id: 'PD-HLTH10', name: 'Nutrition', domain: 'Physical Development–Health' }
  ];

  // Developmental levels
  const developmentLevels = [
    { value: 'exploring-earlier', label: 'Exploring Earlier' },
    { value: 'exploring-middle', label: 'Exploring Middle' },
    { value: 'exploring-later', label: 'Exploring Later' },
    { value: 'building-earlier', label: 'Building Earlier' },
    { value: 'building-middle', label: 'Building Middle' },
    { value: 'building-later', label: 'Building Later' },
    { value: 'integrating-earlier', label: 'Integrating Earlier' },
    { value: 'integrating-middle', label: 'Integrating Middle' },
    { value: 'integrating-later', label: 'Integrating Later' }
  ];

  // Level examples based on domain
  const levelExamples = {
    'Language and Literacy Development': {
      'exploring-earlier': `Child responds to voices, sounds, gestures, or facial expressions. For example, turns head toward person speaking or makes sounds in response to someone talking.`,
      'exploring-middle': `Child responds to simple comments or questions about familiar people or objects. For example, looks at object when adult names it or reaches for ball when adult asks "Do you want the ball?"`,
      'exploring-later': `Child follows one-step requests related to a familiar activity. For example, retrieves a specific toy when asked or points to a specific picture in a book.`,
      'building-earlier': `Child follows two requests that are not related to each other. For example, "Put your cup on the table and get your jacket" or "Get a crayon and draw a picture."`,
      'building-middle': `Child responds to detailed comments or multi-step requests related to a familiar activity. For example, follows directions: "Get the big red book about animals from the shelf and bring it to me."`,
      'building-later': `Child demonstrates understanding of complex statements, questions, and stories containing references to the past or future. For example, "Remember yesterday when we went to the park? Tomorrow we can go again if it doesn't rain."`,
      'integrating-earlier': `Child demonstrates understanding of abstract concepts, metaphors, or complex subject-specific content. For example, understands that "heavy as an elephant" is a way to describe something very heavy.`,
      'integrating-middle': `Child demonstrates understanding of extended discourse on a variety of topics. For example, asks clarifying questions during a science lesson or makes comments that build on previous information.`,
      'integrating-later': `Child demonstrates understanding of extended narratives, complex language forms, and subject-specific content knowledge. For example, makes connections between different stories or explains how to solve a math problem using specific vocabulary.`
    },
    'Cognition, Including Math and Science': {
      'exploring-earlier': `Child notices and responds to quantities in the environment. For example, looks at or reaches for multiple objects or notices when all objects have been removed.`,
      'exploring-middle': `Child demonstrates awareness of quantity changes. For example, notices when more cereal is added to bowl or when a peer takes a toy.`,
      'exploring-later': `Child demonstrates understanding of "more" through language or gestures. For example, asks for more food or indicates wanting more blocks.`,
      'building-earlier': `Child shows understanding of quantities up to three. For example, gets three apples when asked or knows that they have two cars without counting.`,
      'building-middle': `Child counts up to 5 objects correctly or identifies collections of up to 4 items without counting (subitizing). For example, counts four markers or recognizes 3 dots without counting.`,
      'building-later': `Child counts up to 10 objects correctly and knows the number after any number up to 9. For example, counts 8 children in a line or knows that 7 comes after 6.`,
      'integrating-earlier': `Child solves simple addition and subtraction problems with totals up to 10. For example, figures out that 3 + 2 = 5 or 7 - 3 = 4 using fingers or objects.`,
      'integrating-middle': `Child demonstrates understanding of number relationships and place value. For example, knows that 15 is 10 and 5 more or compares numbers to determine which is larger.`,
      'integrating-later': `Child uses counting strategies to solve math problems with totals beyond 10. For example, adds 8 + 5 by counting on from 8 or breaks numbers into parts to add or subtract.`
    },
    'Social and Emotional Development': {
      'exploring-earlier': `Child expresses emotions through facial expressions, sounds, gestures, or actions. For example, smiles when happy or cries when upset.`,
      'exploring-middle': `Child expresses needs and desires using simple language or gestures. For example, says "up" to be picked up or points to desired object.`,
      'exploring-later': `Child recognizes own name and begins to recognize self in mirror. For example, points to self when name is called or touches own image in mirror.`,
      'building-earlier': `Child expresses own preferences or desires. For example, says "I want the red one" or "I don't like carrots."`,
      'building-middle': `Child describes own feelings and recognizes feelings of others. For example, says "I'm mad" when upset or "She's sad" when peer is crying.`,
      'building-later': `Child compares own preferences or feelings with those of others. For example, says "I like swings but she likes slides" or "I'm happy and you're sad."`,
      'integrating-earlier': `Child uses words to describe own personality traits and compares self to others. For example, says "I'm a fast runner" or "I can't draw as good as him."`,
      'integrating-middle': `Child describes how own personality traits, characteristics, or abilities contribute to accomplishing tasks or interacting with others. For example, "I'm good at helping because I'm patient."`,
      'integrating-later': `Child compares own abilities, personality traits, or interests to those of others, explaining similarities and differences. For example, "We both like dinosaurs, but I know more dinosaur names than she does."`
    },
    'Approaches to Learning–Self-Regulation': {
      'exploring-earlier': `Child attends briefly to people, objects, or activities. For example, watches adult speaking for a short time or briefly plays with a toy.`,
      'exploring-middle': `Child shifts attention to a new person, object, or activity with adult support. For example, looks up when a new person enters the room.`,
      'exploring-later': `Child sustains attention to familiar activities, people, or objects for increasing amounts of time. For example, listens to a short storybook or plays with blocks for several minutes.`,
      'building-earlier': `Child sustains attention to self-selected activities that may be challenging. For example, works on a difficult puzzle or builds a block tower that keeps falling.`,
      'building-middle': `Child returns to activities after brief interruptions. For example, continues painting after washing hands or returns to block structure after snack time.`,
      'building-later': `Child maintains focus on activities despite distractions or interruptions. For example, continues working on a drawing even when others are talking nearby.`,
      'integrating-earlier': `Child sets goals and follows through on plans, adjusting approach as needed. For example, plans to build a tall tower and tries different block arrangements when it keeps falling.`,
      'integrating-middle': `Child maintains focus on complex activities, making adjustments to actions or strategies to overcome challenges. For example, figures out how to balance a structure made of various materials.`,
      'integrating-later': `Child persists with complex activities despite unexpected challenges, delays, or setbacks. For example, continues with a science project over multiple days, looking for solutions when experiments don't work.`
    },
    'Physical Development–Health': {
      'exploring-earlier': `Child moves body parts in response to sensory input. For example, reaches for a toy or kicks legs when excited.`,
      'exploring-middle': `Child coordinates simple movements when manipulating objects. For example, bangs objects together or places objects into containers.`,
      'exploring-later': `Child uses arms and hands to manipulate objects with purpose. For example, stacks blocks or uses spoon to scoop food.`,
      'building-earlier': `Child manipulates objects with one hand while stabilizing with other hand. For example, holds paper while drawing or opens jar with one hand while holding it with the other.`,
      'building-middle': `Child manipulates objects using coordinated movements of fingers and hands. For example, strings beads, cuts with scissors, or buttons large buttons.`,
      'building-later': `Child manipulates objects with precision using refined wrist and finger movements. For example, uses tweezers to pick up small objects or ties shoelaces.`,
      'integrating-earlier': `Child performs complex fine-motor tasks requiring precision. For example, writes letters legibly or uses a computer keyboard effectively.`,
      'integrating-middle': `Child coordinates complex fine-motor actions across multiple tasks. For example, cuts precisely along lines while holding paper appropriately or types while looking at the screen.`,
      'integrating-later': `Child demonstrates fine-motor precision in challenging activities requiring hand-eye coordination. For example, sews with needle and thread or builds intricate models.`
    }
  };

  // Group measures by domain - memoize to avoid recomputation
  const { domainGroups, domains } = React.useMemo(() => {
    const groups = {};
    drdpMeasures.forEach(measure => {
      if (!groups[measure.domain]) {
        groups[measure.domain] = [];
      }
      groups[measure.domain].push(measure);
    });
    return { domainGroups: groups, domains: Object.keys(groups) };
  }, [drdpMeasures]);

  // Handle selecting a measure
  const selectMeasure = useCallback((measure) => {
    setSelectedMeasure(measure);
    setObservations([]);
    setSelectedLevel(null);

    // Check if measure has already been assessed
    const existingMeasure = assessedMeasures.find(m => m.measureId === measure.id);
    if (existingMeasure) {
      setSelectedLevel(existingMeasure.level);
      setLevelNotes(existingMeasure.notes || '');
      setObservations(existingMeasure.observations || []);
    } else {
      setLevelNotes('');
    }
  }, [assessedMeasures]);

  // Handle adding an observation
  const addObservation = useCallback((e) => {
    e.preventDefault();
    if (observationText.trim() === '') return;

    const newObservation = {
      id: Date.now().toString(),
      text: observationText,
      date: new Date().toISOString().split('T')[0]
    };

    setObservations(prevObservations => [...prevObservations, newObservation]);
    setObservationText('');
  }, [observationText]);

  // Handle removing an observation
  const removeObservation = useCallback((id) => {
    setObservations(prevObservations => prevObservations.filter(obs => obs.id !== id));
  }, []);

  // Handle saving a measure assessment
  const saveMeasureAssessment = useCallback(() => {
    if (!selectedMeasure || !selectedLevel) return;

    const measureAssessment = {
      measureId: selectedMeasure.id,
      level: selectedLevel,
      notes: levelNotes,
      observations: observations
    };

    setAssessedMeasures(prevMeasures => {
      // Update if already exists, otherwise add new
      const measureIndex = prevMeasures.findIndex(m => m.measureId === selectedMeasure.id);
      if (measureIndex >= 0) {
        const updatedMeasures = [...prevMeasures];
        updatedMeasures[measureIndex] = measureAssessment;
        return updatedMeasures;
      } else {
        return [...prevMeasures, measureAssessment];
      }
    });

    // Clear selection
    setSelectedMeasure(null);
    setSelectedLevel(null);
    setObservations([]);
    setLevelNotes('');
  }, [selectedMeasure, selectedLevel, levelNotes, observations]);

  // Handle saving the complete assessment
  const handleSaveAssessment = useCallback(() => {
    const assessment = {
      id: Date.now().toString(),
      studentId: student.id,
      date: new Date().toISOString().split('T')[0],
      type: 'DRDP',
      measures: assessedMeasures.map(({ measureId, level, notes }) => ({
        measureId,
        level,
        notes
      }))
    };

    onSaveAssessment(assessment);
  }, [student.id, assessedMeasures, onSaveAssessment]);

  // Utility function to determine if a measure has been assessed
  const getMeasureStatus = useCallback((measure) => {
    return assessedMeasures.some(m => m.measureId === measure.id) ? 'complete' : 'incomplete';
  }, [assessedMeasures]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left Sidebar: Measure Selection */}
      <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          DRDP Measures for {student.name}
        </h2>

        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Select a measure to assess. Measures that have been completed will be marked with a check.
          </p>
        </div>

        <div className="space-y-6">
          {domains.map(domain => (
            <DomainSection
              key={domain}
              domain={domain}
              measures={domainGroups[domain]}
              selectedMeasure={selectedMeasure}
              onSelectMeasure={selectMeasure}
              getMeasureStatus={getMeasureStatus}
            />
          ))}
        </div>
      </div>

      {/* Main Content: Assessment Form */}
      <div className="md:col-span-3">
        {!selectedMeasure ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No measure selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Please select a DRDP measure from the list to begin assessment.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {/* Assessment Header */}
            <div className="border-b px-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{selectedMeasure.id}: {selectedMeasure.name}</h2>
                  <p className="text-sm text-gray-500">{selectedMeasure.domain}</p>
                </div>
                <button
                  onClick={() => setSelectedMeasure(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Developmental Level Selection */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-2">Select Developmental Level</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {developmentLevels.map(level => (
                    <button
                      key={level.value}
                      onClick={() => setSelectedLevel(level.value)}
                      className={`px-3 py-2 border rounded-md text-sm font-medium ${selectedLevel === level.value
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Example Toggle */}
              <div className="mb-6">
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                >
                  {showExamples ? 'Hide Examples' : 'Show Examples'}
                  <svg className={`ml-1 h-4 w-4 transform ${showExamples ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Level Examples */}
              {showExamples && selectedMeasure && (
                <LevelExamplesDisplay
                  selectedMeasure={selectedMeasure}
                  levelExamples={levelExamples}
                  developmentLevels={developmentLevels}
                />
              )}

              {/* Level Notes */}
              <div className="mb-6">
                <label htmlFor="level-notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Notes
                </label>
                <textarea
                  id="level-notes"
                  rows="3"
                  value={levelNotes}
                  onChange={(e) => setLevelNotes(e.target.value)}
                  placeholder="Enter notes about why you selected this developmental level..."
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>

              {/* Evidence/Observations */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-2">Evidence & Observations</h3>

                <form onSubmit={addObservation} className="flex mb-4">
                  <textarea
                    rows="3"
                    value={observationText}
                    onChange={(e) => setObservationText(e.target.value)}
                    placeholder="Record specific observations of student behavior related to this measure..."
                    className="flex-1 block border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Add
                  </button>
                </form>

                <ObservationsList
                  observations={observations}
                  onRemoveObservation={removeObservation}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedMeasure(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveMeasureAssessment}
                  disabled={!selectedLevel}
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${!selectedLevel
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                  Save Measure Assessment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="mt-6 flex justify-between items-center">
          <ProgressIndicator
            assessedCount={assessedMeasures.length}
            totalCount={drdpMeasures.length}
          />

          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel Assessment
            </button>
            <button
              onClick={handleSaveAssessment}
              disabled={assessedMeasures.length === 0}
              className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${assessedMeasures.length === 0
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
            >
              Save Full Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrdpAssessment; 
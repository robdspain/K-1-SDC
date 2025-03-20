import React, { useState } from 'react';

interface DrdpMeasure {
  id: string;
  domain: string;
  number: number;
  name: string;
  description: string;
}

interface DevelopmentalLevel {
  id: string;
  name: string;
  value: number;
}

interface Observation {
  id: number;
  text: string;
  date: string;
}

interface DrdpAssessmentProps {
  studentId: string;
  assessmentType?: 'preschool' | 'kindergarten';
}

const DrdpAssessment: React.FC<DrdpAssessmentProps> = ({ studentId, assessmentType = 'preschool' }) => {
  // Define state variables
  const [selectedMeasures, setSelectedMeasures] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [observations, setObservations] = useState<Record<string, Observation[]>>({});

  // Define DRDP measures based on assessment type
  const drdpMeasures: Record<string, DrdpMeasure[]> = {
    preschool: [
      // 1. Approaches to Learning-Self-Regulation (ATL-REG)
      { id: 'atl-reg-1', domain: 'ATL-REG', number: 1, name: 'Attention Maintenance', description: 'Child\'s ability to sustain attention to activities and experiences.' },
      { id: 'atl-reg-2', domain: 'ATL-REG', number: 2, name: 'Self-Comforting', description: 'Strategies used by the child to comfort or calm themselves when distressed.' },
      { id: 'atl-reg-3', domain: 'ATL-REG', number: 3, name: 'Imitation', description: 'Child\'s capacity to learn and practice new behaviors by observing and imitating others.' },
      { id: 'atl-reg-4', domain: 'ATL-REG', number: 4, name: 'Curiosity and Initiative in Learning', description: 'Extent to which the child explores and shows interest in learning new things.' },
      { id: 'atl-reg-5', domain: 'ATL-REG', number: 5, name: 'Self-Control of Feelings and Behavior', description: 'Child\'s ability to manage emotions and behaviors in various situations.' },
      { id: 'atl-reg-6', domain: 'ATL-REG', number: 6, name: 'Engagement and Persistence', description: 'Degree to which the child remains involved and persists in activities.' },
      { id: 'atl-reg-7', domain: 'ATL-REG', number: 7, name: 'Shared Use of Space and Materials', description: 'Child\'s ability to share space and materials with others appropriately.' },

      // 2. Social and Emotional Development (SED)
      { id: 'sed-1', domain: 'SED', number: 1, name: 'Identity of Self in Relation to Others', description: 'Understanding of self and how they relate to others.' },
      { id: 'sed-2', domain: 'SED', number: 2, name: 'Social and Emotional Understanding', description: 'Comprehension of social cues and emotional expressions.' },
      { id: 'sed-3', domain: 'SED', number: 3, name: 'Relationships and Social Interactions with Familiar Adults', description: 'Quality of interactions and relationships with known adults.' },
      { id: 'sed-4', domain: 'SED', number: 4, name: 'Relationships and Social Interactions with Peers', description: 'Quality of interactions and relationships with peers.' },
      { id: 'sed-5', domain: 'SED', number: 5, name: 'Symbolic and Sociodramatic Play', description: 'Engagement in pretend play and use of symbols in play.' },

      // 3. Language and Literacy Development (LLD)
      { id: 'lld-1', domain: 'LLD', number: 1, name: 'Understanding of Language (Receptive)', description: 'Ability to comprehend spoken language.' },
      { id: 'lld-2', domain: 'LLD', number: 2, name: 'Responsiveness to Language', description: 'Child\'s responsiveness to communication from others.' },
      { id: 'lld-3', domain: 'LLD', number: 3, name: 'Communication and Use of Language (Expressive)', description: 'Ability to express thoughts and needs using language.' },
      { id: 'lld-4', domain: 'LLD', number: 4, name: 'Reciprocal Communication and Conversation', description: 'Engagement in back-and-forth communication and conversations.' },
      { id: 'lld-5', domain: 'LLD', number: 5, name: 'Interest in Literacy', description: 'Child\'s interest in books, stories, and other literacy materials.' },
      { id: 'lld-6', domain: 'LLD', number: 6, name: 'Comprehension of Age-Appropriate Text', description: 'Understanding of stories and information read to them.' },
      { id: 'lld-7', domain: 'LLD', number: 7, name: 'Concepts About Print', description: 'Knowledge of print concepts, such as reading direction and letter recognition.' },
      { id: 'lld-8', domain: 'LLD', number: 8, name: 'Phonological Awareness', description: 'Awareness of sounds in language, including rhymes and syllables.' },
      { id: 'lld-9', domain: 'LLD', number: 9, name: 'Letter and Word Knowledge', description: 'Recognition of letters and understanding that they form words.' },
      { id: 'lld-10', domain: 'LLD', number: 10, name: 'Emergent Writing', description: 'Beginning attempts at writing letters and words.' },

      // 4. English-Language Development (ELD)
      { id: 'eld-1', domain: 'ELD', number: 1, name: 'Comprehension of English (Receptive English)', description: 'Understanding spoken English.' },
      { id: 'eld-2', domain: 'ELD', number: 2, name: 'Self-Expression in English (Expressive English)', description: 'Ability to express oneself in English.' },
      { id: 'eld-3', domain: 'ELD', number: 3, name: 'Understanding and Response to English Literacy Activities', description: 'Engagement and comprehension during English literacy activities.' },
      { id: 'eld-4', domain: 'ELD', number: 4, name: 'Symbol, Letter, and Print Knowledge in English', description: 'Recognition and understanding of English print symbols and letters.' },

      // 5. Cognition, Including Math and Science (COG)
      { id: 'cog-1', domain: 'COG', number: 1, name: 'Spatial Relationships', description: 'Understanding of how objects relate to each other in space.' },
      { id: 'cog-2', domain: 'COG', number: 2, name: 'Classification', description: 'Ability to group objects based on common characteristics.' },
      { id: 'cog-3', domain: 'COG', number: 3, name: 'Number Sense of Quantity', description: 'Understanding quantities and counting.' },
      { id: 'cog-4', domain: 'COG', number: 4, name: 'Number Sense of Math Operations', description: 'Basic understanding of addition and subtraction concepts.' },
      { id: 'cog-5', domain: 'COG', number: 5, name: 'Measurement', description: 'Understanding and comparing attributes like length, weight, and volume.' },
      { id: 'cog-6', domain: 'COG', number: 6, name: 'Patterning', description: 'Recognizing and creating patterns.' },
      { id: 'cog-7', domain: 'COG', number: 7, name: 'Shapes', description: 'Identification and understanding of different shapes.' },
      { id: 'cog-8', domain: 'COG', number: 8, name: 'Cause and Effect', description: 'Understanding the relationship between actions and outcomes.' },
      { id: 'cog-9', domain: 'COG', number: 9, name: 'Inquiry Through Observation and Investigation', description: 'Exploring and investigating to learn about the world.' },
      { id: 'cog-10', domain: 'COG', number: 10, name: 'Documentation and Communication of Inquiry', description: 'Recording and sharing findings from explorations.' },
      { id: 'cog-11', domain: 'COG', number: 11, name: 'Knowledge of the Natural World', description: 'Understanding natural phenomena and living things.' },

      // 6. Physical Development-Health (PD-HLTH)
      { id: 'pd-hlth-1', domain: 'PD-HLTH', number: 1, name: 'Perceptual-Motor Skills and Movement Concepts', description: 'Coordination of movements in response to perceptual information.' },
      { id: 'pd-hlth-2', domain: 'PD-HLTH', number: 2, name: 'Gross Locomotor Movement Skills', description: 'Use of large muscles for movement, such as walking, jumping, and climbing.' },
      { id: 'pd-hlth-3', domain: 'PD-HLTH', number: 3, name: 'Gross Motor Manipulative Skills', description: 'Child\'s ability to throw, catch, kick, and control objects with large muscle movements.' },
      { id: 'pd-hlth-4', domain: 'PD-HLTH', number: 4, name: 'Fine Motor Manipulative Skills', description: 'Use of small muscle movements for activities like grasping, writing, buttoning clothes, and using tools.' },
      { id: 'pd-hlth-5', domain: 'PD-HLTH', number: 5, name: 'Safety', description: 'Awareness and practice of safety rules in different environments, including road safety and handling materials properly.' },
      { id: 'pd-hlth-6', domain: 'PD-HLTH', number: 6, name: 'Personal Care Routines (Hygiene)', description: 'Child\'s ability to perform self-care hygiene tasks like handwashing, brushing teeth, and toileting.' },
      { id: 'pd-hlth-7', domain: 'PD-HLTH', number: 7, name: 'Personal Care Routines (Feeding)', description: 'Skills related to feeding oneself, including using utensils and understanding food choices.' },
      { id: 'pd-hlth-8', domain: 'PD-HLTH', number: 8, name: 'Personal Care Routines (Dressing)', description: 'Ability to put on, take off, and manage clothing items independently.' },
      { id: 'pd-hlth-9', domain: 'PD-HLTH', number: 9, name: 'Active Physical Play', description: 'Engagement in physical activity, demonstrating stamina, coordination, and enjoyment of movement.' },
      { id: 'pd-hlth-10', domain: 'PD-HLTH', number: 10, name: 'Nutrition', description: 'Awareness of healthy food choices and basic understanding of nutrition\'s role in well-being.' },

      // 7. History-Social Science (HSS)
      { id: 'hss-1', domain: 'HSS', number: 1, name: 'Sense of Time', description: 'Understanding past, present, and future events through personal experiences and routines.' },
      { id: 'hss-2', domain: 'HSS', number: 2, name: 'Sense of Place', description: 'Recognition of locations, landmarks, and spatial awareness in relation to the environment.' },
      { id: 'hss-3', domain: 'HSS', number: 3, name: 'Ecology', description: 'Awareness of environmental responsibility, such as recycling and caring for nature.' },
      { id: 'hss-4', domain: 'HSS', number: 4, name: 'Conflict Negotiation', description: 'Ability to resolve disputes through communication, negotiation, and problem-solving strategies.' },
      { id: 'hss-5', domain: 'HSS', number: 5, name: 'Responsible Conduct as a Group Member', description: 'Understanding and following group rules, participating in cooperative activities, and developing a sense of community.' },

      // 8. Visual and Performing Arts (VPA)
      { id: 'vpa-1', domain: 'VPA', number: 1, name: 'Visual Art', description: 'Exploration and creation of visual art through drawing, painting, sculpting, and crafting.' },
      { id: 'vpa-2', domain: 'VPA', number: 2, name: 'Music', description: 'Engagement with music through singing, playing instruments, and rhythm activities.' },
      { id: 'vpa-3', domain: 'VPA', number: 3, name: 'Drama', description: 'Participation in dramatic play, role-playing, and storytelling as a form of expression.' },
      { id: 'vpa-4', domain: 'VPA', number: 4, name: 'Dance', description: 'Movement exploration through structured and free-form dance activities.' }
    ],
    kindergarten: [
      // 1. Approaches to Learning-Self-Regulation (ATL-REG)
      { id: 'k-atl-reg-1', domain: 'ATL-REG', number: 1, name: 'Attention Maintenance', description: 'Child\'s ability to sustain attention to activities and experiences.' },
      { id: 'k-atl-reg-2', domain: 'ATL-REG', number: 2, name: 'Self-Comforting', description: 'Strategies used by the child to comfort or calm themselves when distressed.' },
      { id: 'k-atl-reg-3', domain: 'ATL-REG', number: 3, name: 'Imitation', description: 'Child\'s capacity to learn and practice new behaviors by observing and imitating others.' },
      { id: 'k-atl-reg-4', domain: 'ATL-REG', number: 4, name: 'Curiosity and Initiative in Learning', description: 'Extent to which the child explores and shows interest in learning new things.' },
      { id: 'k-atl-reg-5', domain: 'ATL-REG', number: 5, name: 'Self-Control of Feelings and Behavior', description: 'Child\'s ability to manage emotions and behaviors in various situations.' },
      { id: 'k-atl-reg-6', domain: 'ATL-REG', number: 6, name: 'Engagement and Persistence', description: 'Degree to which the child remains involved and persists in activities.' },
      { id: 'k-atl-reg-7', domain: 'ATL-REG', number: 7, name: 'Shared Use of Space and Materials', description: 'Child\'s ability to share space and materials with others appropriately.' },

      // Add similar comprehensive measures for all other domains in kindergarten assessment
      // For brevity, I've only shown the ATL-REG domain, but you would continue with all domains
      // Similarly structured to the preschool measures above
    ]
  };

  // Define developmental levels based on assessment type
  const developmentalLevels: Record<string, DevelopmentalLevel[]> = {
    preschool: [
      { id: 'responding-earlier', name: 'Responding Earlier', value: 1 },
      { id: 'responding-later', name: 'Responding Later', value: 2 },
      { id: 'exploring-earlier', name: 'Exploring Earlier', value: 3 },
      { id: 'exploring-later', name: 'Exploring Later', value: 4 },
      { id: 'building-earlier', name: 'Building Earlier', value: 5 },
      { id: 'building-middle', name: 'Building Middle', value: 6 },
      { id: 'building-later', name: 'Building Later', value: 7 },
      { id: 'integrating-earlier', name: 'Integrating Earlier', value: 8 },
      { id: 'integrating-middle', name: 'Integrating Middle', value: 9 },
      { id: 'integrating-later', name: 'Integrating Later', value: 10 }
    ],
    kindergarten: [
      { id: 'exploring-earlier', name: 'Exploring Earlier', value: 1 },
      { id: 'exploring-middle', name: 'Exploring Middle', value: 2 },
      { id: 'exploring-later', name: 'Exploring Later', value: 3 },
      { id: 'building-earlier', name: 'Building Earlier', value: 4 },
      { id: 'building-middle', name: 'Building Middle', value: 5 },
      { id: 'building-later', name: 'Building Later', value: 6 },
      { id: 'integrating-earlier', name: 'Integrating Earlier', value: 7 },
      { id: 'integrating-middle', name: 'Integrating Middle', value: 8 },
      { id: 'integrating-later', name: 'Integrating Later', value: 9 }
    ]
  };

  // Get the active measures based on the assessment type
  const activeMeasures = drdpMeasures[assessmentType] || [];
  const activeLevels = developmentalLevels[assessmentType] || [];

  // Handle level change
  const handleLevelChange = (measureId: string, levelId: string) => {
    setSelectedMeasures({
      ...selectedMeasures,
      [measureId]: levelId
    });
  };

  // Handle notes change
  const handleNotesChange = (measureId: string, value: string) => {
    setNotes({
      ...notes,
      [measureId]: value
    });
  };

  // Handle adding an observation
  const handleAddObservation = (measureId: string, observation: string) => {
    const currentObservations = observations[measureId] || [];
    setObservations({
      ...observations,
      [measureId]: [...currentObservations, {
        id: Date.now(),
        text: observation,
        date: new Date().toISOString()
      }]
    });
  };

  // Navigate to the next measure
  const handleNext = () => {
    if (activeIndex < activeMeasures.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  // Navigate to the previous measure
  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  // Save the assessment
  const handleSaveAssessment = () => {
    // Check if all measures have been rated
    const allMeasuresRated = activeMeasures.every(measure =>
      selectedMeasures[measure.id]
    );

    if (!allMeasuresRated) {
      setShowConfirmation(true);
      return;
    }

    // Proceed with saving
    saveAssessment();
  };

  // Save assessment to backend
  const saveAssessment = () => {
    setLoading(true);

    // Prepare data for saving
    const assessmentData = {
      studentId,
      assessmentType,
      date: new Date().toISOString(),
      measures: Object.keys(selectedMeasures).map(measureId => ({
        measureId,
        levelId: selectedMeasures[measureId],
        notes: notes[measureId] || '',
        observations: observations[measureId] || []
      }))
    };

    // Mock API call
    setTimeout(() => {
      console.log('Saving assessment:', assessmentData);
      setLoading(false);
      // Here you would typically call an API endpoint
      // api.saveAssessment(assessmentData).then(...)
    }, 1000);
  };

  // Get the current measure
  const currentMeasure = activeMeasures[activeIndex] || {};

  // Calculate progress
  const progress = activeMeasures.length > 0
    ? Math.round((Object.keys(selectedMeasures).length / activeMeasures.length) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">
        DRDP Assessment: {assessmentType === 'preschool' ? 'Preschool/TK' : 'Kindergarten'}
      </h1>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 dark:bg-gray-700">
        <div
          className="bg-indigo-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        {Object.keys(selectedMeasures).length} of {activeMeasures.length} measures rated ({progress}% complete)
      </p>

      {/* Domain filter */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">Filter by Domain</h2>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(activeMeasures.map(m => m.domain))).map(domain => (
            <button
              key={domain}
              className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
              onClick={() => {
                // Find first measure of this domain
                const index = activeMeasures.findIndex(m => m.domain === domain);
                if (index !== -1) {
                  setActiveIndex(index);
                }
              }}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Measure card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {currentMeasure.domain}
          </span>
          <span className="text-gray-500 text-sm">
            {activeIndex + 1} of {activeMeasures.length}
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-2">
          {currentMeasure.number}. {currentMeasure.name}
        </h2>
        <p className="text-gray-600 mb-6">
          {currentMeasure.description}
        </p>

        {/* Developmental levels */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Developmental Level</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {activeLevels.map(level => (
              <button
                key={level.id}
                className={`px-4 py-2 rounded border text-sm ${selectedMeasures[currentMeasure.id] === level.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                onClick={() => handleLevelChange(currentMeasure.id, level.id)}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Notes</h3>
          <textarea
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
            rows={3}
            placeholder="Add notes about this measure..."
            value={notes[currentMeasure.id] || ''}
            onChange={(e) => handleNotesChange(currentMeasure.id, e.target.value)}
          ></textarea>
        </div>

        {/* Observations */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Observations</h3>

          {/* Observation list */}
          <div className="mb-4">
            {(observations[currentMeasure.id] || []).map(obs => (
              <div key={obs.id} className="bg-gray-50 p-3 rounded mb-2">
                <p className="text-gray-800">{obs.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(obs.date).toLocaleDateString()}
                </p>
              </div>
            ))}

            {(!observations[currentMeasure.id] || observations[currentMeasure.id].length === 0) && (
              <p className="text-gray-500 italic">No observations recorded yet.</p>
            )}
          </div>

          {/* Add observation */}
          <div className="flex">
            <input
              type="text"
              id="new-observation"
              className="flex-grow px-3 py-2 text-gray-700 border rounded-lg rounded-r-none focus:outline-none focus:border-indigo-500"
              placeholder="Add a new observation..."
            />
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg rounded-l-none hover:bg-indigo-700"
              onClick={() => {
                const input = document.getElementById('new-observation') as HTMLInputElement;
                if (input.value.trim()) {
                  handleAddObservation(currentMeasure.id, input.value);
                  input.value = '';
                }
              }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            onClick={handlePrevious}
            disabled={activeIndex === 0}
          >
            Previous
          </button>

          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            onClick={handleNext}
            disabled={activeIndex === activeMeasures.length - 1}
          >
            Next
          </button>
        </div>
      </div>

      {/* Assessment controls */}
      <div className="flex justify-between items-center">
        <button
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          onClick={() => {
            // Replace window.confirm with a custom dialog
            setShowConfirmation(true);
          }}
        >
          Cancel
        </button>

        <button
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
          onClick={handleSaveAssessment}
        >
          Save Assessment
        </button>
      </div>

      {/* Confirmation Modal for Cancel */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Cancel Assessment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel? All unsaved progress will be lost.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowConfirmation(false)}
              >
                No, Continue
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={() => {
                  setShowConfirmation(false);
                  // Handle redirection or reset here
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrdpAssessment;

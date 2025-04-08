import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Form, Badge, Alert } from 'react-bootstrap';

const EssentialSkillsAssessment = ({ studentId, existingAssessments = [], onSave }) => {
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [iepGoals, setIepGoals] = useState([]);
    const [notes, setNotes] = useState('');
    const [isGeneratingGoals, setIsGeneratingGoals] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Define the mapping between DRDP measures and essential life skills
    const essentialSkillsMappings = [
        {
            id: 'ES1',
            name: 'Following Instructions',
            drdpMeasures: ['ATL-REG 1', 'ATL-REG 4', 'SED 3'],
            description: 'Ability to follow 1-step and multi-step instructions',
            levelDescriptors: {
                'Responding Earlier': 'Responds to voices, sounds, or gestures',
                'Responding Later': 'Responds to facial expressions or basic gestures',
                'Exploring Earlier': 'Responds to simple, clear instructions with support',
                'Exploring Later': 'Follows simple instructions but may need reminders',
                'Building Earlier': 'Follows 1-step instructions without reminders',
                'Building Middle': 'Follows 2-step instructions some of the time',
                'Building Later': 'Consistently follows 2-step instructions',
                'Integrating Earlier': 'Follows multi-step instructions without support'
            }
        },
        {
            id: 'ES2',
            name: 'Communication Skills',
            drdpMeasures: ['LLD 1', 'LLD 3', 'LLD 4'],
            description: 'Verbal and non-verbal communication of needs and wants',
            levelDescriptors: {
                'Responding Earlier': 'Uses crying to express needs',
                'Responding Later': 'Uses sounds or gestures to express basic needs',
                'Exploring Earlier': 'Uses simple words or signs to communicate',
                'Exploring Later': 'Combines words to express needs',
                'Building Earlier': 'Uses short sentences to communicate needs',
                'Building Middle': 'Engages in brief back-and-forth conversations',
                'Building Later': 'Initiates and maintains conversations on topic',
                'Integrating Earlier': 'Communicates clearly with varied vocabulary'
            }
        },
        {
            id: 'ES3',
            name: 'Social Interactions',
            drdpMeasures: ['SED 2', 'SED 4', 'SED 5'],
            description: 'Appropriate peer interactions and group participation',
            levelDescriptors: {
                'Responding Earlier': 'Shows awareness of others',
                'Responding Later': 'Responds to social interactions initiated by adults',
                'Exploring Earlier': 'Shows interest in peers',
                'Exploring Later': 'Engages in parallel play near peers',
                'Building Earlier': 'Briefly engages in simple cooperative play',
                'Building Middle': 'Participates in extended cooperative activities',
                'Building Later': 'Initiates cooperative activities with peers',
                'Integrating Earlier': 'Navigates complex social situations independently'
            }
        },
        {
            id: 'ES4',
            name: 'Self-Regulation',
            drdpMeasures: ['ATL-REG 5', 'SED 1', 'SED 3'],
            description: 'Ability to manage emotions and behaviors in various situations',
            levelDescriptors: {
                'Responding Earlier': 'Requires adult support to calm',
                'Responding Later': 'Uses simple behaviors to comfort self',
                'Exploring Earlier': 'Demonstrates awareness of own feelings',
                'Exploring Later': 'Seeks adult assistance to regulate emotions',
                'Building Earlier': 'Uses self-soothing strategies with reminders',
                'Building Middle': 'Anticipates need for emotional regulation',
                'Building Later': 'Uses multiple strategies to self-regulate',
                'Integrating Earlier': 'Regulates emotions in various contexts independently'
            }
        },
        {
            id: 'ES5',
            name: 'Task Completion',
            drdpMeasures: ['ATL-REG 3', 'ATL-REG 6', 'COG 9'],
            description: 'Ability to start and complete tasks with independence',
            levelDescriptors: {
                'Responding Earlier': 'Attends briefly to activities',
                'Responding Later': 'Maintains engagement when supported by adult',
                'Exploring Earlier': 'Shows interest in completing simple tasks',
                'Exploring Later': 'Completes simple tasks with adult guidance',
                'Building Earlier': 'Completes familiar tasks with minimal support',
                'Building Middle': 'Continues working on tasks despite challenges',
                'Building Later': 'Independently completes multi-step tasks',
                'Integrating Earlier': 'Plans and executes complex tasks independently'
            }
        }
    ];

    // Function to generate IEP goals based on selected skills and levels
    const generateIEPGoals = () => {
        setIsGeneratingGoals(true);

        // Simulating goal generation (in a real app, this could use an API or more complex logic)
        const generatedGoals = selectedSkills.map(skill => {
            const skillInfo = essentialSkillsMappings.find(mapping => mapping.id === skill.id);
            const currentLevel = skill.level;
            const levelIndex = Object.keys(skillInfo.levelDescriptors).indexOf(currentLevel);

            // Target next level or maintain if at highest level
            const targetLevelIndex = Math.min(levelIndex + 1, Object.keys(skillInfo.levelDescriptors).length - 1);
            const targetLevel = Object.keys(skillInfo.levelDescriptors)[targetLevelIndex];
            const targetDescription = skillInfo.levelDescriptors[targetLevel];

            return {
                skillId: skill.id,
                skillName: skillInfo.name,
                currentLevel,
                targetLevel,
                goal: `${skillInfo.name}: Progress from "${currentLevel}" to "${targetLevel}" level. Student will ${targetDescription.toLowerCase()} with 80% accuracy across 3 consecutive sessions.`,
                objectives: [
                    `Objective 1: Student will practice ${skillInfo.name.toLowerCase()} in structured settings with adult support.`,
                    `Objective 2: Student will demonstrate ${skillInfo.name.toLowerCase()} in semi-structured settings with minimal prompts.`,
                    `Objective 3: Student will generalize ${skillInfo.name.toLowerCase()} across various settings independently.`
                ]
            };
        });

        setIepGoals(generatedGoals);
        setIsGeneratingGoals(false);
    };

    const handleSkillSelection = (skillId, level) => {
        setSelectedSkills(prev => {
            // Check if skill is already selected
            const existingIndex = prev.findIndex(skill => skill.id === skillId);

            if (existingIndex >= 0) {
                // Update level if skill exists
                const updated = [...prev];
                updated[existingIndex] = { ...updated[existingIndex], level };
                return updated;
            } else {
                // Add new skill
                return [...prev, { id: skillId, level }];
            }
        });
    };

    const handleSaveAssessment = () => {
        const assessmentData = {
            studentId,
            date: new Date().toISOString(),
            essentialSkills: selectedSkills,
            iepGoals,
            notes
        };

        onSave(assessmentData);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    // Load existing assessments if available
    useEffect(() => {
        if (existingAssessments.length > 0) {
            const latestAssessment = existingAssessments[existingAssessments.length - 1];
            if (latestAssessment.essentialSkills) {
                setSelectedSkills(latestAssessment.essentialSkills);
            }
            if (latestAssessment.iepGoals) {
                setIepGoals(latestAssessment.iepGoals);
            }
            if (latestAssessment.notes) {
                setNotes(latestAssessment.notes);
            }
        }
    }, [existingAssessments]);

    return (
        <Container fluid>
            {showSuccess && (
                <Alert variant="success" className="mt-3">
                    Essential Skills Assessment and IEP goals successfully saved!
                </Alert>
            )}

            <h2 className="my-4">Essential Skills Assessment</h2>
            <p className="text-muted">
                Select DRDP measures that correspond to essential life skills and establish a baseline for IEP goal generation.
            </p>

            <Row>
                <Col md={7}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h4>Essential Skills Mapping</h4>
                        </Card.Header>
                        <Card.Body>
                            {essentialSkillsMappings.map(skill => (
                                <div key={skill.id} className="mb-4 p-3 border rounded">
                                    <h5>
                                        {skill.name}
                                        <Badge bg="info" className="ms-2">
                                            {skill.drdpMeasures.join(', ')}
                                        </Badge>
                                    </h5>
                                    <p>{skill.description}</p>

                                    <Form.Group className="mb-3">
                                        <Form.Label><strong>Current Level:</strong></Form.Label>
                                        <Form.Select
                                            value={selectedSkills.find(s => s.id === skill.id)?.level || ''}
                                            onChange={(e) => handleSkillSelection(skill.id, e.target.value)}
                                        >
                                            <option value="">Select level</option>
                                            {Object.entries(skill.levelDescriptors).map(([level, descriptor]) => (
                                                <option key={level} value={level}>
                                                    {level}: {descriptor}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>

                    <Form.Group className="mb-4">
                        <Form.Label><strong>Assessment Notes:</strong></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add observation notes, context, or other relevant information..."
                        />
                    </Form.Group>
                </Col>

                <Col md={5}>
                    <Card>
                        <Card.Header>
                            <h4>IEP Goals Generator</h4>
                        </Card.Header>
                        <Card.Body>
                            {selectedSkills.length === 0 ? (
                                <Alert variant="info">
                                    Select skills and levels to generate IEP goals
                                </Alert>
                            ) : (
                                <>
                                    <Button
                                        variant="primary"
                                        className="mb-3"
                                        onClick={generateIEPGoals}
                                        disabled={isGeneratingGoals || selectedSkills.length === 0}
                                    >
                                        {isGeneratingGoals ? 'Generating...' : 'Generate IEP Goals'}
                                    </Button>

                                    {iepGoals.length > 0 && (
                                        <div className="mt-3">
                                            <h5>Generated IEP Goals</h5>
                                            {iepGoals.map((goal, index) => (
                                                <div key={index} className="p-3 border rounded mb-3">
                                                    <h6>{goal.skillName}</h6>
                                                    <p><strong>Annual Goal:</strong> {goal.goal}</p>
                                                    <p><strong>Objectives:</strong></p>
                                                    <ul>
                                                        {goal.objectives.map((obj, i) => (
                                                            <li key={i}>{obj}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="mt-4">
                                <Button
                                    variant="success"
                                    onClick={handleSaveAssessment}
                                    disabled={selectedSkills.length === 0}
                                    className="w-100"
                                >
                                    Save Assessment & IEP Goals
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EssentialSkillsAssessment; 
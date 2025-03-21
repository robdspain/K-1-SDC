import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

// Mapping of developmental levels to next steps
const LEVEL_PROGRESSION = {
    'Responding Earlier': 'Responding Later',
    'Responding Later': 'Exploring Earlier',
    'Exploring Earlier': 'Exploring Later',
    'Exploring Later': 'Building Earlier',
    'Building Earlier': 'Building Middle',
    'Building Middle': 'Building Later',
    'Building Later': 'Integrating Earlier',
    'Integrating Earlier': 'Integrating Middle',
    'Integrating Middle': 'Integrating Later',
    'Integrating Later': 'Advanced development'
};

// Templates for learning targets based on domain
const LEARNING_TARGET_TEMPLATES = {
    'LLD': {
        targets: [
            "{name} will engage with books by turning pages and pointing to pictures for {timeframe}.",
            "{name} will participate in back-and-forth conversations using 2-3 word phrases for {timeframe}.",
            "{name} will identify and name familiar objects in books and environment for {timeframe}.",
            "{name} will follow 2-step directions related to classroom routines for {timeframe}."
        ],
        iepFormat: "{name} will demonstrate progress in language and literacy by {action} as measured by {measurement} with {accuracy}% accuracy for {timeframe}."
    },
    'COG': {
        targets: [
            "{name} will sort objects by one attribute (size, color, shape) for {timeframe}.",
            "{name} will count up to {nextLevel} objects correctly for {timeframe}.",
            "{name} will demonstrate understanding of simple patterns by extending them for {timeframe}.",
            "{name} will use simple problem-solving strategies when encountering obstacles for {timeframe}."
        ],
        iepFormat: "{name} will demonstrate progress in cognitive development by {action} as measured by {measurement} with {accuracy}% accuracy for {timeframe}."
    },
    'SED': {
        targets: [
            "{name} will express emotions using words or gestures for {timeframe}.",
            "{name} will engage in cooperative play with peers for {timeframe}.",
            "{name} will follow classroom rules and routines with minimal reminders for {timeframe}.",
            "{name} will use words to resolve conflicts with peers for {timeframe}."
        ],
        iepFormat: "{name} will demonstrate progress in social-emotional development by {action} as measured by {measurement} with {accuracy}% accuracy for {timeframe}."
    },
    'ATL-REG': {
        targets: [
            "{name} will maintain focus on activities for {nextLevel} minutes for {timeframe}.",
            "{name} will transition between activities with minimal support for {timeframe}.",
            "{name} will wait for turn during group activities for {timeframe}.",
            "{name} will use calming strategies when upset or frustrated for {timeframe}."
        ],
        iepFormat: "{name} will demonstrate progress in approaches to learning by {action} as measured by {measurement} with {accuracy}% accuracy for {timeframe}."
    },
    'PD-HLTH': {
        targets: [
            "{name} will use scissors to cut along a line for {timeframe}.",
            "{name} will hold a pencil with a proper grip for drawing and writing for {timeframe}.",
            "{name} will independently perform self-care routines (handwashing, toileting) for {timeframe}.",
            "{name} will demonstrate gross motor skills such as running, jumping, and climbing for {timeframe}."
        ],
        iepFormat: "{name} will demonstrate progress in physical development by {action} as measured by {measurement} with {accuracy}% accuracy for {timeframe}."
    }
};

// Measurement methods for IEP goals
const MEASUREMENT_METHODS = [
    "teacher observation and documentation",
    "work samples and portfolio assessment",
    "formative classroom assessments",
    "curriculum-based measures",
    "progress monitoring checklists"
];

// Actions for IEP goals
const DOMAIN_ACTIONS = {
    'LLD': [
        "engaging in back-and-forth communication",
        "demonstrating comprehension of age-appropriate text",
        "expressing ideas using expanded vocabulary",
        "recognizing and writing letters and words"
    ],
    'COG': [
        "solving problems using logical reasoning",
        "classifying objects by multiple attributes",
        "applying mathematical concepts to everyday situations",
        "demonstrating understanding of cause and effect relationships"
    ],
    'SED': [
        "regulating emotions in challenging situations",
        "initiating and maintaining cooperative relationships with peers",
        "demonstrating empathy towards others",
        "persisting with difficult tasks"
    ],
    'ATL-REG': [
        "sustaining attention during complex activities",
        "following multi-step directions independently",
        "setting and working toward simple goals",
        "adjusting behavior based on social context"
    ],
    'PD-HLTH': [
        "coordinating fine motor movements",
        "demonstrating balance and control during physical activities",
        "performing self-care routines independently",
        "using tools and materials with precision"
    ]
};

const LearningTargetsGenerator = ({ show, onHide, assessment, onSave }) => {
    const [generatedTargets, setGeneratedTargets] = useState([]);
    const [iepGoal, setIepGoal] = useState('');
    const [selectedTargets, setSelectedTargets] = useState([]);
    const [timeframe, setTimeframe] = useState('4 weeks');
    const [studentName, setStudentName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [accuracyPercent, setAccuracyPercent] = useState(80);

    useEffect(() => {
        if (assessment && show) {
            // Reset states
            setSelectedTargets([]);
            setError(null);

            const studentName = assessment.studentName || 'the student';
            setStudentName(studentName);

            // Generate targets based on assessment results
            generateLearningTargets(assessment, studentName);

            // Generate IEP goal based on highest developmental area
            generateIepGoal(assessment, studentName);
        }
    }, [assessment, show]);

    const generateLearningTargets = (assessment, name) => {
        if (!assessment || !assessment.measures) {
            setError("Assessment data is missing or invalid");
            return;
        }

        const targets = [];

        // Group measures by domain
        const domainMeasures = {};

        assessment.measures.forEach(measure => {
            const domainCode = measure.id.substring(0, 3);
            if (!domainMeasures[domainCode]) {
                domainMeasures[domainCode] = [];
            }
            domainMeasures[domainCode].push(measure);
        });

        // Generate targets for each domain
        Object.entries(domainMeasures).forEach(([domainCode, measures]) => {
            if (LEARNING_TARGET_TEMPLATES[domainCode]) {
                // Get all templates for this domain
                const domainTemplates = LEARNING_TARGET_TEMPLATES[domainCode].targets;

                // Select up to 2 random templates
                const selectedTemplates = domainTemplates
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 2);

                // For each measure, determine the next developmental level
                measures.forEach(measure => {
                    const currentLevel = measure.level;
                    const nextLevel = LEVEL_PROGRESSION[currentLevel] || 'next developmental level';

                    // Add personalized targets
                    selectedTemplates.forEach(template => {
                        const target = template
                            .replace('{name}', name)
                            .replace('{timeframe}', '{timeframe}')
                            .replace('{nextLevel}', nextLevel);

                        targets.push({
                            id: `${measure.id}-${Math.random().toString(36).substr(2, 5)}`,
                            text: target,
                            measure: measure.id,
                            domain: domainCode,
                            selected: true
                        });
                    });
                });
            }
        });

        setGeneratedTargets(targets);
        setSelectedTargets(targets.filter(t => t.selected).map(t => t.id));
    };

    const generateIepGoal = (assessment, name) => {
        if (!assessment || !assessment.measures) {
            return;
        }

        // Find the highest developmental area
        let highestMeasure = null;
        const levelValues = {
            'Responding Earlier': 1,
            'Responding Later': 2,
            'Exploring Earlier': 3,
            'Exploring Later': 4,
            'Building Earlier': 5,
            'Building Middle': 6,
            'Building Later': 7,
            'Integrating Earlier': 8,
            'Integrating Middle': 9,
            'Integrating Later': 10
        };

        assessment.measures.forEach(measure => {
            const domainCode = measure.id.substring(0, 3);
            const levelValue = levelValues[measure.level] || 0;

            if (!highestMeasure || levelValue > levelValues[highestMeasure.level]) {
                highestMeasure = {
                    ...measure,
                    domainCode
                };
            }
        });

        if (highestMeasure && DOMAIN_ACTIONS[highestMeasure.domainCode]) {
            const domainCode = highestMeasure.domainCode;
            const actions = DOMAIN_ACTIONS[domainCode];
            const action = actions[Math.floor(Math.random() * actions.length)];
            const measurement = MEASUREMENT_METHODS[Math.floor(Math.random() * MEASUREMENT_METHODS.length)];

            const iepTemplate = LEARNING_TARGET_TEMPLATES[domainCode].iepFormat;
            const goal = iepTemplate
                .replace('{name}', name)
                .replace('{action}', action)
                .replace('{measurement}', measurement)
                .replace('{accuracy}', accuracyPercent)
                .replace('{timeframe}', '{timeframe}');

            setIepGoal(goal);
        }
    };

    const handleSave = () => {
        setIsLoading(true);
        setError(null);

        try {
            // Get only selected targets
            const targets = generatedTargets
                .filter(target => selectedTargets.includes(target.id))
                .map(target => ({
                    ...target,
                    text: target.text.replace('{timeframe}', timeframe)
                }));

            // Add timeframe to IEP goal
            const finalIepGoal = iepGoal.replace('{timeframe}', timeframe);

            const learningPlan = {
                studentId: assessment.studentId,
                studentName,
                assessmentId: assessment.id,
                date: new Date().toISOString(),
                targets,
                iepGoal: finalIepGoal
            };

            onSave(learningPlan);
            onHide();
        } catch (err) {
            console.error("Error saving learning targets:", err);
            setError("Failed to save learning targets. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTargetSelection = (targetId) => {
        setSelectedTargets(prev => {
            if (prev.includes(targetId)) {
                return prev.filter(id => id !== targetId);
            } else {
                return [...prev, targetId];
            }
        });
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Generate Learning Targets</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger">{error}</Alert>
                )}

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Student Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Implementation Timeframe</Form.Label>
                        <Form.Select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                        >
                            <option value="2 weeks">2 weeks</option>
                            <option value="4 weeks">4 weeks</option>
                            <option value="6 weeks">6 weeks</option>
                            <option value="2 months">2 months</option>
                            <option value="1 quarter">1 quarter</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Accuracy Percentage for IEP Goal</Form.Label>
                        <Form.Select
                            value={accuracyPercent}
                            onChange={(e) => setAccuracyPercent(e.target.value)}
                        >
                            <option value="70">70%</option>
                            <option value="75">75%</option>
                            <option value="80">80%</option>
                            <option value="85">85%</option>
                            <option value="90">90%</option>
                        </Form.Select>
                    </Form.Group>

                    <div className="mt-4 mb-3">
                        <h5>Learning Targets</h5>
                        <p className="text-muted">Select the learning targets you want to include in the plan.</p>

                        {generatedTargets.map(target => (
                            <div key={target.id} className="mb-2">
                                <Form.Check
                                    type="checkbox"
                                    id={target.id}
                                    label={target.text.replace('{timeframe}', timeframe)}
                                    checked={selectedTargets.includes(target.id)}
                                    onChange={() => handleTargetSelection(target.id)}
                                />
                                <small className="text-muted ml-4">
                                    Related to measure: {target.measure} ({target.domain})
                                </small>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 mb-3">
                        <h5>IEP Goal</h5>
                        <p className="text-muted">This goal focuses on the highest developmental area from the assessment.</p>

                        <div className="p-3 border rounded">
                            {iepGoal.replace('{timeframe}', timeframe)}
                        </div>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={isLoading || selectedTargets.length === 0}
                >
                    {isLoading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            <span className="ml-2">Saving...</span>
                        </>
                    ) : (
                        "Save Learning Plan"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LearningTargetsGenerator; 
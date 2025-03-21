import React, { useState, useEffect } from 'react';
import { Accordion, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { BsPrinter, BsFileEarmarkText } from 'react-icons/bs';
import dbService from '../utils/dbService';

const LearningPlanList = ({ studentId, refreshTrigger = 0 }) => {
    const [learningPlans, setLearningPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (studentId) {
            fetchLearningPlans();
        }
    }, [studentId, refreshTrigger]);

    const fetchLearningPlans = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await dbService.getLearningPlans(studentId);
            setLearningPlans(response.data || []);
        } catch (err) {
            console.error("Error fetching learning plans:", err);
            setError("Failed to load learning plans. Please try again later.");

            // For demo purposes, generate sample data
            setLearningPlans([
                {
                    id: '1',
                    studentId,
                    studentName: 'Emma Johnson',
                    date: new Date().toISOString(),
                    targets: [
                        {
                            id: 'target1',
                            text: 'Emma will participate in back-and-forth conversations using 2-3 word phrases for 4 weeks.',
                            measure: 'LLD4',
                            domain: 'LLD'
                        },
                        {
                            id: 'target2',
                            text: 'Emma will identify and name familiar objects in books and environment for 4 weeks.',
                            measure: 'LLD8',
                            domain: 'LLD'
                        },
                        {
                            id: 'target3',
                            text: 'Emma will demonstrate understanding of simple patterns by extending them for 4 weeks.',
                            measure: 'COG8',
                            domain: 'COG'
                        }
                    ],
                    iepGoal: 'Emma will demonstrate progress in language and literacy by expressing ideas using expanded vocabulary as measured by teacher observation and documentation with 80% accuracy for 4 weeks.'
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handlePrint = (plan) => {
        // Create a printable version of the learning plan
        const printContent = document.createElement('div');
        printContent.innerHTML = `
            <h1 style="text-align: center;">Learning Plan</h1>
            <h2 style="text-align: center;">${plan.studentName}</h2>
            <p style="text-align: center;"><strong>Date:</strong> ${formatDate(plan.date)}</p>
            
            <h3>Learning Targets</h3>
            <ul>
                ${plan.targets.map(target => `<li>${target.text}</li>`).join('')}
            </ul>
            
            <h3>IEP Goal</h3>
            <p>${plan.iepGoal}</p>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Learning Plan - ${plan.studentName}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #333; }
                        h3 { margin-top: 20px; color: #444; }
                        ul { padding-left: 20px; }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    const handleExport = (plan) => {
        // Create a CSV export of the learning plan
        let csvContent = "data:text/csv;charset=utf-8,";

        // Headers
        csvContent += "Student Name,Date,Category,Content\n";

        // IEP Goal
        csvContent += `${plan.studentName},${formatDate(plan.date)},"IEP Goal","${plan.iepGoal}"\n`;

        // Learning Targets
        plan.targets.forEach(target => {
            csvContent += `${plan.studentName},${formatDate(plan.date)},"Learning Target (${target.domain} - ${target.measure})","${target.text}"\n`;
        });

        // Create and click a download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `LearningPlan_${plan.studentName}_${formatDate(plan.date)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className="text-center py-4">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading learning plans...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger">
                {error}
            </Alert>
        );
    }

    if (learningPlans.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-muted">No learning plans found for this student. Generate learning targets from an assessment to create a plan.</p>
            </div>
        );
    }

    return (
        <Accordion defaultActiveKey="0">
            {learningPlans.map((plan, index) => (
                <Card key={plan.id || index}>
                    <Accordion.Item eventKey={index.toString()}>
                        <Accordion.Header>
                            Learning Plan - {formatDate(plan.date)}
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="d-flex justify-content-end mb-3">
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="mr-2"
                                    onClick={() => handlePrint(plan)}
                                >
                                    <BsPrinter className="mr-1" /> Print
                                </Button>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleExport(plan)}
                                >
                                    <BsFileEarmarkText className="mr-1" /> Export
                                </Button>
                            </div>

                            <h5>IEP Goal</h5>
                            <div className="p-3 mb-4 border rounded bg-light">
                                {plan.iepGoal}
                            </div>

                            <h5>Learning Targets</h5>
                            <ul className="list-group mb-3">
                                {plan.targets.map(target => (
                                    <li key={target.id} className="list-group-item">
                                        <div>{target.text}</div>
                                        <small className="text-muted">
                                            Related to: {target.measure} ({target.domain})
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        </Accordion.Body>
                        <div className="learning-plans-list">
                            <h4 className="mb-3">Learning Plans & IEP Goals</h4>

                            <Accordion defaultActiveKey="0">
                                {learningPlans.map((plan, index) => (
                                    <Accordion.Item key={plan.id} eventKey={index.toString()}>
                                        <Accordion.Header>
                                            <div className="d-flex justify-content-between align-items-center w-100 me-3">
                                                <span>
                                                    <strong>Learning Plan</strong> - {formatDate(plan.date)}
                                                </span>
                                                <Badge bg="primary" className="ms-2">
                                                    {plan.targets?.length || 0} Targets
                                                </Badge>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            {plan.selectedGoal && (
                                                <Card className="mb-3">
                                                    <Card.Header className="bg-primary text-white">
                                                        IEP Goal - {plan.selectedGoal.measureId}
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <p className="mb-2"><strong>Current Level:</strong> {plan.selectedGoal.level}</p>
                                                        <p className="mb-2"><strong>Goal:</strong> {plan.selectedGoal.goal}</p>

                                                        {plan.selectedGoal.customNotes && (
                                                            <div className="mt-3">
                                                                <h6>Teaching Strategies/Notes:</h6>
                                                                <p className="mb-0">{plan.selectedGoal.customNotes}</p>
                                                            </div>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            )}

                                            <h6>Learning Targets:</h6>
                                            {plan.targets?.map((target, idx) => (
                                                <Card key={idx} className="mb-2">
                                                    <Card.Header>
                                                        <strong>{target.measureId}</strong> - {target.level}
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <ul className="mb-0">
                                                            {target.targets.map((t, i) => (
                                                                <li key={i}>{t}</li>
                                                            ))}
                                                        </ul>
                                                    </Card.Body>
                                                </Card>
                                            ))}

                                            <div className="mt-3 text-end">
                                                <Button variant="outline-primary" size="sm">
                                                    Print Plan
                                                </Button>
                                                <Button variant="outline-secondary" size="sm" className="ms-2">
                                                    Export PDF
                                                </Button>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </div>
                        );
};

                        export default LearningPlanList; 
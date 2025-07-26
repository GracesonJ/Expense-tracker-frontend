import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
    Button, Modal, Tab, Nav, Row, Col
} from 'react-bootstrap';
import { Pie, Bar } from 'react-chartjs-2';
import { getTransactionAPI } from '../service/allApi';
import {
    Chart as ChartJS,
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const TransChart = forwardRef(({ pieRef, barRef }, ref) => {
    const [show, setShow] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const pieChartInstance = useRef(null);
    const barChartInstance = useRef(null);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    useEffect(() => {
        if (show) {
            getTransactionAPI().then(result => setTransactions(result.data));
        }
    }, [show]);

    // Allow parent to access chart instances
    useImperativeHandle(pieRef, () => pieChartInstance.current);
    useImperativeHandle(barRef, () => barChartInstance.current);

    const income = transactions.filter(t => t.type === 'Income');
    const expense = transactions.filter(t => t.type === 'Expense');

    const totalIncome = income.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const totalExpense = expense.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    const pieData = {
        labels: ['Income', 'Expense'],
        datasets: [{
            label: 'Transaction Type',
            data: [totalIncome, totalExpense],
            backgroundColor: ['#198754', '#dc3545'],
        }],
    };

    const barData = {
        labels: [...new Set(transactions.map(t => t.category))],
        datasets: [{
            label: 'Amount by Category',
            data: [...new Set(transactions.map(t => t.category))].map(
                cat => transactions.filter(t => t.category === cat).reduce((sum, t) => sum + parseFloat(t.amount), 0)
            ),
            backgroundColor: '#0d6efd',
        }],
    };

    return (
        <>
            
                <Button  xs={6} md={2} lg={2} variant="outline-info" onClick={handleShow} className="w-100">
                    📊View Chart
                </Button>
            
            <Modal show={show} onHide={handleClose} centered backdrop="static" size="lg">
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title>Transaction Summary</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-light">
                    <Row className="mb-3">
                        <Col><div className="p-3 border rounded bg-success text-white">Total Income: ₹{totalIncome}</div></Col>
                        <Col><div className="p-3 border rounded bg-danger text-white">Total Expense: ₹{totalExpense}</div></Col>
                    </Row>

                    <Tab.Container defaultActiveKey="pie">
                        <Nav variant="tabs" className="mb-3 justify-content-center">
                            <Nav.Item><Nav.Link eventKey="pie">Pie Chart</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="bar">Bar Chart</Nav.Link></Nav.Item>
                        </Nav>

                        <Tab.Content>
                            <Tab.Pane eventKey="pie">
                                <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                                    <Pie data={pieData} ref={pieChartInstance} />
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="bar">
                                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                                    <Bar data={barData} ref={barChartInstance} />
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Modal.Body>
                <Modal.Footer className="bg-dark text-light">
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
});

export default TransChart;

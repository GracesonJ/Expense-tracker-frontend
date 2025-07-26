import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
} from 'react-bootstrap';
import { addTransactionAPI } from '../service/allApi';
import { toast } from 'react-toastify'; // ✅ import toast
import 'react-toastify/dist/ReactToastify.css'; // ✅ import CSS once (usually in App.jsx)

function Add({ setAddTransResult }) {
  const [transactions, setTransactions] = useState({
    type: '',
    category: '',
    amount: '',
    description: '',
    date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactions({ ...transactions, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { type, category, amount, description, date } = transactions;

    if (!type || !category || !amount || !description || !date) {
      toast.error('Please fill in all fields!', { autoClose: 3000 });
    } else {
      try {
        const result = await addTransactionAPI(transactions);
        if (result.status === 201 || result.status === 200) {
          toast.success('Transaction added successfully!', { autoClose: 3000 });
          setAddTransResult(prev => !prev);
          setTransactions({
            type: '',
            category: '',
            amount: '',
            description: '',
            date: ''
          });
        } else {
          toast.warning('Failed to add transaction. Try again!', { autoClose: 3000 });
        }
      } catch (error) {
        toast.error('Something went wrong!', { autoClose: 3000 });
        console.error(error);
      }
    }
  };

  return (
    <Card className="p-3 mb-4 shadow-sm bg-dark text-light">
      <h5 className="mb-3 text-white">Add Income / Expense</h5>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3 g-2">
          <Col xs={12} md={4}>
            <Form.Select
              name="type"
              value={transactions.type}
              onChange={handleChange}
              className="bg-secondary text-light border-0"
            >
              <option value="">Select Type</option>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </Form.Select>
          </Col>
          <Col xs={12} md={4}>
            <Form.Control
              type="text"
              name="category"
              value={transactions.category}
              placeholder="Category"
              onChange={handleChange}
              className="bg-secondary text-light border-0"
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Control
              type="date"
              name="date"
              value={transactions.date}
              onChange={handleChange}
              className="bg-secondary text-light border-0"
              max={new Date().toISOString().split('T')[0]}
            />
          </Col>
        </Row>
        <Row className="mb-3 g-2">
          <Col xs={12} md={4}>
            <Form.Control
              type="number"
              name="amount"
              value={transactions.amount}
              placeholder="Amount"
              onChange={handleChange}
              className="bg-secondary text-light border-0"
            />
          </Col>
          <Col xs={12} md={6}>
            <Form.Control
              type="text"
              name="description"
              value={transactions.description}
              placeholder="Description"
              onChange={handleChange}
              className="bg-secondary text-light border-0"
            />
          </Col>
          <Col xs={12} md={2}>
            <Button variant="info" type="submit" className="w-100">
              Add
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default Add;

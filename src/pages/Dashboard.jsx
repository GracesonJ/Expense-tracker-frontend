import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card
} from 'react-bootstrap';
import Add from '../components/Add';
import Result from '../components/Result';
import { getTransactionAPI } from '../service/allApi';

const Dashboard = () => {
  const [addTransResult, setAddTransResult] = useState(false)
  const [transDetails, setTransDetails] = useState([])
  const [editTransResult, setEditTransResult] = useState(false)
  const [deleteTransResult, setDeleteTransResult]= useState(false)
  const getTransaction = async () => {
    const result = await getTransactionAPI()
    console.log(result);
    setTransDetails(result.data)
  }
  console.log(transDetails);

  const totalIncome = () => {
    return transDetails.filter((trans) => trans.type === "Income").reduce((trans1, trans2) => trans1 + Number(trans2.amount), 0)
  }
  const totalExpense = () => {
    return transDetails.filter((trans) => trans.type === "Expense").reduce((trans1, trans2) => trans1 + Number(trans2.amount), 0)
  }
  const totalBalance =()=> totalIncome() - totalExpense()

  useEffect(() => {
    getTransaction()
  }, [editTransResult, addTransResult, deleteTransResult])



  return (
    <Container fluid className="py-4 bg-dark min-vh-100">
      <Card className="p-4 shadow-sm rounded-3 bg-secondary text-light">
        <h2 className="mb-4 text-center text-white">Personal Expense Tracker</h2>

        {/* Summary */}
        <Row className="mb-4 text-center g-3">
          <Col xs={12} md={4}>
            <div className="bg-dark py-3 rounded border border-success">
              <h6 className="text-white">Total Income</h6>
              <h4 className="text-success">
                ₹{totalIncome().toLocaleString("en-IN")}
              </h4>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="bg-dark py-3 rounded border border-danger">
              <h6 className="text-white">Total Expense</h6>
              <h4 className="text-danger"> ₹{totalExpense().toLocaleString("en-IN")}
              </h4>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="bg-dark py-3 rounded border border-info">
              <h6 className="text-white">Balance</h6>
              <h4 className={totalBalance() >= 0 ? "text-info" : "text-danger"}>
                ₹{totalBalance().toLocaleString("en-IN")}
              </h4>
            </div>
          </Col>
        </Row>

        {/* Add  */}
        <Add setAddTransResult={setAddTransResult} />

        {/* result */}
        <Result addTransResult={addTransResult} setEditTransResult={setEditTransResult} editTransResult={editTransResult} setDeleteTransResult={setDeleteTransResult} deleteTransResult={deleteTransResult} />
      </Card>
    </Container>
  );
};

export default Dashboard;

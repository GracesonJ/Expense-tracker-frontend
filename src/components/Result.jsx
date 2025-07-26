import React, { useEffect, useState } from 'react';
import { Button, Table, Container } from 'react-bootstrap';
import { MdDeleteForever } from "react-icons/md";
import Edit from './Edit';
import { deleteTransactionAPI, getTransactionAPI } from '../service/allApi';

function Result({ addTransResult, setEditTransResult, editTransResult, setDeleteTransResult, deleteTransResult }) {
  const [transDetails, setTransDetails] = useState([]);

  const getTransactions = async () => {
    try {
      const result = await getTransactionAPI();
      setTransDetails(result.data);

    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const handleDelete = async (id) => {
    // console.log(id);
    const result = await deleteTransactionAPI(id)
    console.log(result);
    setDeleteTransResult(prev => !prev)
    alert(`Transaction Deleted Successfully`)
  }

  useEffect(() => {
    getTransactions();
  }, [addTransResult, editTransResult, deleteTransResult]);

  return (
    <Container className="mb-4">
      <div className="table-responsive rounded shadow-sm">
        <Table bordered hover responsive className="mb-0 table-dark text-light">
          <thead className="table-secondary text-dark">
            <tr>
              <th className="text-center">Date</th>
              <th className="text-center">Transaction Type</th>
              <th className="text-center">Category</th>
              <th className="text-center">Amount</th>
              <th className="text-center">Description</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transDetails?.length > 0 ? (
              transDetails.map((item) => (
                <tr key={item.id}>
                  <td className="text-center">{item?.date}</td>
                  <td className="text-center">{item?.type}</td>
                  <td className="text-center">{item?.category}</td>
                  <td className={`text-center ${item?.type === "Income" ? "text-success" : "text-danger"}`}>
                    ₹{item?.amount}
                  </td>
                  <td>{item?.description}</td>
                  <td className="d-flex justify-content-center align-items-center gap-2 gap-md-4 flex-wrap flex-md-nowrap">
                    <Edit trans={item} setEditTransResult={setEditTransResult} />
                    <Button onClick={() => handleDelete(item?.id)} variant="link" className="text-danger p-0">
                      <MdDeleteForever size={24} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-danger py-3">No transactions found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default Result;

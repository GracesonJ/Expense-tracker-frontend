import React, { useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Row,
  Col
} from 'react-bootstrap';
import { FiEdit } from "react-icons/fi";
import { updateTransactionAPI } from '../service/allApi';

function Edit({ trans, setEditTransResult}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setEditedData(trans); // reset data on modal open
    setShow(true);
  };

  const [editedData, setEditedData] = useState({ ...trans });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleCancel = async () => {
    setEditedData({...trans})
  };

  const handleSave = async ()=>{
    const {type, category, description, amount, date} = editedData
    console.log(type, category, description, amount, date);
    if(!type || !category || !description || !amount || !date){
      alert(`Fill the form Completely`)
    }else{
      const result = await updateTransactionAPI(trans.id, editedData)
      console.log(result);
      setEditTransResult(prev => !prev)
      alert(`Transaction Upated Successfully`)
      handleClose()
    }
  }

  return (
    <>
      <Button variant="link" className="text-info p-0" onClick={handleShow}>
        <FiEdit size={22} />
      </Button>

      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Select
                  name="type"
                  value={editedData?.type}
                  onChange={handleChange}
                  className="bg-secondary text-light border-0"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  name="category"
                  value={editedData?.category}
                  onChange={handleChange}
                  placeholder="Category"
                  className="bg-secondary text-light border-0"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  name="description"
                  value={editedData?.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="bg-secondary text-light border-0"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={6}>
                <Form.Control
                  type="number"
                  name="amount"
                  value={editedData?.amount}
                  onChange={handleChange}
                  placeholder="Amount"
                  className="bg-secondary text-light border-0"
                />
              </Col>
              <Col xs={6}>
                <Form.Control
                  type="date"
                  name="date"
                  value={editedData?.date}
                  onChange={handleChange}
                  className="bg-secondary text-light border-0"
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="info" onClick={handleSave}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Edit;

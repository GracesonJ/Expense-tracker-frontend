import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  Container,
  Card,
  InputGroup,
  FormControl,
  Dropdown,
  Form,
  Row,
  Col,
} from 'react-bootstrap';
import { MdDeleteForever } from 'react-icons/md';
import Edit from './Edit';
import { deleteTransactionAPI, getTransactionAPI } from '../service/allApi';
import TransChart from './TransChart';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify'; // ✅ Import Toastify

function Result({
  addTransResult,
  setEditTransResult,
  editTransResult,
  setDeleteTransResult,
  deleteTransResult,
}) {
  const [transDetails, setTransDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const getTransactions = async () => {
    try {
      const result = await getTransactionAPI();
      setTransDetails(result.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to fetch transactions!');
    }
  };

  useEffect(() => {
    getTransactions();
  }, [addTransResult, editTransResult, deleteTransResult]);

  const handleDelete = async (id) => {
    try {
      await deleteTransactionAPI(id);
      setDeleteTransResult((prev) => !prev);
      toast.success('Transaction deleted successfully');
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const handleFilterChange = (type, value) => {
    if (type === 'type') setFilterType(value);
    if (type === 'date') setFilterDate(value);
    setShowFilter(false);
  };

  const filteredTransactions = transDetails.filter((item) => {
    const matchSearch =
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType ? item.type === filterType : true;
    const matchDate = filterDate ? item.date === filterDate : true;
    return matchSearch && matchType && matchDate;
  });

  // PDF Download with Total Summary
  const handleDownloadTransactionsPDF = () => {
    if (filteredTransactions.length === 0) {
      toast.warning('No transactions to download!');
      return;
    }

    try {
      const doc = new jsPDF('p', 'pt', 'a4');
      doc.setFontSize(18);
      doc.text('Transaction Details', 40, 40);

      const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
      const rows = filteredTransactions.map((item) => [
        item.date,
        item.type,
        item.category,
        `${item.amount}`,
        item.description,
      ]);

      autoTable(doc, {
        startY: 60,
        head: [headers],
        body: rows,
        margin: { left: 40, right: 40 },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [33, 37, 41] },
        theme: 'grid',
      });

      // Summary
      const totalIncome = filteredTransactions
        .filter((item) => item.type === 'Income')
        .reduce((sum, item) => sum + Number(item.amount), 0);

      const totalExpense = filteredTransactions
        .filter((item) => item.type === 'Expense')
        .reduce((sum, item) => sum + Number(item.amount), 0);

      const balance = totalIncome - totalExpense;
      const finalY = doc.lastAutoTable.finalY + 30;

      doc.setFontSize(12);
      doc.setTextColor(40);
      doc.text(`Total Income: ₹${totalIncome}`, 40, finalY);
      doc.text(`Total Expense: ₹${totalExpense}`, 40, finalY + 20);
      doc.text(`Balance: ₹${balance}`, 40, finalY + 40);

      doc.save('transactions.pdf');
      toast.success('PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast.error('Failed to generate PDF!');
    }
  };

  const handleDownloadExcel = () => {
    try {
      const wsData = [
        ['Date', 'Type', 'Category', 'Amount', 'Description'],
        ...filteredTransactions.map((item) => [
          item.date,
          item.type,
          item.category,
          item.amount,
          item.description,
        ]),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(wsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
      XLSX.writeFile(workbook, 'transactions.xlsx');
      toast.success('Excel file downloaded!');
    } catch (err) {
      console.error('Excel generation failed:', err);
      toast.error('Failed to generate Excel file!');
    }
  };

  return (
    <Container className="mb-4">
      <Card className="bg-dark text-light shadow-sm p-3 rounded ">
        <Row className="g-2 mb-3 d-flex justify-content-end">
          {/* Search Input */}
          <Col xs={12} md={3} lg={3}>
            <InputGroup>
              <FormControl
                placeholder="Search by Category or Description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-secondary text-light border-0"
              />
            </InputGroup>
          </Col>

          {/* Filter Dropdown */}
          <Col xs={12} md={2} lg={2}>
            <Dropdown show={showFilter} onToggle={() => setShowFilter(!showFilter)} className="w-100">
              <Dropdown.Toggle variant="outline-warning" className="w-100">
                🔍 Filter
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ padding: '1rem', minWidth: '100%' }}>
                <Form.Group className="mb-2">
                  <Form.Label className="text-dark">Transaction Type</Form.Label>
                  <Form.Select
                    value={filterType}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="bg-secondary text-light border-0"
                  >
                    <option value="">All</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label className="text-dark">Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={filterDate}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    className="bg-secondary text-light border-0"
                  />
                </Form.Group>
              </Dropdown.Menu>
            </Dropdown>
          </Col>

          {/* Chart Component */}
          <Col xs={6} md={2} lg={2} className="d-flex justify-content-center align-items-center">
            <div className="w-100">
              <TransChart />
            </div>
          </Col>

          {/* Download Dropdown */}
          <Col xs={6} md={2} lg={2}>
            <Dropdown className="w-100">
              <Dropdown.Toggle variant="outline-success" className="w-100">
                ⬇️ Download
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleDownloadTransactionsPDF}>
                  📄 Download as PDF
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDownloadExcel}>
                  📊 Download as Excel
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>


        <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Table bordered hover responsive className="mb-0 table-dark text-light">
            <thead className="bg-secondary text-light text-center">
              <tr>
                <th>Date</th>
                <th>Transaction Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <tr key={item.id}>
                    <td className="text-center">{item.date}</td>
                    <td className="text-center">{item.type}</td>
                    <td className="text-center">{item.category}</td>
                    <td className={`text-center ${item.type === 'Income' ? 'text-success' : 'text-danger'}`}>
                      ₹{item.amount}
                    </td>
                    <td>{item.description}</td>
                    <td className="d-flex justify-content-center gap-4 flex-wrap">
                      <Edit trans={item} setEditTransResult={setEditTransResult} />
                      <Button
                        onClick={() => handleDelete(item.id)}
                        variant="danger"
                        size="sm"
                      >
                        <MdDeleteForever size={20} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-danger py-3">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
}

export default Result;

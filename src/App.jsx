import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
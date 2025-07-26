import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import bgImg from "../assets/bg-image.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="home-page d-flex align-items-center justify-content-center text-center vh-100 text-white w-100"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(0,0,0,0.6)',
        backgroundBlendMode: 'darken'
      }}
    >
      <Container>
        <h1 className="display-4 mb-3">Welcome to Expense Tracker</h1>
        <p className="lead mb-4">
          Manage your income and expenses effectively. Track every rupee you spend or save!
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </Container>
    </div>
  );
};

export default Home;

import React from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from '../components/Navbar'

const Homepage = () => {
  return (
    <div>
      <Navbar />
      <br/>
      <Button variant="primary">Log in </Button>{' '}
      <Button variant="secondary">Sign up</Button>{' '}
    </div>
  );
};

export default Homepage;
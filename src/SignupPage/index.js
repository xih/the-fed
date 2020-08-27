import React, { useState } from 'react';
import { connect } from 'react-redux'
import { Form, Button, Container, Col } from 'react-bootstrap'
import Navbar from '../components/Navbar'
import { auth } from '../Firebase/firebase.utils'
import { push } from 'connected-react-router'

const SignupPage = () => {
  const [email, setEmail] = useState('')
  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [password, setPassword] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(email, firstName, lastName, password)
    try {
      console.log('hello')
      let response = await auth.createUserWithEmailAndPassword(email, password)
      console.log('response', response)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Navbar />
      <br />
      <Container>
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="formFirstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                onChange={(e) => setfirstName(e.target.value)}
                type="text" placeholder="Enter first name" />
            </Form.Group>

            <Form.Group as={Col} controlId="formLastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                onChange={(e) => setlastName(e.target.value)}
                type="text" placeholder="Last name!" />
            </Form.Group>
          </Form.Row>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              onChange={(e) => setEmail(e.target.value)}
              type="email" placeholder="email" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={(e) => setPassword(e.target.value)}
              type="password" placeholder="Password" />
          </Form.Group>

          <Button
            onClick={handleSubmit}
            variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
};

const mapStateToProps = null 

const mapDispatchToProps = dispatch => ({
  push: (url) => dispatch(push(url))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupPage);
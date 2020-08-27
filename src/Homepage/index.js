import React from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from '../components/Navbar'
import { push } from 'connected-react-router'
import { stubObject } from 'lodash'
import { connect } from 'react-redux'
import { Container } from 'react-bootstrap'

const Homepage = ({ push }) => {
  return (
    <div>
      <Navbar />
      <Container>
        <br />
        <Button
          onClick={() => {
            push('/login')
          }}
          variant="primary">Log in </Button>{' '}
        <Button
          onClick={() => {
            push('/signup')
          }}
          variant="secondary">Sign up</Button>{' '}
      </Container>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  push: (url) => dispatch(push(url))
})

export default connect(
  stubObject,
  mapDispatchToProps
)(Homepage);
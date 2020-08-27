import React from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from '../components/Navbar'
import { push } from 'connected-react-router'
import { stubObject } from 'lodash'
import { connect } from 'react-redux'


const Homepage = ({ push }) => {
  console.log(push)
  return (
    <div>
      <Navbar />
      <br/>
      <Button 
        onClick={() => {
          push('/login')
        }}

        variant="primary">Log in </Button>{' '}
      <Button variant="secondary">Sign up</Button>{' '}
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
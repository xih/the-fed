import React from 'react';
import { Navbar } from 'react-bootstrap'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { stubObject } from 'lodash'

const NavBar = ({ push}) => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand
          style={{ cursor: 'pointer'}}
          onClick={() => push('/')}>
          {/* <img
            alt=""
            src="/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '} */}
      Testing
    </Navbar.Brand>
      </Navbar>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  push: (url) => dispatch(push(url))
})

export default connect(stubObject, mapDispatchToProps)(NavBar);
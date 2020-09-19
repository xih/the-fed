import React from 'react';
import { connect } from 'react-redux'
import { Nav } from "react-bootstrap";
import './style.css'
import { push } from "connected-react-router"

const Sidebar = ({ push }) => {
  return (
    <div>
      <Nav className="col-md-12 d-none d-md-block bg-light sidebar"
        activeKey="/home"
        onSelect={selectedKey => alert(`selected ${selectedKey}`)}
      >
        <div className="sidebar-sticky"></div>
        <Nav.Item>
          <Nav.Link
            onClick={() => { push('/') }}
          >
            Home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => push('/transactions')}
            >
            Transactions
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Link</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="disabled" disabled>
            Disabled
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default connect(null, { push })(Sidebar);
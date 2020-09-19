import React from 'react';
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Sidebar from "./index.js";
import './style.css'

const WrappedSidebar = BaseComponent => (props) => {
  return (
    <div>
      <Container fluid>
        <Row>
          <Col xs={2} id="sidebar-wrapper">
            <Sidebar />
          </Col>
          <Col xs={10} id="page-content-wrapper">
            <BaseComponent />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WrappedSidebar;
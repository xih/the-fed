import React from "react"
import Button from "react-bootstrap/Button"
import { push } from "connected-react-router"
import { stubObject } from "lodash"
import { connect } from "react-redux"
import { Container } from "react-bootstrap"
import Navbar from "../../components/Navbar"

const Homepage = ({ pushUrl }) => {
  return (
    <div>
      <Navbar />
      <Container>
        <br />
        <Button
          onClick={() => {
            pushUrl("/login")
          }}
          variant="primary"
        >
          Log in{" "}
        </Button>{" "}
        <Button
          onClick={() => {
            pushUrl("/signup")
          }}
          variant="secondary"
        >
          Sign up
        </Button>{" "}
      </Container>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  pushUrl: (url) => dispatch(push(url)),
})

export default connect(stubObject, mapDispatchToProps)(Homepage)

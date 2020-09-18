import React, { useState } from "react"
import { connect } from "react-redux"
import { Form, Button, Container, Col } from "react-bootstrap"
import { push } from "connected-react-router"
import { useFormik } from "formik"
import * as Yup from "yup"
import Navbar from "../../components/Navbar"
import { auth } from "../../Firebase/firebase.utils"
import { UserAsyncActions, UserAsyncTypes } from "../../Stores/User/Actions"

const SignupPage = ({ doSignup, push }) => {
  const [email, setEmail] = useState("")
  const [firstName, setfirstName] = useState("")
  const [lastName, setlastName] = useState("")
  const [password, setPassword] = useState("")

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    },
  })

  return (
    <>
      <Navbar />
      <br />
      <Container>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId="formFirstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                name="firstName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                type="text"
                placeholder="Enter first name"
                isInvalid={formik.touched.firstName && formik.errors.firstName}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.firstName}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formLastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                name="lastName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                placeholder="Last name!"
                isInvalid={formik.touched.lastName && formik.errors.lastName}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.lastName}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
          </Form.Row>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="email"
              placeholder="email"
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              placeholder="Password"
            />
          </Form.Group>

          <Button
            onClick={(e) => {
              e.preventDefault()
              doSignup(
                formik.values.email,
                formik.values.password,
                formik.values.firstName,
                formik.values.lastName
              )
            }}
            variant="primary"
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </Container>
    </>
  )
}

const mapStateToProps = null

const mapDispatchToProps = (dispatch) => ({
  push: (url) => dispatch(push(url)),
  doSignup: (email, password, firstName, lastName) =>
    dispatch(UserAsyncActions.signup({ email, password, firstName, lastName })),
})

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage)

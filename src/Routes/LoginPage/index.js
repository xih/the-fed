import React from "react"
import { Form, Button, Container } from "react-bootstrap"
import { connect } from "react-redux"
// import { UserAsyncActions, UserAsyncTypes } from 'App/Stores/User/Actions';
import { useFormik } from "formik"
import * as Yup from "yup"
import { UserAsyncActions, UserAsyncTypes } from "../../Stores/User/Actions"
import Navbar from "../../components/Navbar"

const LoginPage = ({ doLogin, errorMsg }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().min(8, "Must be 8 characters or more").required(),
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
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder="Enter email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              // isValid={formik.touched.email && !formik.errors.email}
              isInvalid={formik.touched.email && formik.errors.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.email || errorMsg}
              </Form.Control.Feedback>
            ) : (
              <Form.Text className="text-muted">
                We will never share your email with anyone else.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              isInvalid={formik.touched.password && formik.errors.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            ) : null}
          </Form.Group>

          <Button
            onClick={(e) => {
              e.preventDefault()
              doLogin(formik.values.email, formik.values.password)
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

const mapStateToProps = (state) => ({
  errorMsg: state.user.errors[UserAsyncTypes.LOGIN],
})

const mapDispatchToProps = (dispatch) => ({
  doLogin: (email, password) =>
    dispatch(UserAsyncActions.login({ email, password })),
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)

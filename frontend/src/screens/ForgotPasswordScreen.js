import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";
import getError from "../utils";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("/api/users/forgot-password", {
          email,
        });
        
    
        if (response.status === 200) {
          // Assuming that a successful response has a status code of 200
          toast.success("Password reset email sent successfully. Check your email for further instructions.");
        } else {
          // Handle other successful status codes if needed
          toast.error("Unable to send reset email. Please try again after some time");
        }
      } catch (err) {
        toast.error(getError(err));
      }
  };

  return (
    <Container className="small-container">
      <h1 className="my-3">Forgot Password</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Reset Password</Button>
        </div>
      </Form>
    </Container>
  );
};

export default ForgotPasswordScreen;

import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { toast } from "react-toastify";
import getError from "../utils";
import { useNavigate } from "react-router-dom";

const ResetPasswordScreen = ({ match }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userId = params.get('id');

    // console.log(token);
    // console.log(userId);

    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

    try {
      const response = await axios.post("/api/users/reset-password", {
        userId,
        token,
        password,
      });

      if (response.status === 200) {
        toast.success("Password reset successfully.");
        navigate('/signin');
      } else {
        toast.error("Unable to reset password. Please try again after some time.");
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Container className="small-container">
  <h1 className="my-3">Reset Password</h1>
  <Form onSubmit={submitHandler}>
    <Form.Group className="mb-3" controlId="newPassword">
      <Form.Label>New Password</Form.Label>
      <Form.Control
        type="password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
    </Form.Group>
    <Form.Group className="mb-3" controlId="confirmPassword">
      <Form.Label>Confirm Password</Form.Label>
      <Form.Control
        type="password"
        required
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </Form.Group>
    <div className="mb-3">
      <Button type="submit">Reset Password</Button>
    </div>
  </Form>
</Container>

  );
};

export default ResetPasswordScreen;

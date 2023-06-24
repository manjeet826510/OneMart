import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// Create a <Wrapper> react component that renders a <section> with
// some padding and a papayawhip background
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

const ErrorScreen = () => {
  return (
    <Wrapper>
  <Title>Page Not Found.<span>
    <Link to='/'>Go to Home Page!</Link>
  </span> </Title>
</Wrapper>
  )
}

export default ErrorScreen
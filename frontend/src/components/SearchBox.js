import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/esm/Button';
import FormControl from 'react-bootstrap/esm/FormControl';
import { useNavigate } from 'react-router-dom';
import "../index.css"
import { Container } from 'react-bootstrap';

const SearchBox = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('')
    const submitHandler = (e)=>{
        // console.log(query);
        e.preventDefault();
        navigate(query ? `/search?query=${query}` : '/search');
        e.target.reset();
    }
  return (
    <Container fluid>
        <Form
        onSubmit={submitHandler}
        >
            <InputGroup >
                <FormControl 
                type='text'
                onChange={(e)=>setQuery(e.target.value)}
                placeholder="search products, brands and more..."
                ></FormControl>
                <Button
                type='submit'
                >
                <i className="fas fa-search"></i>
                </Button>
            </InputGroup>
        </Form>
    </Container>
  )
}

export default SearchBox
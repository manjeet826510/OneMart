import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { useParams } from 'react-router-dom'
import Rating from '../components/Rating';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import getError from '../utils';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
    const params = useParams();
    const {slug} = params;

    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
      product: [],
      loading: true,
      error: "",
    });
    useEffect(() => {
      const fetchData = async () => {
        dispatch({ type: "FETCH_REQUEST" });
        try {
          const result = await axios.get(`/api/products/slug/${slug}`);
          // console.log(result);
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        } catch (error) {
          // console.log(error);
          dispatch({ type: "FETCH_FAIL", payload: getError(error) });
        }
      };
      fetchData();
    }, [slug]);

    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {cart} = state;
    const addToCartHandler = async ()=>{
      // console.log('cart = ' + JSON.stringify(cart));
      // console.log('product = ' + JSON.stringify(product));
      const existItem = cart.cartItems.find((x)=>x._id === product._id);
      // console.log('existItem = ' + JSON.stringify(existItem));
      const quantity = existItem? existItem.quantity+1 : 1;
      // console.log(`quantity = ${quantity}`);
      const {data} = await axios.get(`/api/products/${product._id}`)
      if(data.countInStock<quantity){
        window.alert('Sorry, the product is out of stock');
        return;
      }
      ctxDispatch({type: 'CART_ADD_ITEM', payload: {...product, quantity}});
    }
  return (
    loading ? (
      <LoadingBox/>
    ) : error ? (
      <MessageBox variant='danger'>{error}</MessageBox>
    ) :
    <Row>
        <Col md={6}>
         <img className='img-large' src={product.image} alt={product.name} /> 
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
            <Helmet>
              <title>{product.name}</title>
            </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>
              Price: Rs {product.price}
            </ListGroup.Item>
            <ListGroup.Item>
              Description: <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>Rs {product.price}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>{
                    product.countInStock>0?
                    <Badge bg="success">In Stock</Badge>:
                    <Badge bg="danger">Out Of Stock</Badge>
                  }</Col>
                </Row>
              </ListGroup.Item>
              { //conditional rendering
                product.countInStock>0 && (
                  <ListGroup.Item>
                    <div className='d-grid'>
                      <Button onClick={addToCartHandler} variant='primary'>Add to Cart</Button>
                    </div>
                  </ListGroup.Item>
                )
              }
          </ListGroup>
            </Card.Body>
          </Card>
        </Col>
    </Row>
  )
}

export default ProductScreen
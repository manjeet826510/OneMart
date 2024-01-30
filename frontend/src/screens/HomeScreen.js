import React, { useEffect, useReducer } from "react";
import axios from "axios";
import Product from "../components/Product";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import UncontrolledExample from "../components/Corousel";


const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomeScreen = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });
  // const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("http://localhost:5000/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        console.log(result.data);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
      // console.log(result);
      // setProducts(result.data);
    };
    fetchData();
  }, []);
  return (
    <div className="main-home">
      <Helmet>
        <title>OneMart</title>
      </Helmet>   

      <UncontrolledExample/>  
    <hr/>
      <h1>Featured Products</h1>
      
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col xs={6} lg={3} className="mb-3" key={product.slug}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
      <hr/>
      <h1>New Arrivals</h1>
      
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.reverse().map((product) => (
              <Col xs={6} lg={3} className="mb-3" key={product.slug}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>

    </div>
  );
};

export default HomeScreen;

import React, { useContext, useEffect, useReducer, useState } from "react";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import getError from "../utils";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/esm/Card";
import ListGroup from "react-bootstrap/esm/ListGroup";
import Button from "react-bootstrap/esm/Button";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, order: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, succcessPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, succcessPay: false };
    default:
      return state;
  }
};

const OrderScreen = () => {
  const [razorPayKey, setrazorPayKey] = useState("");
  const { state } = useContext(Store);
  const { cart, userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, error, order, succcessPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
      succcessPay: false,
      loadingPay: false,
    });

  const loadScript = (src) => {
    try {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    } catch (error) {
      toast.error("Razorpay SDK failed to load. Are you online?");
    }
  };

  const createOrder = async () => {
    // creating a new order
    const dataResult = await axios.post("/api/create", {
      order_id: orderId,
      amount: order.totalPrice.toFixed(2),
      currency: "INR",
      payment_capture: "1",
    });
    return dataResult;
  };

  const paymentPopUp = async (options) => {
    try {
      // dispatch({type: 'PAY_REQUEST'})
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      // console.log('paymentObject is', paymentObject);
    } catch (error) {
      dispatch({ type: "PAY_FAIL", payload: getError(error) });
    }
  };

  const onError = (err) => {
    toast.error(getError(err));
  };

  const displayRazorpay = async () => {
    // console.log('razor pay btn is clicked');
    try {
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      const result = await createOrder();
      const options = {
        key: razorPayKey,
        currency: result.data.data.currency,
        amount: result.data.data.amount * 100,
        order_id: result.data.data.id,
        name: "MERN-amazona",
        description: "Test transaction",
        // image:"../../public/favicon.ico",
        handler: async function (response) {
          await axios.put(
            `/api/orders/${order._id}/pay`,
            {
              name: "Admin",
            },
            {
              headers: {
                authorization: userInfo
                  ? `Bearer ${userInfo.jwtToken}`
                  : "razorpay",
              },
            }
          );
          dispatch({ type: "PAY_SUCCESS" });
          // setPaySuccess(true);
          // console.log('paySuccess it is');
          toast.success("Order is paid");
        },
        prefill: {
          name: order.shippingAddress.fullName,
          email: "manjeet826510@gmail.com",
          contact: "7992346031",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      await paymentPopUp(options);
    } catch (error) {
      onError(error);
    }
  };

  useEffect(() => {
    const fetchRazorpayKey = async () => {
      try {
        const response = await axios.get("/api/rzp/razorpay-key");
        const { razorpayKey } = response.data;
        setrazorPayKey(razorpayKey);
      } catch (error) {
        console.error("Error fetching Razorpay key:", error);
      }
    };

    const fetchOrder = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: userInfo
              ? `Bearer ${userInfo.jwtToken}`
              : "razorpay",
          },
        });
        // console.log(data);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
      // console.log(result);
      // setProducts(result.data);
    };

    if (!userInfo) {
      return navigate("/signin");
    }

    if (!order._id || succcessPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (succcessPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      fetchRazorpayKey();
    }
  }, [navigate, userInfo, orderId, order, succcessPay]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong> Name:</strong> {order.shippingAddress.fullName}
                <br />
                <strong>Address:</strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong> Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => {
                  return (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          />{" "}
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </Col>
                        <Col md={3}>{item.quantity}</Col>
                        <Col md={3}>Rs {item.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>Rs {order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>Rs {order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>Rs {order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>
                      <strong>Rs {order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  {!order.isPaid && cart.paymentMethod === "RazorPay" && (
                    <div className="d-grid">
                      <Button
                        type="button"
                        onClick={displayRazorpay}
                        // disabled={cart.cartItems.length === 0}
                      >
                        <img
                          src="https://rzp-1415-prod-dashboard-activation.s3.amazonaws.com/org_100000razorpay/main_logo/phpAJgHea"
                          alt="Razorpay"
                          width="195"
                          height="32"
                        />
                      </Button>
                    </div>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;

import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import getError from "../utils";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        orders: action.payload.orders,
        //   page: action.payload.page,
        pages: action.payload.pages,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderListScreen = () => {
  const loc = useLocation();
  const { search } = loc;
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const navigate = useNavigate();

  const [{ loading, error, orders, pages }, dispatch] = useReducer(reducer, {
    loading: false,
    orders: [],
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        // console.log("imside try");
        const { data } = await axios.get(`/api/orders?page=${page}`, {
          headers: {
            authorization: `Bearer ${userInfo.jwtToken}`,
          },
        });
        console.log(data);
        // data = {products: products, page: page, pages: pages}
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", error: getError(err) });
      }
    };

    fetchOrders();
  }, [userInfo, page]);

  const getFilterUrl = (
    filter //filter = { page: 1 }
  ) =>
    //   or filter = {price: "something"} or etc ...
    // url = http://localhost:3000/productlist?page=1
    {
      const filterPage = filter.page;

      return {
        pathname: "/admin/orderlist",
        search: `?page=${encodeURIComponent(filterPage)}`,
      };
    };

  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loading ? (
        <div>
          <LoadingBox />
        </div>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>USER</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders &&
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.user ? order.user.name : "DELETED USER"}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice.toFixed(2)}</td>
                      <td>
                        {order.isPaid ? order.paidAt.substring(0, 10) : "No"}
                      </td>
                      <td>
                        {order.isDelivered
                          ? order.deliveredAt.substring(0, 10)
                          : "No"}
                      </td>
                      <td>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => {
                            navigate(`/order/${order._id}`);
                          }}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div>
            {[...Array(pages).keys()].map((x) => (
              // The expression [...Array(pages).keys()] creates an array of numbers from 0 to pages - 1.
              // if pages = 3 then [0, 1, 2]
              <LinkContainer
                key={x + 1}
                className="mx-1"
                to={getFilterUrl({ page: x + 1 })}
              >
                <Button
                  className={Number(page) === x + 1 ? "text-bold" : ""}
                  variant="light"
                >
                  {x + 1}
                </Button>
              </LinkContainer>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderListScreen;

import React, { useContext, useEffect, useReducer } from "react";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/esm/Card";
import { Chart } from "react-google-charts";
import axios from "axios";
import { Store } from "../Store";
import getError from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, summary: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const DashboardScreen = () => {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  // const dailyOrders = [
  //   {
  //     id: 4, sales: 5.5
  //   },
  //   {
  //     id: 8, sales: 12
  //   },

  // ]

  // const Categories = [
  //   ["Category", "Counts"],
  //   ["Shirt", 11],
  //   ["Pants", 2],
  //   ["Shoe", 2],
  //   ["TV", 2],
  //   ["AC", 7],
  // ];

  // const test = dailyOrders.map((x) => [x.id, x.sales]);
  // console.log(...test);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    // console.log("use effect is running");
    const fetchData = async () => {
      // console.log("fetchData is running");

      try {
        dispatch({ type: "FETCH_REQUEST" });
        // console.log("after FETCH_REQUEST");
        const { data } = await axios.get("api/orders/summary", {
          headers: {
            authorization: `Bearer ${userInfo.jwtToken}`,
          },
        });
        // console.log(data);
        // console.log(data.users[0].numUsers);
        // data.dailyOrders.map((x) => console.log(`id: ${x._id} and sales: ${x.sales}`))
        // data.productCategories.map((x) => console.log(`[${x._id}, ${x.count}]`))
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };

    fetchData();
  }, [userInfo]);
  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Title>
                  {summary.users && summary.users[0]
                    ? summary.users[0].numUsers
                    : 0}
                </Card.Title>
                <Card.Text>Users</Card.Text>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Title>
                  {summary.orders && summary.orders[0]
                    ? summary.orders[0].numOrders
                    : 0}
                </Card.Title>
                <Card.Text>Orders</Card.Text>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Title>
                  Rs{" "}
                  {summary.orders && summary.orders[0]
                    ? summary.orders[0].totalSales
                    : 0}
                </Card.Title>
                <Card.Text>Total Sales</Card.Text>
              </Card>
            </Col>
          </Row>
          <div>
            <h2>Sales</h2>
            <Chart
              width="100%"
              height="400px"
              chartType="AreaChart"
              loader={<div>Loading Chart...</div>}
              data={[
                ["Date", "Sales"],
                ...summary.dailyOrders.map((x) => [x._id, x.sales]),
              ]}
            ></Chart>
          </div>
          <div>
            <h2>Categories</h2>
            <Chart
              width="100%"
              height="400px"
              chartType="PieChart"
              loader={<div>Loading Chart...</div>}
              data={[
                ["Category", "Counts"],
                ...summary.productCategories.map((x) => [x._id, x.count]),

                // ["Shoe", 2],
                // ["TV", 2],
                // ["AC", 7],
              ]}
            ></Chart>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardScreen;

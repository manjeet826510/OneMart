import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { Link, useLocation, useNavigate } from "react-router-dom";
import getError from "../utils";
import { toast } from "react-toastify";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/esm/Button";
import Product from "../components/Product";
import { LinkContainer } from "react-router-bootstrap";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

// const [{ loading, error, products, pages, countProducts }, dispatch] =
//     useReducer(reducer, {
//       loading: true,
//       error: "",
//       products: [],
//     });

const prices = [
  {
    name: "Rs1 to Rs50",
    value: "1-50",
  },
  {
    name: "Rs51 to Rs200",
    value: "51-200",
  },
  {
    name: "Rs201 to Rs1000",
    value: "201-1000",
  },
];

const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2stars & up",
    rating: 2,
  },

  {
    name: "1stars & up",
    rating: 1,
  },
];

const SearchScreen = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  //due to Link to the page is not refreshing but always it is refreshing so loc runs everytime
  //   console.log(loc);
  // url = http://localhost:3000/search?category=Shirts
  //loc = {pathname: '/search', search: '?category=Shirts', hash: '', state: null, key: 'axsena41'}

  // url = http://localhost:3000/search?category=Shirts&query=all&price=51-200&rating=2&order=newest&page=1
  //loc = {pathname: '/search', search: '?category=Shirts&query=all&price=51-200&rating=2&order=newest&page=1', hash: '', state: null, key: 'axsena41'}
  const { search } = loc;
  //   search = '?category=Shirts'
  //search = '?category=Shirts&query=all&price=51-200&rating=2&order=newest&page=1'
  console.log(search);
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  console.log(`query = ${query}`);
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
      products: [],
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        // console.log(data);
        // data = [{}, {}, ...]
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [category, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  //categories = ["Pants", "Shirts"]
  console.log(`categories = ${categories}`);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/categories`);
        setCategories(data); //data = ["Pants", "Shirts"]
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const getFilterUrl = (
    filter //filter = { category: "something" }
  ) =>
    //   or filter = {price: "something"} or etc ...
    // url = http://localhost:3000/search?category=Shirts&query=all&price=51-200&rating=2&order=newest&page=1
    {
      const filterCategory = filter.category || category;
      const filterQuery = query;
      //   const filterQuery = filter.query || query;
      const filterPrice = filter.price || price;
      const filterRating = filter.rating || rating;
      const sortOrder = filter.order || order;
      const filterPage = filter.page || page;

      return {
        pathname: "/search",
        search: `?category=${encodeURIComponent(
          filterCategory
        )}&query=${filterQuery}&price=${encodeURIComponent(
          filterPrice
        )}&rating=${encodeURIComponent(
          filterRating
        )}&order=${encodeURIComponent(sortOrder)}&page=${encodeURIComponent(
          filterPage
        )}`,
      };
    };

  //   console.log(pages);

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>

      <Row>
        <Col md={3}>
          <div>
            <h3>Departments</h3>
            <ul>
              <li>
                <Link
                  className={category === "all" ? `text-bold` : ""}
                  to={getFilterUrl({ category: "all" })}
                >
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={category === `${c}` ? `text-bold` : ""}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Prices</h3>
            <ul>
              <li>
                <Link
                  className={price === "all" ? `text-bold` : ""}
                  to={getFilterUrl({ price: "all" })}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    className={price === `${p.value}` ? `text-bold` : ""}
                    to={getFilterUrl({ price: p.value })}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Avg. Customer Review</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    className={rating === `${r.rating}` ? `text-bold` : ""}
                    to={getFilterUrl({ rating: r.rating })}
                  >
                    <Rating caption={" & up"} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className={rating === "all" ? `text-bold` : ""}
                  to={getFilterUrl({ rating: "all" })}
                >
                  <Rating caption={" & up"} rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countProducts === 0 ? "No" : countProducts} Results
                    {query !== "all" && " : " + query}
                    {category !== "all" && " : " + category}
                    {price !== "all" && " : Price " + price}
                    {rating !== "all" && " : Rating " + rating + " & up"}
                    {query !== "all" ||
                    category !== "all" ||
                    rating !== "all" ||
                    price !== "all" ? (
                      <Button
                        variant="light"
                        onClick={() => navigate("/search")}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end" md={6}>
                  Sort by{" "}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </Col>
              </Row>

              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Row>
                {products.map(
                  (
                    product //products = [{}, {}, ...]
                  ) => (
                    <Col sm={6} lg={4} className="mb-3" key={product._id}>
                      <Product product={product}></Product>
                    </Col>
                  )
                )}
              </Row>

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
        </Col>
      </Row>
    </div>
  );
};

export default SearchScreen;

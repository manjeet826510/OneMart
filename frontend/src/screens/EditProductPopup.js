import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import getError from "../utils";
import { Store } from "../Store";
// import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false, error: action.payload };
    default:
      return state;
  }
};

const EditProductPopup = ({ closePopup, pid }) => {
  // const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loadingCreate, error }, dispatch] = useReducer(reducer, {
    loadingCreate: false,
    error: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: null,
    brand: "",
    category: "",
    description: "",
    price: 0,
    countInStock: 0,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      console.log(`pid = ${pid}`);
      const { data } = await axios.get(`/api/products/${pid}`);
      setFormData({
        ...formData,
        name: data.name,
        slug: data.slug,
        image: data.image,
        brand: data.brand,
        category: data.category,
        description: data.description,
        price: data.price,
        countInStock: data.countInStock,
      });
    };
    fetchProduct();
  }, [pid]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`name = ${formData.name}, slug = ${formData.slug}`);

    try {
      console.log(`formData.image : ${formData.image}`);
      dispatch({ type: "CREATE_REQUEST" });
      if (formData.image) {
        const formDataImage = new FormData();
        formDataImage.append("image", formData.image);

        const {
          data: { imageUrl },
        } = await axios.post("/api/upload", formDataImage);
        console.log(`imageUrl: ${imageUrl}`);
        formData.Location = imageUrl;
      }
      const { data } = await axios.put(
        `/api/products/${pid}`,
        {
          name: formData.name,
          slug: formData.slug,
          image: formData.Location,
          brand: formData.brand,
          category: formData.category,
          description: formData.description,
          price: formData.price,
          countInStock: formData.countInStock,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.jwtToken}`,
          },
        }
      );
      toast.success("Product updated successfully");
      dispatch({ type: "CREATE_SUCCESS" });

      console.log(data);
      window.location.reload(); // Refresh the page
      // console.log("product created");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "CREATE_FAIL" });
    }
    // Handle form submission and data saving here
    // ...
    // Reset form data and close the popup
    setFormData({
      name: "",
      slug: "",
      image: null,
      brand: "",
      category: "",
      description: "",
      price: 0,
      countInStock: 0,
    });
    closePopup();
  };

  return (
    <>
      {loadingCreate ? (
        <div>
          <LoadingBox />
        </div>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Modal show={true} onHide={closePopup} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {/* Form fields */}
              <Form.Group>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Product name"
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="Product slug"
                />
              </Form.Group>
              {/* Add other form fields */}
              {/* Image upload */}
              <Form.Group>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleImageUpload}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Product Brand"
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Product category"
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Product description"
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Product price"
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleInputChange}
                  placeholder="Product countInStock"
                />
              </Form.Group>
              {/* Submit button */}
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default EditProductPopup;

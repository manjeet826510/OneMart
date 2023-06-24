import axios from "axios";
import React, { useContext,  } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import getError from "../utils";
import { Store } from "../Store";



  
  
  
  const DeleteProductPopup = ({ closePopup, pid }) => {
      const {state} = useContext(Store);
    const {userInfo} = state;

    // useEffect(() => {
    //   const fetchProduct = async ()=>{
    //     console.log(`pid = ${pid}`);
    //       const {data} = await axios.get(`/api/products/${pid}`);
    //       setFormData({...formData, 
    //         name: data.name,
    //         slug: data.slug,
    //         image: data.image,
    //         brand: data.brand,
    //         category: data.category,
    //         description: data.description,
    //         price: data.price,
    //         countInStock: data.countInStock,
    //       })
    //   }
    //   fetchProduct();
    // }, [pid])

 
  const handleSubmit = async(e) => {

    try {
        const {data} = await axios.delete(
            `/api/products/${pid}`,
            {
                headers: {
                    authorization: `Bearer ${userInfo.jwtToken}`
                }
            }
        )
        toast.success("Product deleted successfully");
        console.log(data);
        window.location.reload(); // Refresh the page
        // console.log("product created");
    } catch (err) {
        toast.error(getError(err));
    }
    // Handle form submission and data saving here
    // ...
   
    closePopup();
  };

  return (
    <Modal show={true} onHide={closePopup} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Delete Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <strong>Are you sure you want to delete the Product?</strong><br/><br/>
        <Button  variant="primary" type="submit" onClick={handleSubmit}>Yes</Button>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteProductPopup;

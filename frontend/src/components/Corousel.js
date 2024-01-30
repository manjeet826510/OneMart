import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';

function UncontrolledExample() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100 corousel-img"
          src="https://rukminim1.flixcart.com/fk-p-flap/1688/280/image/17548fc4d9897fed.jpg?q=50"
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        {/* <Link
          to={{
            pathname: "search",
            search: `?category=Mobile`,
          }}
        > */}
          <img
            className="d-block w-100 corousel-img"
            src="https://rukminim1.flixcart.com/fk-p-flap/1688/280/image/1c04d33acfec2f5d.jpeg?q=50"
            alt="First slide"
          />
        {/* </Link> */}
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 corousel-img"
          src="https://rukminim1.flixcart.com/flap/844/140/image/28e006600e743699.jpg?q=50"
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default UncontrolledExample;

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { Store } from '../Store';
import { useContext } from 'react';
import axios from 'axios';

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  // addToCartHandler
  // Handles anytime a user clicks on addToCart
  // The function will check from the backend if that item is able to be added to the cart
  // It checks if first the item exists, and then if the quantity of the product is valid for the item to be added
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card border="dark">
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        {product.category !== 'single' ? (
          <Rating rating={product.rating} numReviews={product.numReviews} />
        ) : (
          <></>
        )}
        {product.category === 'single' ? (
          <>
            <Card.Text>{product.number}</Card.Text>
            <Card.Text>{product.rarity}</Card.Text>
          </>
        ) : (
          <></>
        )}
        <Card.Text>
          Starting At: <strong>${product.price}</strong>
        </Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;

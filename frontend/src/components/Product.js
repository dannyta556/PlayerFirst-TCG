import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { Store } from '../Store';
import { useContext } from 'react';
import axios from 'axios';
import Stack from 'react-bootstrap/esm/Stack';

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
    <Card className="product-card" border="dark">
      <Stack direction="horizontal" gap={2}>
        <Link to={`/product/${product.slug}`}>
          <img
            src={`/images/${product.name
              .replace(/ /g, '_')
              .replace(/["]/g, '')
              .replace(/☆/g, '_')
              .replace(/★/g, '_')
              .replace(/:/g, '')}.jpg`}
            className="card-img-top"
            alt={product.name}
          />
        </Link>
        <Card.Body className="product-card-body">
          <Link className="product-card-title" to={`/product/${product.slug}`}>
            <Card.Title className="product-card-title">
              {product.name}
            </Card.Title>
          </Link>
          {product.category !== 'single' ? (
            <Rating rating={product.rating} numReviews={product.numReviews} />
          ) : (
            <></>
          )}
          {product.category === 'single' ? (
            <>
              <Card.Text className="product-card-text">
                {product.card_sets[0] ? product.card_sets[0].set_code : ''} -{' '}
                {product.card_sets[0] ? product.card_sets[0].set_rarity : ''}
              </Card.Text>
            </>
          ) : (
            <></>
          )}
          <Card.Text>
            <strong>${product.price}</strong>
          </Card.Text>
          {product.countInStock === 0 ? (
            <Button variant="light" disabled>
              Out of Stock
            </Button>
          ) : (
            <Button onClick={() => addToCartHandler(product)}>
              Add to cart
            </Button>
          )}
        </Card.Body>
      </Stack>
    </Card>
  );
}

export default Product;

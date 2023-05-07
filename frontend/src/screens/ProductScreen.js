import axios from 'axios';
import { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import Carousel from 'react-elastic-carousel';
import Product from '../components/Product';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const breakPoints = [
  { width: 1, itemsToShow: 2 },
  { width: 550, itemsToShow: 3 },
  { width: 800, itemsToShow: 4 },
  { width: 1200, itemsToShow: 5 },
];

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  const [imageName, setImageName] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        setImageName(result.data.name.replace(/ /g, '_'));
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();

    const fetchRecs = async () => {
      try {
        const result = await axios.get(`/api/recommendations/card/${slug}`);
        setRecommendations(result.data.recommendations);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchRecs();
  }, [slug]);

  // addToCartHandler
  // Handles anytime a user clicks on addToCart
  // The function will check from the backend if that item is able to be added to the cart
  // It checks if first the item exists, and then if the quantity of the product is valid for the item to be added
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });

    // navigate to cart screen
    navigate('/cart');
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            //product.card_images[0].image_url frontend\public\cardIMG\1st Movement Solo.jpg
            src={`/images/${imageName
              .replace(/['"]/g, '')
              .replace(/☆/g, '_')
              .replace(/★/g, '_')
              .replace(/:/g, '')}.jpg`}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>Kenobi's Cards - {product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            {product.category !== 'single' ? (
              <>
                <ListGroup.Item>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  ></Rating>
                </ListGroup.Item>
              </>
            ) : (
              <></>
            )}
            <ListGroup.Item>
              {product.card_sets.length > 0 ? (
                <>
                  {product.card_sets[0].set_code} -{' '}
                  {product.card_sets[0].set_rarity}
                </>
              ) : (
                <></>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              {product.category === 'single' ? (
                <>
                  <strong>Type:</strong> {'  '}
                  {product.type}
                </>
              ) : (
                <></>
              )}
              <br></br>
              <strong>Description:</strong>
              <p>{product.desc}</p>
              {product.category === 'single' && product.atk ? (
                <>
                  <strong>atk: </strong> {product.atk}
                  <br></br>
                  {product.def ? (
                    <>
                      <strong>def: </strong> {product.def}{' '}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br></br>
      <Row>
        {product.card_set ? (
          <h4>Recommended Cards</h4>
        ) : (
          <div>
            <h4>Recommended Products</h4>
            <br></br>
            <Carousel breakPoints={breakPoints}>
              {recommendations.map((rec, index) => (
                <Product key={index} product={rec}></Product>
              ))}
            </Carousel>
          </div>
        )}
      </Row>
    </div>
  );
}

export default ProductScreen;

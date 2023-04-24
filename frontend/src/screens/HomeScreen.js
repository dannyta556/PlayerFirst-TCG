//import data from '../data';
import { useEffect, useReducer } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Carousel from 'react-bootstrap/Carousel';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import articleIMG from '../pictures/Article.png';
import articleIMG2 from '../pictures/Article2.png';
import Decklist from '../components/Decklist';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const decklistReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, decklists: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });
  const [{ loadingDecklists, decklistsError, decklists }, dispatchDecklists] =
    useReducer(decklistReducer, {
      decklists: [],
      loadingPrices: true,
      pricesError: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
    const fetchDecklists = async () => {
      dispatchDecklists({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/decklists/feature`);
        dispatchDecklists({
          type: 'FETCH_SUCCESS',
          payload: result.data.decklists,
        });
      } catch (err) {
        dispatchDecklists({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchDecklists();
  }, []);
  return (
    <div>
      <Helmet>
        <title>Kenobi's Cards</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h4>Featured Products</h4>
          <br></br>
          <div className="products">
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <div>
                {products.map((product) => (
                  <Col
                    key={product.slug}
                    sm={6}
                    md={4}
                    large={3}
                    className="mb-3"
                  >
                    <Product product={product}></Product>
                  </Col>
                ))}
              </div>
            )}
          </div>
        </Col>
        <Col md={9}>
          <Row>
            <h4>Home</h4>
          </Row>
          <br></br>
          <Row>
            <Carousel>
              <Carousel.Item>
                <img
                  className="article-home"
                  src={articleIMG}
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>Best Rogue Decks of December 2022</h3>
                  <p>By: John Doe</p>
                  <Link to="/articles/the-best-rogue-decks-of-december-2022">
                    Read More
                  </Link>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="article-home"
                  src={articleIMG2}
                  alt="Second slide"
                />

                <Carousel.Caption>
                  <h3>Top 5 Best Anime Decks to Play</h3>
                  <p>By: James Smith</p>
                  <Link to="/articles/top-5-best-anime-decks-to-play">
                    Read More
                  </Link>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Row>
          <br></br>
          <Row>
            <h4>Featured Decklists</h4>
            <div className="decklists">
              {loadingDecklists ? (
                <LoadingBox />
              ) : decklistsError ? (
                <MessageBox variant="danger">{error}</MessageBox>
              ) : (
                <div>
                  {decklists.map((decklist) => (
                    <Row className="decklist-home" key={decklist._id}>
                      <Decklist decklist={decklist}></Decklist>
                    </Row>
                  ))}
                </div>
              )}
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default HomeScreen;

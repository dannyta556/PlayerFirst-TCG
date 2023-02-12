import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import { useContext, useEffect, useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, articles: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ArticlesScreen() {
  const [{ loading, error, articles }, dispatch] = useReducer(reducer, {
    articles: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/articles');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      //setProducts(result.data);
    };
    fetchData();
  }, []);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <h1>Articles</h1>
        {articles.map((article) => (
          <Col key={article.slug} sm={6} md={6} className="mb-3">
            <Card border="dark">
              <Card.Body>
                <Link to={`/articles/${article.slug}`}>
                  <Card.Title>{article.title}</Card.Title>
                </Link>
                <Card.Text>{article.desc}</Card.Text>
              </Card.Body>
              <Card.Footer>
                {article.author} {article.createdAt}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

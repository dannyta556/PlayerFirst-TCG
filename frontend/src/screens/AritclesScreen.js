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
import ArticlePreview from '../pictures/ArticlePreview.png';
import Article2Preview from '../pictures/Article2Preview.png';
import Stack from 'react-bootstrap/esm/Stack';

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

  function formatDate(date) {
    var dt = new Date(date);
    const currentMonth = dt.getMonth();
    const monthString = currentMonth >= 10 ? currentMonth : `0${currentMonth}`;
    const currentDate = dt.getDate();
    return `${dt.getFullYear()}-${monthString}-${currentDate}`;
  }
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
      <h2 className="article-title">Articles</h2>
      <br></br>
      <Row>
        {articles.map((article) => (
          <Col key={article.slug} sm={6} md={6} className="mb-3">
            <Card border="dark">
              <Stack direction="horizontal" gap={3}>
                <Link to={`/articles/${article.slug}`}>
                  <img
                    className="preview-img"
                    src={`/preview/${article.img}.png`}
                    alt="article2"
                  ></img>
                </Link>
                <Card.Body>
                  <Link to={`/articles/${article.slug}`}>
                    <Card.Title>{article.title}</Card.Title>
                  </Link>
                  <Card.Text>{article.desc}</Card.Text>
                </Card.Body>
              </Stack>

              <Card.Footer>
                <Stack direction="horizontal" gap={3}>
                  {article.author}
                  <div className="ms-auto">{formatDate(article.createdAt)}</div>
                </Stack>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

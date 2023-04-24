import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import Stack from 'react-bootstrap/esm/Stack';
import Article from '../pictures/Article.png';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, article: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ArticleScreen() {
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, article }, dispatch] = useReducer(reducer, {
    article: [],
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
        const result = await axios.get(`/api/articles/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>{article.title}</title>
      </Helmet>
      <h1>{article.title}</h1>
      <br></br>
      <h5>
        <i>{article.desc}</i>
      </h5>
      <br></br>
      <Stack direction="horizontal" gap={5}>
        <p>Author: {article.author}</p>
        <p>Published: {formatDate(article.createdAt)}</p>
      </Stack>
      <br />
      {article.title === 'The Best Rogue Decks of December 2022' ? (
        <img className="article-title" src={Article} alt="img"></img>
      ) : (
        <></>
      )}

      <br />
      <div dangerouslySetInnerHTML={{ __html: article.sanitizedHtml }}></div>
    </div>
  );
}

export default ArticleScreen;

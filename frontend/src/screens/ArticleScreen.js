import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

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
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        console.log('were here');
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
      <h4>
        <i>{article.desc}</i>
      </h4>
      <h4>
        Author: {article.author} Published: {article.createdAt}
      </h4>
      <div dangerouslySetInnerHTML={{ __html: article.sanitizedHtml }}></div>
    </div>
  );
}

export default ArticleScreen;

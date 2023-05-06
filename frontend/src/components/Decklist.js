import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { getError } from '../utils';
import Stack from 'react-bootstrap/esm/Stack';
import previewSpright from '../pictures/previewSpright.png';
import previewTearlament from '../pictures/previewTearlaments.png';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, prices: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Decklist(props) {
  const { decklist } = props;
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, prices }, dispatch] = useReducer(reducer, {
    prices: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        let result;
        if (userInfo) {
          result = await axios.get(
            `/api/decklists/price?id=${decklist._id}&email=${userInfo.email}`
          );
        } else {
          result = await axios.get(
            `/api/decklists/price?id=${decklist._id}&email=${''}`
          );
        }

        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchPrice();
  }, [decklist._id, userInfo]);
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Card className="decklist-card" border="dark">
      <Stack direction="horizontal" gap={3}>
        {decklist.archetype === 'Spright' ? (
          <Link to={`/decklist/${decklist._id}`}>
            <img className="preview-img" src={previewSpright} alt="img"></img>
          </Link>
        ) : (
          <Link to={`/decklist/${decklist._id}`}>
            <img
              className="preview-img"
              src={previewTearlament}
              alt="img"
            ></img>
          </Link>
        )}
        <Card.Body className="product-card-body">
          <Stack direction="horizontal" gap={5}>
            <div>
              <Link
                className="product-card-title"
                to={`/decklist/${decklist._id}`}
              >
                <Card.Title className="product-card-title">
                  {decklist.name}
                </Card.Title>
              </Link>
              <Card.Text>{decklist.archetype}</Card.Text>
            </div>

            <Card.Text>{decklist.duelist}</Card.Text>
            <Card.Text>{decklist.tournament}</Card.Text>
            <Card.Text>{decklist.placement}</Card.Text>
            <Card.Text className="ms-auto">
              <strong>${prices.totalPrice}</strong>
            </Card.Text>
          </Stack>
        </Card.Body>
      </Stack>
    </Card>
  );
}

export default Decklist;

import React, { useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getError } from '../utils';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Table from 'react-bootstrap/esm/Table';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        decklists: action.payload,
        loading: false,
      };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const priceReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PRICE':
      return {
        ...state,
        prices: action.payload,
      };
    default:
      return state;
  }
};

export default function UserDecklistsScreen() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const archetype = sp.get('archetype') || 'all';
  const page = sp.get('page') || 1;

  const [{ loading, error, decklists }, dispatch] = useReducer(reducer, {
    decklists: [],
    loading: true,
    error: '',
  });

  const [{ prices }, priceDispatch] = useReducer(priceReducer, {
    prices: [],
  });

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterArchetype = filter.archetype || archetype;

    return `/decklists/tournament?archetype=${filterArchetype}&page=${filterPage}`;
  };

  useEffect(() => {
    const fetchPrices = async (r) => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        let prices = [];
        for (let index = 0; index < r.length; index++) {
          const deckPrice = await axios.get(
            `/api/decklists/price?id=${r[index]._id}`
          );
          prices.push(deckPrice.data.totalPrice);
        }
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: r,
        });
        priceDispatch({
          type: 'FETCH_PRICE',
          payload: prices,
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        await axios.get(`/api/decklists/`).then((r) => {
          fetchPrices(r.data);
        });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  const [archetypes, setArchetypes] = useState([]);
  useEffect(
    () => {
      const fetchArchetypes = async () => {
        try {
          const { data } = await axios.get(`/api/decklists/archetypes`);
          setArchetypes(data);
        } catch (err) {
          toast.error(getError(err));
        }
      };
      fetchArchetypes();
    },
    [dispatch],
    archetypes
  );

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <div>
        <Helmet>
          <title>Decklists</title>
        </Helmet>
        <Row>
          <h3>User Decklists</h3>
        </Row>
        <Row>
          <Col md={3}>
            <h4>Filters</h4>
            <div>
              <h4>Archetype</h4>
              <ul>
                {archetypes.map((a) => (
                  <li key={a}>
                    <Link
                      className={a === archetype ? 'text-bold' : ''}
                      to={getFilterUrl({ archetype: a })}
                    >
                      {a}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col>
            Sort by{' '}
            <select onChange={(e) => {}}>
              <option value="newest">Recent Decks</option>
              <option value="oldest">Oldest Decks</option>
            </select>
            <br></br>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Deck</th>
                  <th>Duelist</th>
                  <th>Archetype</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {decklists.map((deck, index) => (
                  <tr key={deck._id}>
                    <td>
                      <Link to={`/decklist/${deck._id}`}>{deck.name}</Link>
                    </td>
                    <td>{deck.duelist}</td>
                    <td>{deck.archetype}</td>
                    <td>${prices[index]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <div>{prices.data}</div>
      </div>
    </div>
  );
}

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
        decklists: action.payload.decklists,
        page: action.payload.page,
        pages: action.payload.pages,
        countDecklists: action.payload.countDecklists,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DecklistsScreen() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const date = sp.get('date') || 'all';
  const tournament = sp.get('tournament') || 'all';
  const archetype = sp.get('archetype') || 'all';
  const page = sp.get('page') || 1;

  const [{ loading, error, decklists }, dispatch] = useReducer(reducer, {
    decklists: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `/api/decklists/tournamentDeckSearch?page=${page}&date=${date}&tournament=${tournament}&archetype=${archetype}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [page, date, tournament, archetype]);

  const [dates, setDates] = useState([]);
  useEffect(
    () => {
      const fetchDates = async () => {
        try {
          const { data } = await axios.get(`/api/decklists/dates`);
          setDates(data);
        } catch (err) {
          toast.error(getError(err));
        }
      };
      fetchDates();
    },
    [dispatch],
    dates
  );

  const [tournaments, setTournaments] = useState([]);
  const [archetypes, setArchetypes] = useState([]);
  useEffect(
    () => {
      const fetchTournaments = async () => {
        try {
          const { data } = await axios.get(`/api/decklists/tournaments`);
          setTournaments(data);
        } catch (err) {
          toast.error(getError(err));
        }
      };
      fetchTournaments();
    },
    [dispatch],
    tournaments
  );

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

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterDate = filter.date || date;
    const filterTournament = filter.tournament || tournament;
    const filterArchetype = filter.archetype || archetype;

    return `/decklists/tournament?date=${filterDate}&tournament=${filterTournament}&archetype=${filterArchetype}&page=${filterPage}`;
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox />
  ) : (
    <div>
      <div>
        <Helmet>
          <title>Decklists</title>
        </Helmet>
        <Row>
          <h3>Tournament Decklists</h3>
        </Row>
        <Row>
          <Col md={3}>
            <h4>Filters</h4>
            <div>
              <h4>Date</h4>
              <ul>
                {dates.map((d) => (
                  <li key={d}>
                    <Link
                      className={d === date ? 'text-bold' : ''}
                      to={getFilterUrl({ date: d })}
                    >
                      {d}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Tournament</h4>
              <ul>
                {tournaments.map((t) => (
                  <li key={t}>
                    <Link
                      className={t === tournament ? 'text-bold' : ''}
                      to={getFilterUrl({ tournament: t })}
                    >
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
                  <th>Tournament</th>
                  <th>Date</th>
                  <th>Placed</th>
                  <th>Duelist</th>
                  <th>Archetype</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {decklists.map((deck) => (
                  <tr key={deck._id}>
                    <td>
                      <Link to={`/decklist/${deck._id}`}>{deck.name}</Link>
                    </td>
                    <td>{deck.tournament}</td>
                    <td>{deck.date}</td>
                    <td>{deck.placement}</td>
                    <td>{deck.duelist}</td>
                    <td>{deck.archetype}</td>
                    <td>$314.12</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    </div>
  );
}

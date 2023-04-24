import React, { useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getError } from '../utils';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import Table from 'react-bootstrap/esm/Table';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/esm/Button';

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
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const date = sp.get('date') || 'all';
  const tournament = sp.get('tournament') || 'all';
  const archetype = sp.get('archetype') || 'all';
  const page = sp.get('page') || 1;
  const order = sp.get('order') || 'newest';

  const [{ loading, error, decklists, pages, countDecklists }, dispatch] =
    useReducer(reducer, {
      decklists: [],
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `/api/decklists/tournamentDeckSearch?page=${page}&date=${date}&tournament=${tournament}&archetype=${archetype}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [page, date, tournament, archetype, order]);

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
    const sortOrder = filter.order || order;

    return `/decklists/tournament?date=${filterDate}&tournament=${filterTournament}&archetype=${filterArchetype}&page=${filterPage}&order=${sortOrder}`;
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
          <a href="/help/decklists" target="_blank">
            Help
          </a>
        </Row>
        <Row>
          <Col md={3}>
            <h4>Filters</h4>
            <div>
              <h4>Date</h4>
              <ul className="filter-side">
                {dates.map((d) => (
                  <li key={d}>
                    <Link
                      className={d === date ? 'text-bold' : 'bold-link'}
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
              <ul className="filter-side">
                {tournaments.map((t) => (
                  <li key={t}>
                    <Link
                      className={t === tournament ? 'text-bold' : 'bold-link'}
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
              <ul className="filter-side">
                {archetypes.map((a) => (
                  <li key={a}>
                    <Link
                      className={a === archetype ? 'text-bold' : 'bold-link'}
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
            <div>
              {countDecklists === 0 ? 'No' : countDecklists} Results
              {date !== 'all' && ' : ' + date}
              {tournament !== 'all' && ' : ' + tournament}
              {archetype !== 'all' && ' : ' + archetype}
              {date !== 'all' || tournament !== 'all' || archetype !== 'all' ? (
                <Button
                  variant="light"
                  onClick={() => navigate('/decklists/tournament')}
                >
                  <i className="fas fa-times-circle"></i>
                </Button>
              ) : null}
            </div>
            Sort by{' '}
            <select
              value={order}
              onChange={(e) => {
                navigate(getFilterUrl({ order: e.target.value }));
              }}
            >
              <option value="newest">Recent Decks</option>
              <option value="oldest">Oldest Decks</option>
            </select>
            <br></br>
            <Table striped="columns" bordered hover>
              <thead>
                <tr>
                  <th>Deck</th>
                  <th>Tournament</th>
                  <th>Date</th>
                  <th>Placed</th>
                  <th>Duelist</th>
                  <th>Archetype</th>
                </tr>
              </thead>
              <tbody>
                {decklists.map((deck) => (
                  <tr key={deck._id}>
                    <td>
                      <Link className="bold-link" to={`/decklist/${deck._id}`}>
                        {deck.name}
                      </Link>
                    </td>
                    <td>{deck.tournament}</td>
                    <td>{deck.date}</td>
                    <td>{deck.placement}</td>
                    <td>{deck.duelist}</td>
                    <td>{deck.archetype}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div>
              {[...Array(pages).keys()].map((x) => (
                <LinkContainer
                  key={x + 1}
                  className="mx-1"
                  to={{
                    search: getFilterUrl({ page: x + 1 }).substring(7),
                  }}
                >
                  <Button
                    className={Number(page) === x + 1 ? 'text-bold' : ''}
                    variant="light"
                  >
                    {x + 1}
                  </Button>
                </LinkContainer>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

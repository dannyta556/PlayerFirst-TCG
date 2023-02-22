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
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function GuidesScreen() {
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: false,
    error: '',
  });

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <h1>Guides</h1>
        <Col md={6}>
          <Card border="dark">
            <Card.Body>
              <Link to={`/guides/best-rouge-decks-of-december-2022`}>
                <Card.Title>The Best Rouge Decks of December 2022</Card.Title>
              </Link>
              <Card.Text>
                Besides the current meta decks of Spright, Tearlaments, and
                Floowandereeze, here are some other decks that can perform well
                in today's metagame. If you are looking for other options, these
                decks are able to compete against the best
              </Card.Text>
            </Card.Body>
            <Card.Footer>John Doe 12/30/2022</Card.Footer>
          </Card>
        </Col>
        <Col md={6}>
          <Card border="dark">
            <Card.Body>
              <Link to={`/guides/top-5-best-anime-decks-to-play`}>
                <Card.Title>Top 5 Best Anime Decks to Play</Card.Title>
              </Link>
              <Card.Text>
                Are you a fan of the TV show and feeling nostalgic to play those
                cards? Here are some decklists using cards from our favorite
                characters. Surprisingly, there are some decks here that can
                hold their own.
              </Card.Text>
            </Card.Body>

            <Card.Footer>James Smith 12/15/2022</Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from 'react';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';

export default function DecksScreen() {
  const [showButtons, setShowButtons] = useState(0);

  return (
    <div>
      <Helmet>
        <title>My Decks</title>
      </Helmet>

      <br></br>
      <Row>
        <Col md={9}>
          <Stack direction="horizontal" gap={3}>
            <h4>My Decks</h4>
            <Button variant="primary" className="ms-auto">
              Edit Deck
            </Button>
            <Button variant="danger">Delete Deck</Button>
          </Stack>
          <br></br>
          <Container className="deck-collection all-decks"></Container>
        </Col>
        <Col md={3}>
          <br></br>
          <br></br>
          <br></br>
          <div className="d-grid gap-2">
            <Button variant="primary" size="lg">
              Create New Deck
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

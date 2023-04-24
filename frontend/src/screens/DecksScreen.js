import React, { useState, useEffect, useReducer, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import Table from 'react-bootstrap/esm/Table';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, decks: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DecksScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [showButtons, setShowButtons] = useState(0);
  const [currentDeck, setCurrentDeck] = useState();
  const [refreshKey, setRefeshKey] = useState(0);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDelete = async () => {
    await axios
      .post('/api/decklists/delete', {
        id: currentDeck,
        email: userInfo.email,
      })
      .then(setShow(false))
      .then(setRefeshKey(refreshKey + 1))
      .catch((err) => {
        toast.error(getError(err));
      });
  };

  const [{ loading, error, decks }, dispatch] = useReducer(reducer, {
    decks: [],
    loading: true,
    error: '',
  });

  const buttonSwitch = (id) => {
    if (showButtons === 0) {
      setShowButtons(1);
      setCurrentDeck(id);
    } else {
      setShowButtons(0);
    }
  };

  const editDeck = () => {
    navigate(`/editDeck/${currentDeck}`);
  };

  const openDeck = () => {
    navigate(`/decklist/${currentDeck}`);
  };

  // creates a new deck for user and redirects them to the edit decklist page
  const createDeck = async (e) => {
    e.preventDefault();
    if (decks.length >= 15) {
      toast.error('At maximum number of decks created');
    } else {
      try {
        const { data } = await axios.post('/api/decklists/new', {
          email: userInfo.email,
          duelist: userInfo.name,
          isUserCreated: true,
        });
        const { response } = await axios.post('/api/users/addDeck', {
          email: userInfo.email,
          deck: data._id,
        });

        navigate(`/editDeck/${data._id}`);
      } catch (err) {
        toast.error(getError(err));
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST ' });
      try {
        const result = await axios.get(
          `/api/decklists/getDecks?email=${userInfo.email}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [userInfo.email, refreshKey]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>My Decks</title>
      </Helmet>
      <br></br>
      <Row>
        <Col md={9}>
          <Stack direction="horizontal" gap={3}>
            <h4>My Decks</h4>
            <a href="/help/myDecks" target="_blank">
              Help
            </a>
            {showButtons === 1 ? (
              <>
                <Button
                  variant="primary"
                  className="ms-auto"
                  onClick={openDeck}
                >
                  View Deck
                </Button>
                <div className="vr" />
                <Button variant="primary" className="" onClick={editDeck}>
                  Edit Deck
                </Button>
                <Button variant="danger" onClick={handleShow}>
                  Delete Deck
                </Button>
                <Modal
                  show={show}
                  onHide={handleClose}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Are you sure you want to delete this deck?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                      Delete Deck
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            ) : (
              <></>
            )}
          </Stack>
          <br></br>
          <Container className="deck-collection all-decks">
            <Table hover>
              <thead>
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                <>
                  {decks.map((deck) => (
                    <tr key={deck._id} data-rowid={deck._id}>
                      <td onClick={() => buttonSwitch(deck._id)}>
                        {deck.name}
                      </td>
                    </tr>
                  ))}
                </>
              </tbody>
            </Table>
          </Container>
        </Col>
        <Col md={3}>
          <br></br>
          <br></br>
          <br></br>
          <div className="d-grid gap-2">
            <Button variant="primary" size="lg" onClick={createDeck}>
              Create New Deck
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

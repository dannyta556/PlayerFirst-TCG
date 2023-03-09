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
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Stack from 'react-bootstrap/Stack';
import { useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, decklist: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function CreateDeckScreen() {
  const params = useParams();
  const { id } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const email = userInfo.email;

  const [search, setSearch] = useState('');
  const [lvl, setLvl] = useState('');
  const [type, setType] = useState([]);
  const [selectionType, setSelectionType] = useState('');
  const [card, setCard] = useState('');
  const [attack, setAttack] = useState('');
  const [defense, setDefense] = useState('');
  const [selectionAttribute, setSelectionAttribute] = useState('');
  const [attribute, setAttribute] = useState([]);

  const [{ loading, error, decklist }, dispatch] = useReducer(reducer, {
    decklist: [],
    loading: true,
    error: '',
  });

  const [refreshKey, setRefeshKey] = useState(0);

  const cardData = useRef(null);
  const currentPage = useRef(1);
  const totalPages = useRef(1);

  const [products, setProducts] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // swap from search to card preview
  const [cardPreview, setCardPreview] = useState(0);
  const [previewName, setPreviewName] = useState('');
  const [previewDesc, setPreviewDesc] = useState('');
  const [previewSlug, setPreviewSlug] = useState('');
  const [previewType, setPreviewType] = useState('');

  // deck prices
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [yourPrice, setYourPrice] = useState(0.0);

  const changeName = (e) => {
    if (e.keyCode === 13) {
      axios.post('/api/decklists/changeName', {
        name: e.target.value,
        id: id,
      });
      toast.success(`Deck name changed`);
    }
  };

  const switchView = (name, desc, slug, type, inDeck) => {
    if (cardPreview === 1) {
      setCardPreview(0);
    } else {
      setCardPreview(1);
      setPreviewDesc(desc);
      setPreviewName(name);
      setPreviewSlug(slug);
      setPreviewType(type);
    }
  };

  const removeCard = (objID, isMainDeck) => {
    axios
      .post(`/api/decklists/deleteCard`, {
        id: id,
        objID: objID,
        isMainDeck: isMainDeck,
      })
      .then((response) => {})
      .catch((err) => {
        toast.error(getError(err));
      });
    setRefeshKey(refreshKey + 1);
  };

  const addCard = (name, slug, type) => {
    const cardType = type || '';
    if (
      cardType === 'Fusion Monster' ||
      cardType === 'Synchro Monster' ||
      cardType === 'XYZ Monster' ||
      cardType === 'Link Monster'
    ) {
      const countInExtra = decklist.extraDeck.filter(
        (card) => card.slug === slug
      ).length;
      if (countInExtra + 1 > 3 || decklist.extraDeck.length >= 15) {
        toast.error('At max copies of that card');
      } else {
        axios
          .post(`/api/decklists/addCard`, {
            slug,
            name,
            id,
            isMainDeck: false,
          })
          .then((response) => {})
          .catch((err) => {
            toast.error(getError(err));
          });
        setRefeshKey(refreshKey + 1);
      }
    } else {
      const countInMain = decklist.mainDeck.filter(
        (card) => card.slug === slug
      ).length;
      if (countInMain + 1 > 3 || decklist.mainDeck.length >= 60) {
        toast.error('At max copies of that card');
      } else {
        axios
          .post(`/api/decklists/addCard`, {
            slug,
            name,
            id,
            isMainDeck: true,
          })
          .then((response) => {})
          .catch((err) => {
            toast.error(getError(err));
          });
        setRefeshKey(refreshKey + 1);
      }
    }
  };

  const submitSearch = async (e) => {
    e.preventDefault();
    try {
      const searchData = await axios.get(
        `/api/products/cardSearch?page=${page}&query=${search}&cardType=${selectionType}&attribute=${selectionAttribute}&atk=${attack}&def=${defense}&level=${lvl}`
      );

      cardData.current = searchData.data.products;
      currentPage.current = searchData.data.page;
      totalPages.current = searchData.data.pages;

      setProducts(cardData.current);
      setPage(currentPage.current);
      setPages(totalPages.current);
    } catch (err) {
      toast.error(err);
    }
  };

  /*
    Fetch deckdata from database using id
    verify that the current user is the one that owns this decklist
    if not redirect the user
  */
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/decklists/${id}`);
        let totalPrice = 0.0;
        const data = await axios.get(
          `/api/decklists/price?id=${id}&email=${email}`
        );

        totalPrice = data.data.totalPrice;
        setTotalPrice(totalPrice);
        setYourPrice(data.data.yourPrice);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/cardTypes`);
        setType(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
    const fetchAttributes = async () => {
      try {
        const { data } = await axios.get(`/api/products/attributes`);
        setAttribute(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchAttributes();
  }, [id, email, refreshKey]);
  /*
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
*/
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>New Deck</title>
      </Helmet>

      <Stack direction="horizontal" gap={3}>
        <InputGroup className="mb-3">
          <InputGroup.Text>Deck Name:</InputGroup.Text>
          <Form.Control
            defaultValue={decklist.name || 'New Deck'}
            aria-label="Deckname"
            onKeyDown={(e) => changeName(e)}
            maxLength={64}
          ></Form.Control>
        </InputGroup>
      </Stack>
      <p>Press Enter to save changes to name</p>
      <br></br>

      <Row>
        <Col md={8}>
          <Stack direction="horizontal" gap={3}>
            <div>Main Deck</div>
            <div className="ms-auto">Total Price: ${totalPrice}</div>
            <div>Your Price: ${yourPrice} </div>
          </Stack>
          <Container className="deck-collection main-deck">
            <Row md={10}>
              {decklist !== null ? (
                decklist.mainDeck.map((card, index) => (
                  <Col md={1} key={card.objID}>
                    <img
                      src={`/images/${card.name.replace(/ /g, '_')}.jpg`}
                      alt={card.name}
                      className="img-fluid"
                      onClick={() =>
                        switchView(
                          card.name,
                          card.desc,
                          card.slug,
                          card.type,
                          true
                        )
                      }
                      onContextMenu={() => removeCard(card.objID, true)}
                    ></img>
                  </Col>
                ))
              ) : (
                <></>
              )}
            </Row>
          </Container>
          <br></br>
          <Stack direction="horizontal">
            <div>Extra Deck</div>
          </Stack>
          <Container className="deck-collection extra-deck">
            <Row>
              {decklist !== null ? (
                decklist.extraDeck.map((card, index) => (
                  <Col sm={1} key={card.slug + index}>
                    <img
                      src={`/images/${card.name.replace(/ /g, '_')}.jpg`}
                      alt={card.name}
                      className="img-fluid"
                      onClick={() =>
                        switchView(
                          card.name,
                          card.desc,
                          card.slug,
                          card.type,
                          true
                        )
                      }
                      onContextMenu={() => removeCard(card.objID, false)}
                    ></img>
                  </Col>
                ))
              ) : (
                <></>
              )}
            </Row>
          </Container>
        </Col>
        <Col md={4}>
          <Container className="search-box">
            {cardPreview === 0 ? (
              <>
                <Row>
                  <Col>
                    <br></br>
                    <h4 className="search-box-title">Search</h4>
                  </Col>
                </Row>
                <Row>
                  {' '}
                  <Form onSubmit={submitSearch}>
                    <InputGroup>
                      <FormControl
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="search cards..."
                      ></FormControl>
                      <Button
                        variant="outline-primary"
                        type="submit"
                        id="button-search"
                      >
                        <i className="fas fa-search"></i>
                      </Button>
                    </InputGroup>
                    <br></br>
                    <Row>
                      <Col>
                        <Form.Group className="mb-3" controlId="card">
                          <Form.Select
                            aria-label="default select example"
                            className="search-box-inputbox"
                            onChange={(e) => setCard(e.target.value)}
                          >
                            <option></option>
                            <option>Monster</option>
                            <option>Spell</option>
                            <option>Trap</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3" controlId="cardType">
                          <Form.Select
                            className="search-box-inputbox"
                            onChange={(e) => setSelectionType(e.target.value)}
                            disabled={card === 'Monster' ? '' : true}
                          >
                            <option key={'none'}></option>
                            {type.map((c) =>
                              c !== 'Spell Card' && c !== 'Trap Card' ? (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ) : (
                                <option key={c} hidden></option>
                              )
                            )}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group className="mb-3" controlId="level">
                          <Form.Control
                            placeholder="level/rank"
                            className="search-box-inputbox"
                            value={lvl}
                            type="text"
                            onChange={(e) =>
                              setLvl(e.target.value.replace(/\D/, ''))
                            }
                            maxLength={2}
                            disabled={card === 'Monster' ? '' : true}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3" controlId="attribute">
                          <Form.Select
                            className="search-box-inputbox"
                            disabled={card === 'Monster' ? '' : true}
                            onChange={(e) =>
                              setSelectionAttribute(e.target.value)
                            }
                          >
                            <option value={''}></option>
                            {attribute.map((c) => (
                              <option value={c} key={c}>
                                {c}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group className="mb-3" controlId="attack">
                          <Form.Control
                            placeholder="attack"
                            className="search-box-inputbox"
                            type="text"
                            value={attack}
                            onChange={(e) =>
                              setAttack(e.target.value.replace(/\D/, ''))
                            }
                            disabled={card === 'Monster' ? '' : true}
                            maxLength={5}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3" controlId="defense">
                          <Form.Control
                            placeholder="defense"
                            className="search-box-inputbox"
                            type="text"
                            value={defense}
                            disabled={card === 'Monster' ? '' : true}
                            onChange={(e) =>
                              setDefense(e.target.value.replace(/\D/, ''))
                            }
                            maxLength={5}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Row>
              </>
            ) : (
              <div>
                <Row>
                  <Col md={4}>
                    <br></br>
                    <img
                      src={`/images/${previewName.replace(/ /g, '_')}.jpg`}
                      alt={previewName}
                      className=" rounded card-preview"
                    ></img>
                  </Col>
                  <Col md={8}>
                    <h5 className="card-name">{previewName}</h5>
                    <p className="description">{previewDesc || ''}</p>
                    <Stack direction="horizontal" gap={2}>
                      <Button className="preview-btns" onClick={switchView}>
                        {' '}
                        Back to Search
                      </Button>
                      <Button
                        className="preview-btns"
                        onClick={() =>
                          addCard(previewName, previewSlug, previewType)
                        }
                      >
                        Add card
                      </Button>
                    </Stack>
                  </Col>
                </Row>
              </div>
            )}

            <Row>
              <Container className="results-box">
                <Row>
                  {products !== null ? (
                    products.map((card) => (
                      <Col sm={3} key={card._id}>
                        <img
                          src={`/images/${card.name.replace(/ /g, '_')}.jpg`}
                          alt={card.name}
                          className="img-fluid rounded img-thumbnail"
                          onClick={() =>
                            switchView(
                              card.name,
                              card.desc,
                              card.slug,
                              card.type
                            )
                          }
                        ></img>
                      </Col>
                    ))
                  ) : (
                    <></>
                  )}
                </Row>
                <div>
                  {products !== null ? (
                    [...Array(pages).keys()].map((x) => (
                      <LinkContainer
                        key={x + 1}
                        className="mx+1"
                        to={{
                          pathname: '/searchCards',
                        }}
                      >
                        <Button
                          className={Number(page) === x + 1 ? 'text-bold' : ''}
                          variant="light"
                        >
                          {x + 1}
                        </Button>
                      </LinkContainer>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              </Container>
            </Row>
          </Container>
        </Col>
      </Row>
    </div>
  );
}

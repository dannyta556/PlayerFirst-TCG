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
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Stack from 'react-bootstrap/Stack';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, cardCollection: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function CreateDeckScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
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

  const [{ loading, error, cardCollection }, dispatch] = useReducer(reducer, {
    cardCollection: [],
    loading: true,
    error: '',
  });

  const [refreshKey, setRefeshKey] = useState(0);

  const cardData = useRef(null);
  const currentPage = useRef(1);
  const totalPages = useRef(1);
  const totalCards = useRef(0);

  //const [cardData, setCardData] = useState([]);
  const [products, setProducts] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [cardCount, setCardCount] = useState(1);

  // swap from search to card preview
  const [cardPreview, setCardPreview] = useState(0);
  const [previewName, setPreviewName] = useState('');
  const [previewDesc, setPreviewDesc] = useState('');
  const [previewSlug, setPreviewSlug] = useState('');

  // deck prices
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [yourPrice, setYourPrice] = useState(0.0);

  const switchView = (name, desc, slug) => {
    if (cardPreview === 1) {
      setCardPreview(0);
    } else {
      setCardPreview(1);
      setPreviewDesc(desc);
      setPreviewName(name);
      setPreviewSlug(slug);
    }
  };

  const addCard = (name, slug) => {
    const found = cardCollection.some((card) => card.slug === slug);

    if (!found) {
      axios
        .post(`/api/users/addCard`, {
          slug,
          name,
          email,
        })
        .then((response) => {})
        .catch((err) => {
          toast.error(getError(err));
        });
      setRefeshKey(refreshKey + 1);
    } else {
      toast.error('Card already exists in your Collection');
    }
  };

  const submitSearch = async (e) => {
    e.preventDefault();
    try {
      const searchData = await axios.get(
        `api/products/cardSearch?page=${page}&query=${search}&cardType=${selectionType}&attribute=${selectionAttribute}&atk=${attack}&def=${defense}&level=${lvl}`
      );

      cardData.current = searchData.data.products;
      currentPage.current = searchData.data.page;
      totalPages.current = searchData.data.pages;
      totalCards.current = searchData.data.countProducts;

      setProducts(cardData.current);
      setPage(currentPage.current);
      setPages(totalPages.current);
      setCardCount(totalCards.current);
    } catch (err) {
      toast.error(err);
    }

    /*

    */
  };

  return (
    <div>
      <Helmet>
        <title>New Deck</title>
      </Helmet>

      <Stack direction="horizontal" gap={3}>
        <h4>New Deck</h4>
      </Stack>
      <br></br>

      <Row>
        <Col md={8}>
          <Stack direction="horizontal" gap={3}>
            <div>Main Deck</div>
            <div className="ms-auto">Total Price: ${totalPrice}</div>
            <div>Your Price: ${yourPrice} </div>
          </Stack>
          <Container className="deck-collection main-deck"></Container>
          <br></br>
          <Stack direction="horizontal">
            <div>Extra Deck</div>
          </Stack>
          <Container className="deck-collection extra-deck"></Container>
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
                <h4>{previewName}</h4>
                <p>{previewDesc}</p>
                <Button onClick={switchView}> Back to Search</Button>
                <Button onClick={() => addCard(previewName, previewSlug)}>
                  {' '}
                  Add card
                </Button>
              </div>
            )}

            <Row>
              <Container className="results-box">
                <Row>
                  {products !== null ? (
                    products.map((card) => (
                      <Col sm={3} key={card._id}>
                        <img
                          src={card.card_images[0].image_url}
                          alt={card.name}
                          className="img-fluid rounded img-thumbnail"
                          onClick={() =>
                            switchView(card.name, card.desc, card.slug)
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

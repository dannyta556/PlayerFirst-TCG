import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LinkContainer } from 'react-router-bootstrap';

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

function MyCollection() {
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

  const removeCard = (slug, count) => {
    if (count > 1) {
      axios
        .put(`/api/users/decrementCard`, {
          slug,
          email,
        })
        .then((response) => {})
        .catch((err) => {
          toast.error(getError(err));
        });
      setRefeshKey(refreshKey + 1);
    } else {
      axios
        .post(`/api/users/removeCard`, {
          slug,
          email,
        })
        .then((response) => {})
        .catch((err) => {
          toast.error(getError(err));
        });
      setRefeshKey(refreshKey + 1);
    }
  };

  const incrementCard = (slug, count) => {
    if (count + 1 > 3) {
      // do not add
      toast.error('At max copies of that card');
    } else {
      axios
        .put(`/api/users/incrementCard`, {
          slug,
          email,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((err) => {
          toast.error(getError(err));
        });

      setRefeshKey(refreshKey + 1);
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

  // On page load useEffect gets the current user's cardCollection
  // and displays it under MyCollection Table
  // It also fetches categories and attributes for the search screen
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `/api/users/collection?email=${userInfo.email}`
        );
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
  }, [userInfo.email, refreshKey]);
  return (
    <div>
      <Helmet>
        <title>My Collection</title>
      </Helmet>
      <h4>My Collection</h4>
      <Row>
        <Col md={8}>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Count</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <>
                  {cardCollection.map((card) => (
                    <tr key={card.slug} data-rowid={card.slug}>
                      <td>
                        {' '}
                        <img
                          src={`/images/${card.name.replace(/ /g, '_')}.jpg`}
                          alt={card.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>
                      </td>
                      <td>{card.name}</td>
                      <td>{card.count}</td>
                      <td>
                        <Button
                          onClick={() => incrementCard(card.slug, card.count)}
                        >
                          Add
                        </Button>
                      </td>
                      <td>
                        <Button
                          onClick={() => removeCard(card.slug, card.count)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </>
              </tbody>
            </Table>
          )}
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
                          src={`/images/${card.name.replace(/ /g, '_')}.jpg`}
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

export default MyCollection;

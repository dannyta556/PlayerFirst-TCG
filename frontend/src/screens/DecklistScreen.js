import React, { useEffect, useReducer, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Stack from 'react-bootstrap/Stack';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { toast } from 'react-toastify';

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

const mainDeckReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, mainDeckPrices: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function DecklistScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [{ loading, error, decklist }, dispatch] = useReducer(reducer, {
    decklist: [],
    loading: true,
    error: '',
  });

  const [{ loadingPrices, pricesError, mainDeckPrices }, dispatchPrice] =
    useReducer(mainDeckReducer, {
      mainDeckPrices: [],
      loadingPrices: true,
      pricesError: '',
    });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === decklist._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        ...decklist,
        quantity,
        price: totalPrice,
        mdPrices: mdPrices,
        edPrices: edPrices,
      },
    });

    // navigate to cart screen
    navigate('/cart');
  };

  const [totalPrice, setTotalPrice] = useState(0.0);
  const [mdPrices, setMDPrices] = useState([]);
  const [edPrices, setEDPrices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      dispatchPrice({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/decklists/${id}`);

        const data = await axios.get(
          `/api/decklists/price?id=${id}&email=${userInfo.email}`
        );

        const prices = await axios.get(`/api/decklists/prices?id=${id}`);

        setMDPrices(prices.data.mainDeckPrices);
        setEDPrices(prices.data.extraDeckPrices);
        setTotalPrice(data.data.totalPrice);
        let mainDeckP = [];
        result.data.mainDeck.map((card) =>
          mainDeckP.push(Math.round(10 * Math.random() * 100) / 100)
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        dispatchPrice({ type: 'FETCH_SUCCESS', payload: mainDeckP });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [id, userInfo]);

  return loading && loadingPrices ? (
    <LoadingBox />
  ) : error && pricesError ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>
          {decklist.name} by {decklist.duelist}
        </title>
      </Helmet>
      <h3>{decklist.name}</h3>
      <br></br>
      <Stack direction="horizontal" gap={3}>
        <div>by: {decklist.duelist}</div>
        <div>{decklist.date}</div>
      </Stack>
      <br></br>
      <Stack direction="horizontal" gap={3}>
        <div>Archetype: {decklist.archetype}</div>
        <div>Approval: 96%</div>
        <Button className="ms-auto" onClick={addToCartHandler}>
          Buy this deck
        </Button>
      </Stack>
      <br></br>
      <Stack direction="horizontal" gap={3}>
        <div>Main Deck</div>
        <div className="ms-auto">Price: ${totalPrice}</div>
      </Stack>
      <Table>
        <thead>
          <tr>
            <th>Count</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <>
            {decklist.mainDeck.map((card, index) => (
              <tr key={index} data-rowid={card.slug}>
                <td>{card.count}</td>
                <td>
                  <Link to={`/product/${card.slug}`}>{card.name}</Link>
                </td>
                <td>${mdPrices[index]}</td>
              </tr>
            ))}
          </>
        </tbody>
      </Table>
      <div>Extra Deck</div>
      <Table>
        <thead>
          <tr>
            <th>Count</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <>
            {decklist.extraDeck.map((card, index) => (
              <tr key={card.slug} data-rowid={card.slug}>
                <td>{card.count}</td>
                <td>
                  <Link to={`/product/${card.slug}`}>{card.name}</Link>
                </td>
                <td>${edPrices[index]}</td>
              </tr>
            ))}
          </>
        </tbody>
      </Table>
    </div>
  );
}

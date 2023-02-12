import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Axios from 'axios';

export default function DashboardScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');

  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [author, setAuthor] = useState('');
  const [articleDesc, setArticleDesc] = useState('');
  const [markdown, setMarkdown] = useState('');

  const todayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedDate = mm + '/' + dd + '/' + yyyy;
    return formattedDate;
  };

  const newProductHandler = async (e) => {
    e.preventDefault();
    try {
      // send post request to /api/product/newproduct
    } catch (err) {
      toast.error(getError(err));
    }
  };
  const newArticleHandler = async (e) => {
    e.preventDefault();
    try {
      // send post request to /api/articles/new
      const date = todayDate();
      console.log(type);
      const { data } = await Axios.post('/api/articles/new', {
        title: title,
        author: author,
        type: type,
        desc: articleDesc,
        markdown: markdown,
        createdAt: date,
      });
      toast.success('New article created');
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <div>
      <Row>
        <Helmet>
          <title>Admin Dashboard</title>
        </Helmet>
        <h1>Admin Dashboard</h1>
        <h2>Database Management</h2>
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>Add new product</h4>
              <Form onSubmit={newProductHandler}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="type">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    aria-label="default select example"
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option>Select product type</option>
                    <option value="article">Single</option>
                    <option value="guide">Card Set</option>
                    <option value="guide">Accessory</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="desc">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    required
                    rows={3}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formFile">
                  <Form.Label>Image</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Form.Group>
                <div className="mb-3">
                  <Button type="submit">Submit</Button>
                </div>
              </Form>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h4>New Article</h4>
              <Form onSubmit={newArticleHandler}>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="type">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    aria-label="default select example"
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option>Select if article or guide</option>
                    <option value="article">Article</option>
                    <option value="guide">Guide</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="author">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="articleDesc">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    required
                    rows={2}
                    onChange={(e) => setArticleDesc(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formFile">
                  <Form.Label>Image</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="markdown">
                  <Form.Label>Markdown</Form.Label>
                  <Form.Control
                    as="textarea"
                    required
                    rows={3}
                    onChange={(e) => setMarkdown(e.target.value)}
                  />
                </Form.Group>
                <div className="mb-3">
                  <Button type="submit">Submit</Button>
                </div>
              </Form>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
}

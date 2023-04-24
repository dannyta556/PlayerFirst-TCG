import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from './Store';
import { useContext } from 'react';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import SignUpScreen from './screens/SignUpScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import GuidesScreen from './screens/GuidesScreen';
import ArticlesScreen from './screens/AritclesScreen';
import ArticleScreen from './screens/ArticleScreen';
import MyCollection from './screens/MyCollection';
import DecklistsScreen from './screens/DecklistsScreen';
import DecksScreen from './screens/DecksScreen';
import CreateDeckScreen from './screens/CreateDeckScreen';
import DecklistScreen from './screens/DecklistScreen';
import UserDecklistsScreen from './screens/UserDecklistsScreen';
import HelpScreen from './screens/HelpScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // when signing out, remove user data from localstorage
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="light" variant="light" expand="lg">
            <LinkContainer to="/">
              <Navbar.Brand>Kenobi's Cards</Navbar.Brand>
            </LinkContainer>
            <SearchBox className="search-bar" />
            <Nav className="me-auto w-100 justify-content-end">
              <Link to="/cart" className="nav-link">
                Cart{' '}
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>User Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orderHistory">
                    <NavDropdown.Item>Order History</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/myCollection">
                    <NavDropdown.Item>My Collection</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <Link
                    className="dropdown-item"
                    to="#signout"
                    onClick={signoutHandler}
                  >
                    Sign Out
                  </Link>
                </NavDropdown>
              ) : (
                <Link className="nav-link" to="/signin">
                  Sign In{' '}
                </Link>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  className="nav-right"
                  title="Admin"
                  id="admin-nav-dropdown"
                >
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderList">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar>
          <Navbar
            bg="primary"
            variant="dark"
            expand="lg"
            className="gap-3 px-3"
          >
            <Container>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse
                id="basic-navbar-nav"
                className="justify-content-center"
              >
                <Nav className="flex-grow-1 justify-content-evenly">
                  <Nav.Item>
                    <Link to="/search?category=single" className="nav-link">
                      Singles
                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link to="/search?category=set" className="nav-link">
                      Card Sets
                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <NavDropdown id="nav-dropdown-decklists" title="Decklists">
                      <LinkContainer to="/decklists/user">
                        <NavDropdown.Item>User Decklists</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/decklists/tournament">
                        <NavDropdown.Item>
                          Tournament Decklists
                        </NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  </Nav.Item>
                  <Nav.Item>
                    <Link to="/mydecks" className="nav-link">
                      My Decks
                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link to="/articles" className="nav-link">
                      Articles
                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link to="/guides" className="nav-link">
                      Guides
                    </Link>
                  </Nav.Item>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-5">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignUpScreen />} />
              <Route path="/guides" element={<GuidesScreen />} />
              <Route path="/articles" element={<ArticlesScreen />} />
              <Route path="/help/:page" element={<HelpScreen />} />
              <Route path="/articles/:slug" element={<ArticleScreen />} />
              <Route
                path="/decklists/tournament"
                element={<DecklistsScreen />}
              />
              <Route path="/decklists/user" element={<UserDecklistsScreen />} />
              <Route path="/decklist/:id" element={<DecklistScreen />} />
              <Route
                path="/mydecks"
                element={
                  <ProtectedRoute>
                    <DecksScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/editDeck/:id"
                element={
                  <ProtectedRoute>
                    <CreateDeckScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/myCollection"
                element={
                  <ProtectedRoute>
                    <MyCollection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;

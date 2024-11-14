import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import TicketCreation from './pages/TicketCreation';
// import './style.css';

export default function App() {
  return (
    <Router>
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container>
          <Navbar.Brand href='/'>Business Management Portal</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <Nav.Link as={Link} to='/'>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to='/dashboard'>
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to='/search'>
                Search
              </Nav.Link>
              <Nav.Link as={Link} to='/ticketcreation'>
                TicketCreation
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className='my-4'>
        <Routes>
          <Route exact path='/' element={<Home title='Home Page' />} />
          <Route
            path='/dashboard'
            element={<Dashboard title='Dashboard Page' />}
          />
          <Route path='/seasrch' element={<Search title='Search Page' />} />
          <Route
            path='/ticketcreation'
            element={<TicketCreation title='Ticket Creation Page' />}
          />
        </Routes>
      </Container>
    </Router>
  );
}

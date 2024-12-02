import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../style.css';

const Header = () => {
  return (
    <Navbar
      expand='lg'
      style={{
        background: '#5B7F96 ',
        color: 'white',
      }}
    >
      <Container>
        <Navbar.Brand href='/' style={{ color: 'white', fontWeight: 'bold' }}>
          Ticketify
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link
              as={Link}
              to='/'
              className='nav-link'
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to='/dashboard'
              className='nav-link'
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to='/search'
              className='nav-link'
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              Search
            </Nav.Link>
            <Nav.Link
              as={Link}
              to='/ticketcreation'
              className='nav-link'
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              Ticket Creation
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

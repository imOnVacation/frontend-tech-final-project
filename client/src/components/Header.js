import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../style.css';

const Header = () => {
  return (
    <Navbar bg='light' variant='light' expand='lg'>
      <Container>
        <Navbar.Brand href='/'>Business Management Portal</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link as={Link} to='/' className='nav-link'>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to='/dashboard' className='nav-link'>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to='/search' className='nav-link'>
              Search
            </Nav.Link>
            <Nav.Link as={Link} to='/ticketcreation' className='nav-link'>
              TicketCreation
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

describe('Header Component', () => {
  it('renders the navbar with the correct brand text', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText('Business Management Portal')).toBeInTheDocument();
  });

  it('renders all navigation links with correct text and paths', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const links = [
      { text: 'Home', path: '/' },
      { text: 'Dashboard', path: '/dashboard' },
      { text: 'Search', path: '/search' },
      { text: 'Ticket Creation', path: '/ticketcreation' },
    ];

    links.forEach(({ text, path }) => {
      const linkElement = screen.getByRole('link', { name: text });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', path);
    });
  });

  it('has a responsive navbar toggle button', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByLabelText('Toggle navigation')).toBeInTheDocument();
  });
});

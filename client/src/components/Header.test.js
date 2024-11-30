import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

describe('Header Component', () => {
  it('renders the header with correct links and branding', () => {
    // Render Header within BrowserRouter to handle <Link>
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Check that the brand text is displayed
    expect(screen.getByText(/Business Management Portal/i)).toBeInTheDocument();

    // Check that navigation links are displayed and point to correct paths
    expect(screen.getByRole('link', { name: /Home/i })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveAttribute(
      'href',
      '/dashboard'
    );
    expect(screen.getByRole('link', { name: /Search/i })).toHaveAttribute(
      'href',
      '/search'
    );
    expect(
      screen.getByRole('link', { name: /Ticket Creation/i })
    ).toHaveAttribute('href', '/ticketcreation');
  });

  it('has correct styling', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Check for the background color of the Navbar using its accessible role
    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveStyle('background: #5B7F96');
  });
});

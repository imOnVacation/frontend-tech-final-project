import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TicketStatusGraph from './TicketStatusGraph';

// Mock API fetch
global.fetch = jest.fn();

describe('TicketStatusGraph Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header and dropdown', () => {
    render(
      <MemoryRouter>
        <TicketStatusGraph />
      </MemoryRouter>
    );

    expect(screen.getByText(/Ticket Status Distribution/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/Select Month/i)).toBeInTheDocument();
  });

  it('fetches and displays data when mounted', async () => {
    const mockData = {
      Open: 10,
      WIP: 20,
      Completed: 15,
      Assigned: 5,
      Cancelled: 0,
    };

    fetch.mockResolvedValueOnce({
      json: async () => mockData,
    });

    render(
      <MemoryRouter>
        <TicketStatusGraph />
      </MemoryRouter>
    );

    expect(fetch).toHaveBeenCalledWith(
      `/api/tickets/by-month?month=${new Date().getMonth() + 1}`
    );

    // Use findByText to automatically wait for elements to appear
    expect(await screen.findByText(/10 Tickets/i)).toBeInTheDocument();
    expect(await screen.findByText(/20 Tickets/i)).toBeInTheDocument();
  });

  it('shows loading indicator while fetching data', () => {
    fetch.mockResolvedValueOnce(new Promise(() => {}));

    render(
      <MemoryRouter>
        <TicketStatusGraph />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('shows an error message if fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    render(
      <MemoryRouter>
        <TicketStatusGraph />
      </MemoryRouter>
    );

    // Use findByText for error message
    expect(
      await screen.findByText(/Error fetching data. Please try again later./i)
    ).toBeInTheDocument();
  });

  it('updates data when the selected month changes', async () => {
    const mockDataJanuary = {
      Open: 5,
      WIP: 10,
      Completed: 20,
      Assigned: 0,
      Cancelled: 1,
    };
    const mockDataFebruary = {
      Open: 8,
      WIP: 12,
      Completed: 15,
      Assigned: 3,
      Cancelled: 2,
    };

    fetch.mockResolvedValueOnce({
      json: async () => mockDataJanuary,
    });
    fetch.mockResolvedValueOnce({
      json: async () => mockDataFebruary,
    });

    render(
      <MemoryRouter>
        <TicketStatusGraph />
      </MemoryRouter>
    );

    // Initial data
    expect(await screen.findByText(/5 Tickets/i)).toBeInTheDocument();

    // Change month
    fireEvent.change(screen.getByLabelText(/Select Month/i), {
      target: { value: 2 },
    });

    // Updated data
    expect(await screen.findByText(/8 Tickets/i)).toBeInTheDocument();
  });

  it('shows a message when there are no tickets for the selected month', async () => {
    const mockData = {};

    fetch.mockResolvedValueOnce({
      json: async () => mockData,
    });

    render(
      <MemoryRouter>
        <TicketStatusGraph />
      </MemoryRouter>
    );

    // Use findByText for no tickets message
    expect(
      await screen.findByText(/No tickets available for the selected month./i)
    ).toBeInTheDocument();
  });
});

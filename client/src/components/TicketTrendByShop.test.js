import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TicketTrendByShop from './TicketTrendByShop';

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe('TicketTrendByShop Component', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });
  test('renders correctly with no shops selected', () => {
    render(<TicketTrendByShop />);
    expect(
      screen.getByText('Ticket Volume Trends Across Shops')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Please select shop(s) to view the trends.')
    ).toBeInTheDocument();
  });

  test('fetches and displays shops', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => [{ shop: 'Shop A' }, { shop: 'Shop B' }],
    });

    render(<TicketTrendByShop />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/shops');
    });

    const shopSelect = screen.getByRole('combobox');
    expect(shopSelect).toBeInTheDocument();

    fireEvent.mouseDown(shopSelect);

    const shopAOption = await screen.findByText('Shop A');
    const shopBOption = await screen.findByText('Shop B');

    expect(shopAOption).toBeInTheDocument();
    expect(shopBOption).toBeInTheDocument();

    fireEvent.click(shopAOption);

    expect(screen.getByText('Shop A')).toBeInTheDocument();
  });

  test('renders loading state when fetching chart data', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => [{ shop: 'Shop A' }, { shop: 'Shop B' }],
    });

    fetch.mockResolvedValueOnce({
      json: async () => ({
        labels: ['Jan', 'Feb', 'Mar'],
        data: [10, 20, 30],
      }),
    });

    render(<TicketTrendByShop />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/shops');
    });

    const shopSelect = screen.getByRole('combobox');
    expect(shopSelect).toBeInTheDocument();

    fireEvent.mouseDown(shopSelect);

    const shopAOption = await screen.findByText('Shop A');
    fireEvent.click(shopAOption);

    await waitFor(() => {
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<TicketTrendByShop />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/shops');
    });

    expect(
      screen.getByText('Please select shop(s) to view the trends.')
    ).toBeInTheDocument();

    expect(console.error).toHaveBeenCalled(); // Mock console.error if needed
  });
});

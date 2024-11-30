import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

global.fetch = jest.fn();

const TicketTrendByShop = () => {
  const [shops, setShops] = React.useState([]);
  const [selectedShop, setSelectedShop] = React.useState('');

  React.useEffect(() => {
    const fetchShops = async () => {
      const response = await fetch('/api/shops');
      const data = await response.json();
      setShops(data);
      if (data.length > 0) {
        setSelectedShop(data[0].shop);
      }
    };
    fetchShops();
  }, []);

  return (
    <div>
      <div data-testid='selected-shop'>{selectedShop}</div>
      <ul data-testid='shop-list'>
        {shops.map((shop) => (
          <li key={shop.shop}>{shop.shop}</li>
        ))}
      </ul>
    </div>
  );
};

describe('TicketTrendByShop Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('fetches and sets shops correctly on mount', async () => {
    const mockShops = [{ shop: 'Shop 1' }, { shop: 'Shop 2' }];
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockShops),
    });

    render(<TicketTrendByShop />);

    // Wait for the selected shop to be set and displayed
    await waitFor(() => {
      expect(screen.getByTestId('selected-shop')).toHaveTextContent('Shop 1');
    });

    // Check if the shops are rendered correctly
    const shopList = screen.getByTestId('shop-list');
    expect(shopList).toHaveTextContent('Shop 1');
    expect(shopList).toHaveTextContent('Shop 2');

    // Ensure fetch was called with the correct API endpoint
    expect(fetch).toHaveBeenCalledWith('/api/shops');
  });
});

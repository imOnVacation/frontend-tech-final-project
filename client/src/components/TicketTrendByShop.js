import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TicketTrendByShop = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [lineChartData, setLineChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('/api/shops');
        const data = await response.json();
        setShops(data);

        if (data.length > 0) {
          setSelectedShop(data[0].shop);
        }
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    fetchShops();
  }, []);

  useEffect(() => {
    if (!selectedShop) return;

    const fetchLineChartData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/tickets/by-shop?shop=${selectedShop}`
        );
        const data = await response.json();
        setLineChartData(data);
      } catch (error) {
        console.error('Error fetching ticket trend data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLineChartData();
  }, [selectedShop]);

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: '# of Tickets',
        },
      },
    },
  };

  return (
    <section className='container mt-5'>
      <h1
        className='text-center mb-4'
        style={{ fontSize: '2rem', fontWeight: 'bold' }}
      >
        Ticket Volume Trends Across Shops
      </h1>

      <div className='mb-3 d-flex justify-content-center align-items-center'>
        <label htmlFor='shop-select' className='form-label me-2 mb-0'>
          Select Shop:
        </label>
        <select
          id='shop-select'
          className='form-select w-auto'
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
        >
          {shops.map((shop) => (
            <option key={shop.shop} value={shop.shop}>
              {shop.shop}
            </option>
          ))}
        </select>
      </div>

      <div className='d-flex justify-content-center align-items-center'>
        {isLoading ? (
          <div>Loading...</div>
        ) : lineChartData ? (
          <div style={{ width: '600px', height: '400px' }}>
            <Line
              data={{
                labels: lineChartData.labels,
                datasets: [
                  {
                    label: `Tickets for ${selectedShop}`,
                    data: lineChartData.data,
                    borderColor: 'rgba(75,192,192,1)',
                    fill: false,
                  },
                ],
              }}
              options={lineChartOptions}
            />
          </div>
        ) : selectedShop ? (
          <div>No ticket data available for the selected shop.</div>
        ) : (
          <div>Please select a shop to view the trends.</div>
        )}
      </div>
    </section>
  );
};

export default TicketTrendByShop;

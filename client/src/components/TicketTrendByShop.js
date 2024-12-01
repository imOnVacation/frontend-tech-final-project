import React, { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TicketTrendByShop = () => {
  const [shops, setShops] = useState([]);
  const [selectedShops, setSelectedShops] = useState([]);
  const [lineChartData, setLineChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const assignColorsToShops = useCallback((shops) => {
    const distinguishableColors = [
      '#e6194b',
      '#3cb44b',
      '#ffe119',
      '#4363d8',
      '#f58231',
      '#911eb4',
      '#46f0f0',
      '#f032e6',
      '#bcf60c',
      '#fabebe',
      '#008080',
      '#e6beff',
      '#9a6324',
      '#000075',
      '#800000',
      '#aaffc3',
      '#808000',
      '#ffd8b1',
      '#808080',
      '#fffac8',
    ];

    return shops.map((shop, index) => ({
      ...shop,
      color: distinguishableColors[index % distinguishableColors.length],
    }));
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('/api/shops');
        const data = await response.json();
        setShops(
          assignColorsToShops(
            data.map((shop) => ({ label: shop.shop, value: shop.shop }))
          )
        );
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    fetchShops();
  }, [assignColorsToShops]);

  useEffect(() => {
    if (selectedShops.length === 0) return;

    const fetchLineChartData = async () => {
      setIsLoading(true);
      try {
        const responses = await Promise.all(
          selectedShops.map((shop) =>
            fetch(`/api/tickets/by-shop?shop=${shop.value}`)
          )
        );
        const dataSets = await Promise.all(responses.map((res) => res.json()));

        const labels = dataSets[0]?.labels || [];
        const datasets = dataSets.map((data, index) => ({
          label: `Tickets for ${selectedShops[index].value}`,
          data: data.data,
          borderColor: selectedShops[index].color,
          fill: false,
        }));

        setLineChartData({ labels, datasets });
      } catch (error) {
        console.error('Error fetching ticket trend data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLineChartData();
  }, [selectedShops]);

  const applyAlphaToColor = (color, alpha) => {
    const [r, g, b] = color
      .replace('#', '')
      .match(/.{1,2}/g)
      .map((x) => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? applyAlphaToColor(data.color, 0.1)
        : undefined,
      color: isDisabled ? '#ccc' : isSelected ? 'white' : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : applyAlphaToColor(data.color, 0.3)
          : undefined,
      },
    }),
    multiValue: (styles, { data }) => ({
      ...styles,
      backgroundColor: applyAlphaToColor(data.color, 0.1),
    }),
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
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

  const handleShopSelection = (selectedOptions) => {
    setSelectedShops(selectedOptions || []);
    if (!selectedOptions || selectedOptions.length === 0) {
      setLineChartData(null);
    }
  };

  return (
    <section className='container my-5'>
      <h1 className='text-center mb-4 fw-bold'>
        Ticket Volume Trends Across Shops
      </h1>

      <div className='mb-3'>
        <label htmlFor='shop-select' className='form-label'>
          Select Shop(s):
        </label>
        <Select
          id='shop-select'
          options={shops}
          isMulti
          value={selectedShops}
          onChange={handleShopSelection}
          placeholder='Select shops...'
          styles={colourStyles}
          aria-label='Shop selection dropdown'
        />
      </div>

      <div className='d-flex justify-content-center align-items-center bg-light rounded border p-3'>
        {isLoading ? (
          <div className='d-flex align-items-center'>
            <div className='spinner-border text-primary me-2' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
            <span className='text-dark'>Loading data...</span>
          </div>
        ) : lineChartData && lineChartData.datasets.length > 0 ? (
          <div className='w-100' style={{ maxWidth: '800px', height: '400px' }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        ) : selectedShops.length > 0 ? (
          <div className='alert alert-danger' role='alert'>
            No ticket data available for the selected shops.
          </div>
        ) : (
          <div className='alert alert-primary' role='alert'>
            Please select shop(s) to view the trends.
          </div>
        )}
      </div>
    </section>
  );
};

export default TicketTrendByShop;

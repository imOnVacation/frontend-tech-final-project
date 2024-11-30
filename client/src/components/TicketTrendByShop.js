import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import chroma from 'chroma-js';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TicketTrendByShop = () => {
  const [shops, setShops] = useState([]);
  const [selectedShops, setSelectedShops] = useState([]);
  const [lineChartData, setLineChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const assignColorsToShops = (shops) =>
    shops.map((shop, index) => ({
      ...shop,
      color: distinguishableColors[index % distinguishableColors.length],
    }));

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
  }, []);

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

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',

        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },
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

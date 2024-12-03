import React, { useEffect, useState, useCallback } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const TICKET_STATUSES = ['Open', 'WIP', 'Completed', 'Assigned', 'Cancelled'];
const backendUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://ticketify-server.vercel.app'
    : 'http://localhost:5000';

const getContrastColor = (bgColor) => {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const renderCard = (
  status,
  ticketCount,
  isClickable,
  selectedMonth,
  navigate,
  color
) => (
  <div
    key={status}
    className={`card m-2 text-center ${
      isClickable ? 'clickable-card' : 'non-clickable-card'
    }`}
    style={{
      width: '150px',
      cursor: isClickable ? 'pointer' : 'default',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      minHeight: 'unset',
      backgroundColor: color,
    }}
    onClick={() =>
      isClickable &&
      navigate(
        `/tickets/list?month=${selectedMonth}&status=${encodeURIComponent(
          status
        )}`
      )
    }
  >
    <div className='card-body'>
      <h5
        className='card-title'
        style={{
          color: getContrastColor(color),
        }}
      >
        {status}
      </h5>
      <p
        className='card-text'
        style={{
          fontSize: '1.2rem',
          color: getContrastColor(color),
        }}
      >
        {ticketCount} Tickets
      </p>
    </div>
  </div>
);

const TicketStatusOverview = ({ statusCounts, selectedMonth, colors }) => {
  const navigate = useNavigate();

  return (
    <div className='d-flex flex-wrap justify-content-center my-4'>
      {TICKET_STATUSES.map((status, index) =>
        renderCard(
          status,
          statusCounts?.[status] || 0,
          statusCounts?.[status] > 0,
          selectedMonth,
          navigate,
          colors[index]
        )
      )}
    </div>
  );
};

const TicketStatusGraph = () => {
  const [statusCounts, setStatusCounts] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatusCounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/tickets/by-month?month=${selectedMonth}`
      );
      const data = await response.json();
      setStatusCounts(data);
    } catch (error) {
      console.error('Error fetching status counts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    fetchStatusCounts();
  }, [fetchStatusCounts]);

  const totalTickets = Object.values(statusCounts || {}).reduce(
    (sum, count) => sum + count,
    0
  );
  const percentages =
    totalTickets > 0
      ? TICKET_STATUSES.reduce((acc, status) => {
          acc[status] = ((statusCounts?.[status] || 0) / totalTickets) * 100;
          return acc;
        }, {})
      : null;

  const data = {
    labels: TICKET_STATUSES,
    datasets: [
      {
        data: percentages ? Object.values(percentages) : [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  const chartOptions = (totalTickets) => ({
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => ` ${tooltipItem.raw.toFixed(2)}%`,
        },
      },
      legend: {
        display: totalTickets > 0,
        labels: {
          color: 'white',
          filter: (legendItem, data) => {
            const dataset = data.datasets[0];
            const value = dataset.data[legendItem.index];
            return value > 0;
          },
        },
      },
    },
    maintainAspectRatio: false,
  });

  return (
    <section className='container mt-5'>
      <h1
        className='text-center mb-4'
        style={{ fontSize: '2rem', fontWeight: 'bold' }}
      >
        Ticket Status Distribution (%)
      </h1>

      <div className='mb-3 d-flex justify-content-center align-items-center'>
        <label
          htmlFor='month-select'
          className='form-label me-2 mb-0'
          aria-label='Select Month'
        >
          Select Month:
        </label>
        <select
          id='month-select'
          className='form-select w-auto'
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          aria-label='Month Selection'
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <div className='d-flex justify-content-center align-items-center'>
        {isLoading ? (
          <div className='d-flex align-items-center'>
            <div className='spinner-border text-primary me-2' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
            <span className='text-white'>Loading data...</span>
          </div>
        ) : statusCounts ? (
          totalTickets > 0 ? (
            <div style={{ width: '400px', height: '400px' }}>
              <Doughnut data={data} options={chartOptions(totalTickets)} />
            </div>
          ) : (
            <div className='alert alert-primary' role='alert'>
              No tickets available for the selected month.
            </div>
          )
        ) : (
          <div className='alert alert-danger' role='alert'>
            Error fetching data. Please try again later.
          </div>
        )}
      </div>

      {!isLoading && statusCounts && totalTickets > 0 && (
        <TicketStatusOverview
          statusCounts={statusCounts}
          selectedMonth={selectedMonth}
          colors={data.datasets[0].backgroundColor}
        />
      )}
    </section>
  );
};

export default TicketStatusGraph;

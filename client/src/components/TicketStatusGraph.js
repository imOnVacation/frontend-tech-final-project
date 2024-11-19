import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const TicketStatusOverview = ({ statusCounts, selectedMonth }) => {
  const navigate = useNavigate();

  return (
    <div className='d-flex flex-wrap justify-content-center my-4'>
      {['Open', 'WIP', 'Completed', 'Assigned', 'Cancelled'].map((status) => {
        const ticketCount = statusCounts?.[status] || 0;
        const isClickable = ticketCount > 0;

        return (
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
              <h5 className='card-title' style={{ fontWeight: 'bold' }}>
                {status}
              </h5>
              <p
                className='card-text'
                style={{
                  fontSize: '1.2rem',
                  color: isClickable ? 'DodgerBlue' : 'black',
                }}
              >
                {ticketCount} Tickets
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TicketStatusGraph = () => {
  const [statusCounts, setStatusCounts] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const response = await fetch(
          `/api/tickets/by-month?month=${selectedMonth}`
        );
        const data = await response.json();
        setStatusCounts(data);
      } catch (error) {
        console.error('Error fetching status counts:', error);
      }
    };

    fetchStatusCounts();
  }, [selectedMonth]);

  const totalTickets =
    (statusCounts?.Open || 0) +
    (statusCounts?.WIP || 0) +
    (statusCounts?.Completed || 0) +
    (statusCounts?.Assigned || 0) +
    (statusCounts?.Cancelled || 0);

  const calculatePercentages = (counts, total) => {
    return {
      Open: ((counts.Open || 0) / total) * 100,
      WIP: ((counts.WIP || 0) / total) * 100,
      Completed: ((counts.Completed || 0) / total) * 100,
      Assigned: ((counts.Assigned || 0) / total) * 100,
      Cancelled: ((counts.Cancelled || 0) / total) * 100,
    };
  };

  const percentages =
    totalTickets > 0 ? calculatePercentages(statusCounts, totalTickets) : null;

  const data = {
    labels: ['Open', 'WIP', 'Completed', 'Assigned', 'Cancelled'],
    datasets: [
      {
        data: [
          percentages?.Open || 0,
          percentages?.WIP || 0,
          percentages?.Completed || 0,
          percentages?.Assigned || 0,
          percentages?.Cancelled || 0,
        ],
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw.toFixed(2);
            return ` ${value}%`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <section className='container mt-5'>
      <h1
        className='text-center mb-4'
        style={{ fontSize: '2rem', fontWeight: 'bold' }}
      >
        Ticket Status Distribution (%)
      </h1>

      <div className='mb-3 d-flex justify-content-center align-items-center'>
        <label htmlFor='month-select' className='form-label me-2 mb-0'>
          Select Month:
        </label>
        <select
          id='month-select'
          className='form-select w-auto'
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <div className='d-flex justify-content-center align-items-center'>
        {statusCounts ? (
          totalTickets > 0 ? (
            <div style={{ width: '400px', height: '400px' }}>
              <Doughnut data={data} options={options} />
            </div>
          ) : (
            <div>No tickets available for the selected month.</div>
          )
        ) : (
          <div>Loading...</div>
        )}
      </div>

      {statusCounts && totalTickets > 0 && (
        <TicketStatusOverview
          statusCounts={statusCounts}
          selectedMonth={selectedMonth}
        />
      )}
    </section>
  );
};

export default TicketStatusGraph;

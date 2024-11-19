import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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
        backgroundColor: [
          '#ff6384',
          '#36a2eb',
          '#cc65fe',
          '#36a31b',
          '#cc15fe',
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
  };

  return (
    <div>
      <h1>Ticket Status Distribution (%)</h1>
      <div>
        <label htmlFor='month-select'>Select Month: </label>
        <select
          id='month-select'
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        {statusCounts ? (
          totalTickets > 0 ? (
            <Doughnut data={data} options={options} />
          ) : (
            <div>No tickets available for the selected month.</div>
          )
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default TicketStatusGraph;

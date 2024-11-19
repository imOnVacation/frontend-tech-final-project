import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

const TicketStatusGraph = () => {
  const [statusCounts, setStatusCounts] = useState(null);

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/tickets/status-counts'
        );
        const data = await response.json();
        setStatusCounts(data);
      } catch (error) {
        console.error('Error fetching status counts:', error);
      }
    };

    fetchStatusCounts();
  }, []);

  if (!statusCounts) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: ['Open', 'WIP', 'Completed'],
    datasets: [
      {
        data: [statusCounts.Open, statusCounts.WIP, statusCounts.Completed],
        backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
      },
    ],
  };

  return (
    <div>
      <h1>Overall Ticket Status</h1>
      <Pie data={chartData} />
    </div>
  );
};

export default TicketStatusGraph;

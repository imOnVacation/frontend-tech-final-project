import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const TicketsByStatusAndMonth = () => {
  const [searchParams] = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const month = searchParams.get('month');
  const status = searchParams.get('status');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `/api/tickets/list?month=${month}&status=${status}`
        );
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, [month, status]);

  return (
    <div className='container mt-5'>
      <h1 className='text-center mb-4'>
        Tickets for {status} in{' '}
        {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
      </h1>
      {tickets === null ? (
        <div>Loading...</div>
      ) : (
        <pre>{JSON.stringify(tickets, null, 2)}</pre>
      )}
    </div>
  );
};

export default TicketsByStatusAndMonth;

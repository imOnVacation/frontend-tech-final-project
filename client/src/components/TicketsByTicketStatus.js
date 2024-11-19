import React, { useEffect, useState } from 'react';

const TicketsByTicketStatus = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets');
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  return (
    <section className='contianer mt-5'>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <strong>{ticket.description}</strong> - {ticket.status}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TicketsByTicketStatus;

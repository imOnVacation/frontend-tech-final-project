import React, { useEffect, useState } from 'react';

const TicketStatusSummary = () => {
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
    <div>
      <h1>This is the TicketStatusSummary Componenet</h1>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <strong>{ticket.description}</strong> - {ticket.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TicketStatusSummary;

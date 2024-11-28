import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const TicketsByStatusAndMonth = () => {
  const [searchParams] = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const month = searchParams.get('month');
  const status = searchParams.get('status');
  const ticketsPerPage = 20;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `/api/tickets/list?month=${month}&status=${status}&page=${currentPage}&size=${ticketsPerPage}`
        );
        const data = await response.json();
        setTickets(data.tickets);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, [month, status, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className='container mt-5'>
      <h1 className='text-center mb-4'>
        Tickets for {status} in{' '}
        {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
      </h1>
      {tickets.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <div className='row'>
          {tickets.map((ticket, index) => (
            <div key={index} className='col-md-4 mb-4'>
              <div className='card h-100'>
                <div className='card-body'>
                  <h5 className='card-title'>Ticket ID: {ticket.id}</h5>
                  <p className='card-text'>
                    <strong>Description:</strong> {ticket.description}
                  </p>
                  <p className='card-text'>
                    <strong>Request Date:</strong>{' '}
                    {new Date(ticket.request_date).toLocaleDateString()}
                  </p>
                  <p className='card-text'>
                    <strong>Priority:</strong> {ticket.priority}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className='my-4 d-flex justify-content-center'>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`btn ${
              index + 1 === currentPage ? 'btn-primary' : 'btn-secondary'
            } mx-1`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TicketsByStatusAndMonth;

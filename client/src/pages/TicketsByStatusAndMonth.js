import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';

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
    <div className='pages-bg'>
      <div className='container mt-5'>
        <h1 className='text-center mb-4'>
          Tickets for {status} in{' '}
          {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
        </h1>
        {tickets.length === 0 ? (
          <div>Loading...</div>
        ) : (
          <div className='row'>
            {tickets.map((ticket) => (
              <div key={ticket.id} className='col-md-4 mb-4'>
                {ticket.isDeleting ? (
                  <div className='card hover-effect h-100 d-flex flex-column justify-content-center align-items-center'>
                    <TailSpin
                      height='50'
                      width='50'
                      color='red'
                      ariaLabel='tail-spin-loading'
                      visible={true}
                    />
                    <p className='mt-2'>Deleting...</p>
                  </div>
                ) : ticket.isDeleted ? (
                  <div className='card hover-effect h-100 d-flex flex-column justify-content-center align-items-center'>
                    <div className='alert alert-success text-center w-75 '>
                      <p>Deleted</p>
                    </div>
                  </div>
                ) : (
                  <div className='card hover-effect h-100 d-flex flex-column'>
                    <div className='card-body d-flex flex-column'>
                      <h5 className='card-title'>Ticket ID: {ticket.id}</h5>
                      <p className='card-text'>
                        <strong>Description: </strong>
                        {ticket.description}
                      </p>
                      <p className='card-text'>
                        <strong>Status:</strong> {ticket.status}
                      </p>
                      <p className='card-text'>
                        <strong>Location:</strong> {ticket.location}
                      </p>
                      <p className='card-text'>
                        <strong>Request Date:</strong> {ticket.request_date}
                      </p>
                      <p className='card-text'>
                        <strong>Shop:</strong> {ticket.shop}
                      </p>
                      <p className='card-text'>
                        <strong>Priority:</strong> {ticket.priority}
                      </p>
                    </div>
                  </div>
                )}
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
    </div>
  );
};

export default TicketsByStatusAndMonth;

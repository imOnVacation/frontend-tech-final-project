import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import '../style.css';

const backendUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://ticketify-server.vercel.app'
    : 'http://localhost:5000';

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError('Please enter a valid keyword');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(false);
    setDeleteSuccess('');

    try {
      const response = await fetch(
        `${backendUrl}/api/searchkey/by-keyword?keyword=${keyword}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      setTickets(data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleDelete = async (ticketId) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, isDeleting: true } : ticket
      )
    );

    try {
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(
        `${backendUrl}/api/searchkey/ticket/${ticketId}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, isDeleting: false, isDeleted: true }
            : ticket
        )
      );

      setTimeout(() => {
        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket.id !== ticketId)
        );
        setDeleteSuccess(
          <span style={{ fontWeight: 'bold' }}>
            Ticket {ticketId} Deleted successfully
          </span>
        );

        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          setDeleteSuccess('');
        }, 4000);
      }, 2000);
    } catch (error) {
      setError(`Error deleting ticket: ${error.message}`);
    }
  };

  const handleEdit = (ticket) => {
    navigate(`/TicketEdit/${ticket.id}`, { state: { ticket } });
  };

  const highlightKeyword = (text, keyword) => {
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #2C3E50, #4169E1)',
        minHeight: '100vh',
        color: 'white',
        padding: '20px',
      }}
    >
      <div className='container mt-5'>
        <h1 className='text-center mb-4'>Search Tickets by Keyword</h1>
        <div className='mb-4 text-center'>
          <input
            type='text'
            id='search-tickets'
            className='form-control w-25 mx-auto'
            placeholder='Enter keyword'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <label for='search-tickets' className='visually-hidden'>
            Search
          </label>
          <button className='btn btn-primary mt-3' onClick={handleSearch}>
            Search
          </button>
        </div>

        {deleteSuccess && (
          <div
            className='alert alert-success text-center'
            style={{
              maxWidth: '800px',
              margin: '10px auto',
              fontSize: '16px',
              padding: '15px',
            }}
          >
            {deleteSuccess}
          </div>
        )}

        {loading ? (
          <div className='d-flex justify-content-center align-items-center'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div
            className='alert alert-danger text-center'
            style={{
              maxWidth: '800px',
              margin: '5px auto',
              fontSize: '16px',
              padding: '10px',
            }}
          >
            {error}
          </div>
        ) : searched && tickets.length === 0 ? (
          <div
            className='alert alert-danger text-center'
            style={{
              maxWidth: '800px',
              margin: '5px auto',
              fontSize: '16px',
              padding: '10px',
            }}
          >
            <strong>No tickets found for the keyword "{keyword}"</strong>
          </div>
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
                    <p className='mt-2'>
                      <strong>Deleting...</strong>
                    </p>
                  </div>
                ) : ticket.isDeleted ? (
                  <div className='card hover-effect h-100 d-flex flex-column justify-content-center align-items-center'>
                    <div>
                      <p className='mt-2'>
                        <strong>Deleted!!!</strong>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className='card hover-effect h-100 d-flex flex-column'>
                    <div className='card-body d-flex flex-column'>
                      <h5 className='card-title'>Ticket ID: {ticket.id}</h5>
                      <p className='card-text'>
                        <strong>Description:</strong>{' '}
                        {highlightKeyword(ticket.description, keyword)}
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
                      <div className='mt-auto'>
                        <button
                          className='btn btn-secondary btn-sm me-2'
                          onClick={() => handleEdit(ticket)}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </button>
                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => handleDelete(ticket.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

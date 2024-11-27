import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError("Please enter a valid keyword");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(false);
    setDeleteSuccess("");

    try {
      const response = await fetch(
        `/api/searchkey/by-keyword?keyword=${keyword}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch(`/api/searchkey/ticket/${ticketId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete ticket");
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
        setDeleteSuccess(`Ticket ${ticketId} deleted successfully`);
      }, 1000);
    } catch (error) {
      setError(`Error deleting ticket: ${error.message}`);
    }
  };

  const handleEdit = (ticket) => {
    navigate(`/TicketEdit/${ticket.id}`, { state: { ticket } });
  };

  const highlightKeyword = (text, keyword) => {
    const parts = text.split(new RegExp(`(${keyword})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Search Tickets by Keyword</h1>

      <div className="mb-4 text-center">
        <input
          type="text"
          className="form-control w-25 mx-auto"
          placeholder="Enter keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="btn btn-primary mt-3" onClick={handleSearch}>
          Search
        </button>
      </div>

      {deleteSuccess && (
        <div className="alert alert-success text-center">{deleteSuccess}</div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : searched && tickets.length === 0 ? (
        <div className="alert alert-danger text-center">
          No tickets found for the keyword "{keyword}"
        </div>
      ) : (
        <div className="row">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="col-md-4 mb-4">
              {ticket.isDeleting ? (
                <div className="card h-100 d-flex flex-column justify-content-center align-items-center">
                  <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Deleting...</span>
                  </div>
                  <p className="mt-2">Deleting...</p>
                </div>
              ) : ticket.isDeleted ? (
                <div className="card h-100 d-flex flex-column justify-content-center align-items-center">
                  <p className="text-success">
                    <strong>Deleted!!</strong>
                  </p>
                </div>
              ) : (
                <div className="card h-100 d-flex flex-column">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">Ticket ID: {ticket.id}</h5>
                    <p className="card-text">
                      <strong>Description:</strong>{" "}
                      {highlightKeyword(ticket.description, keyword)}
                    </p>
                    <p className="card-text">
                      <strong>Status:</strong> {ticket.status}
                    </p>
                    <p className="card-text">
                      <strong>Location:</strong> {ticket.location}
                    </p>
                    <p className="card-text">
                      <strong>Request Date:</strong> {ticket.request_date}
                    </p>
                    <p className="card-text">
                      <strong>Shop:</strong> {ticket.shop}
                    </p>
                    <p className="card-text">
                      <strong>Priority:</strong> {ticket.priority}
                    </p>
                    <div className="mt-auto">
                      <button
                        className="btn btn-secondary me-2"
                        onClick={() => handleEdit(ticket)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(ticket.id)}
                      >
                        Delete
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
  );
};

export default Search;

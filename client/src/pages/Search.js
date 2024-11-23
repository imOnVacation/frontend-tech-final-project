import React, { useState } from "react";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!keyword) return;

    setLoading(true);
    setError(null);
    setSearched(false);

    try {
      const response = await fetch(
        `/api/searchkey/by-keyword?keyword=${keyword}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Search Tickets by Keyword</h1>

      {/* Search Input */}
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

      {/* Loading and Error Handling */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error && keyword ? (
        <div
          className="alert alert-danger text-center"
          style={{
            padding: "10px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {error}
        </div>
      ) : searched && tickets.length === 0 ? (
        <div
          className="alert alert-danger text-center"
          style={{
            padding: "10px",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          No tickets found for the keyword "{keyword}"
        </div>
      ) : (
        <div className="row">
          {tickets.map((ticket, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Ticket ID: {ticket.id}</h5>
                  <p className="card-text">
                    <strong>Description:</strong> {ticket.description}
                  </p>
                  <p className="card-text">
                    <strong>Request Date:</strong>{" "}
                    {new Date(ticket.request_date).toLocaleDateString()}
                  </p>
                  <p className="card-text">
                    <strong>Priority:</strong> {ticket.priority}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;

import React, { useState } from "react";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!keyword) return;

    setLoading(true);
    setError(null);

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
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Search Tickets by Keyword</h1>

      {/* Search keyword*/}
      <div className="mb-4 text-center">
        <input
          type="text"
          className="form-control w-50 mx-auto"
          placeholder="Enter keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : tickets.length === 0 ? (
        <div>No tickets found for the keyword "{keyword}".</div>
      ) : (
        <div>
          <ul className="list-group">
            {tickets.map((ticket, index) => (
              <li key={index} className="list-group-item">
                <strong>Ticket ID:</strong> {ticket.ticket_id} <br />
                <strong>Description:</strong> {ticket.description} <br />
                <strong>Request Date:</strong>{" "}
                {new Date(ticket.request_date).toLocaleDateString()} <br />
                <strong>Priority:</strong> {ticket.priority}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;

import React, { useState } from "react";

const WorkOrderForm = () => {
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [request_date, setRequestDate] = useState("");
  const [shop, setShop] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    const formData = {
      id,
      description,
      status,
      location,
      request_date,
      shop,
      priority,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/tickets/submit-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }

      setSuccess(data.message);

      resetForm();
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  // Handle form reset
  const resetForm = () => {
    setId("");
    setDescription("");
    setStatus("");
    setLocation("");
    setRequestDate("");
    setShop("");
    setPriority("");
  };

  return (
    <div className="container w-50">
      <h2 className="my-4 text-center">Create Work Order</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="id" className="form-label fw-bold">
            ID <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control "
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-bold">
            Description <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label fw-bold">
            Status <span className="text-danger">*</span>
          </label>
          <select
            className="form-control"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="Completed">Completed</option>
            <option value="Assigned">Assigned</option>
            <option value="Open">Open</option>
            <option value="Cancelled">Cancelled</option>
            <option value="WIP">WIP</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="form-label fw-bold">
            Location <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="request_date" className="form-label fw-bold">
            Request Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className="form-control"
            id="request_date"
            value={request_date}
            onChange={(e) => setRequestDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="shop" className="form-label fw-bold">
            Shop <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="shop"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="priority" className="form-label fw-bold">
            Priority <span className="text-danger">*</span>
          </label>
          <select
            className="form-control"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="Routine">Routine</option>
          </select>
        </div>

        <div className="row">
          <div className="col">
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </div>
          <div className="col">
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={resetForm}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WorkOrderForm;

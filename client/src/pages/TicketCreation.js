import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

const TicketForm = () => {
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [request_date, setRequestDate] = useState("");
  const [shop, setShop] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Function to generate Ticket ID in the format '26-xxxxx'
  const generateTicketId = () => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `26-${randomDigits}`;
  };

  // Generate an ID when the form loads
  useEffect(() => {
    setId(generateTicketId());
  }, []);

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
      const response = await fetch("api/searchkey/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }

      setSuccess(data.message);
      setSubmittedData(formData);

      setTimeout(() => {
        setShowModal(true);
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const resetForm = () => {
    setDescription("");
    setStatus("");
    setLocation("");
    setRequestDate("");
    setShop("");
    setPriority("");
    setError(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSuccess(null);
    // Regenerate ticket ID when the modal closes
    setId(generateTicketId());
    resetForm();
  };

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #2C3E50, #4169E1)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        className="container w-50 p-4"
        style={{
          background: "rgba(44, 62, 80, 0.2)",
          borderRadius: "10px",
          color: "#D3D3D3",
        }}
      >
        <h1 className="my-2 text-center">Create New Ticket</h1>

        {error && (
          <div className="alert alert-danger d-flex justify-content-center align-items-center">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success d-flex justify-content-center align-items-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="id" className="form-label fw-bold">
              ID <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              style={{
                backgroundColor: "#B0C4DE",
              }}
              id="id"
              value={id}
              readOnly
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label fw-bold">
              Description <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              style={{
                backgroundColor: "#B0C4DE",
              }}
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
              className="form-select"
              style={{
                backgroundColor: "#B0C4DE",
              }}
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Choose Status Option</option>
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
              style={{
                backgroundColor: "#B0C4DE",
              }}
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
              style={{
                backgroundColor: "#B0C4DE",
              }}
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
              style={{
                backgroundColor: "#B0C4DE",
              }}
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
              className="form-select"
              style={{
                backgroundColor: "#B0C4DE",
              }}
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="">Choose Priority Option</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="Routine">Routine</option>
            </select>
          </div>

          <div className="row">
            <div className="col">
              <button type="submit" className="btn btn-primary mt-2 w-100">
                Submit
              </button>
            </div>
            <div className="col">
              <button
                type="button"
                className="btn btn-secondary mt-2 w-100"
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
          </div>
        </form>

        {submittedData && (
          <Modal
            show={showModal}
            onHide={handleModalClose}
            centered
            style={{
              background: "linear-gradient(90deg, #2C3E50, #4169E1)",
              color: "#D3D3D3",
              borderRadius: "10px",
            }}
          >
            <Modal.Header
              closeButton={false}
              style={{
                background: "linear-gradient(90deg, #2C3E50, #4169E1)",
                color: "#D3D3D3",
              }}
            >
              <Modal.Title>Ticket Details</Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{
                background: "linear-gradient(90deg, #2C3E50, #4169E1)",
                color: "#D3D3D3",
              }}
            >
              <ul>
                <li>
                  <strong>Ticket ID - </strong> {submittedData.id}
                </li>
                <li>
                  <strong>Description - </strong> {submittedData.description}
                </li>
                <li>
                  <strong>Status - </strong> {submittedData.status}
                </li>
                <li>
                  <strong>Location - </strong> {submittedData.location}
                </li>
                <li>
                  <strong>Request Date - </strong> {submittedData.request_date}
                </li>
                <li>
                  <strong>Shop - </strong> {submittedData.shop}
                </li>
                <li>
                  <strong>Priority - </strong> {submittedData.priority}
                </li>
              </ul>
            </Modal.Body>
            <Modal.Footer
              style={{
                background: "linear-gradient(90deg, #2C3E50, #4169E1)",
                color: "#D3D3D3",
              }}
            >
              <button className="btn btn-secondary" onClick={handleModalClose}>
                Close
              </button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default TicketForm;

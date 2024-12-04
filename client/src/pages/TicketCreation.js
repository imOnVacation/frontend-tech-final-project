import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";

const backendUrl =
  process.env.NODE_ENV === "production"
    ? "https://ticketify-server.vercel.app"
    : "http://localhost:5000";

const TicketForm = () => {
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [request_date, setRequestDate] = useState("");
  const [shop, setShop] = useState("");
  const [shops, setShops] = useState([]);
  const [priority, setPriority] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Ref for the close button
  const closeButtonRef = useRef(null);

  // Function to generate Ticket ID in the format '26-xxxxx'
  const generateTicketId = () => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `26-${randomDigits}`;
  };

  // Generate an ID when the form loads
  useEffect(() => {
    setId(generateTicketId());
  }, []);

  // Fetch shops
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/shops`);
        const data = await response.json();
        setShops(data);
      } catch (err) {
        console.error("Error fetching shops:", err);
      }
    };
    fetchShops();
  }, []);

  // Focus the close button when the modal opens
  useEffect(() => {
    if (showModal && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [showModal]);

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
      const response = await fetch(`${backendUrl}/api/searchkey/submit-form`, {
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

      setSuccess(
        <span style={{ fontWeight: "bold" }}>
          Ticket Submitted Successfully!!
        </span>
      );
      setSubmittedData(formData);
      // Display Modal
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
          <div
            className="alert alert-danger d-flex justify-content-center align-items-center"
            role="alert"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="alert alert-success d-flex justify-content-center align-items-center"
            role="alert"
          >
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
              aria-label="Select Ticket Status from the Dropdown"
            >
              <option value="" disabled>
                Choose Status Option
              </option>
              <option value="Open">Open</option>
              <option value="WIP">WIP</option>
              <option value="Completed">Completed</option>
              <option value="Assigned">Assigned</option>
              <option value="Cancelled">Cancelled</option>
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
            <select
              className="form-select"
              style={{
                backgroundColor: "#B0C4DE",
              }}
              id="shop"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
              required
              aria-label="Select the Shop from the Dropdown"
            >
              <option value="" disabled>
                Choose Shop Option
              </option>

              {shops.map((shopItem, index) => (
                <option key={index} value={shopItem.shop}>
                  {shopItem.shop}
                </option>
              ))}
            </select>
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
              aria-label="Select the Priority from the Dropdown"
            >
              <option value="" disabled>
                Choose Priority Option
              </option>
              <option value="Low">Low</option>
              <option value="Routine">Routine</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="row">
            <div className="col">
              <button
                type="submit"
                className="btn btn-primary mt-2 w-100"
                aria-label="Submit form"
              >
                Submit
              </button>
            </div>
            <div className="col">
              <button
                type="button"
                className="btn btn-secondary mt-2 w-100"
                onClick={resetForm}
                aria-label="Reset form"
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
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            centered
            style={{
              background: "linear-gradient(90deg, #2C3E50, #4169E1)",
              color: "#D3D3D3",
              borderRadius: "10px",
            }}
          >
            <Modal.Header>
              <Modal.Title id="modal-title">Ticket Details</Modal.Title>
            </Modal.Header>
            <Modal.Body
              id="modal-description"
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
              <button
                ref={closeButtonRef}
                className="btn btn-secondary"
                onClick={handleModalClose}
                aria-label="Close modal"
              >
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

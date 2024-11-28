import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TicketEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve ticket details from the location's state
  const ticket = location.state?.ticket;

  // Form state
  const [formData, setFormData] = useState({
    id: ticket?.id || "",
    description: ticket?.description || "",
    status: ticket?.status || "",
    location: ticket?.location || "",
    request_date: ticket?.request_date || "",
    shop: ticket?.shop || "",
    priority: ticket?.priority || "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Function to check if any changes have been made to the form
    const isModified = Object.keys(formData).some(
      (key) => formData[key] !== ticket[key]
    );

    if (!isModified) {
      setMessage({
        type: "info",
        text: "No Changes Made",
      });
      setTimeout(() => navigate("/search"), 1000);
      return;
    }

    try {
      const response = await fetch(`/api/searchkey/ticket/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update the ticket");
      }

      setMessage({ type: "success", text: "Ticket Updated Successfully!" });
      setTimeout(() => navigate("/search"), 5000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update the ticket. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setTimeout(() => navigate("/search"), 1000);
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
        className="container p-4"
        style={{
          background: "rgba(44, 62, 80, 0.2)",
          borderRadius: "10px",
          color: "#D3D3D3",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          width: "60%",
        }}
      >
        <h1 className="my-2 text-center">Edit Ticket</h1>

        {message.text && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-danger"
            } text-center`}
            style={{
              maxWidth: "600px",
              margin: "5px auto",
              fontSize: "16px",
              padding: "5px",
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold" htmlFor="ticket-id">
              Ticket ID <span className="text-danger">*</span>
            </label>
            <input
              id="ticket-id"
              type="text"
              className="form-control"
              value={formData.id}
              disabled
              style={{
                backgroundColor: "#B0C4DE",
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" htmlFor="ticket-description">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              id="ticket-description"
              value={formData.description}
              onChange={handleInputChange}
              required
              style={{
                backgroundColor: "#B0C4DE",
              }}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" htmlFor="ticket-status">
              Status <span className="text-danger">*</span>
            </label>
            <select
              type="text"
              className="form-control"
              id="ticket-status"
              value={formData.status}
              onChange={handleInputChange}
              required
              style={{
                backgroundColor: "#B0C4DE",
              }}
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
            <label className="form-label fw-bold" htmlFor="location">
              Location <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              style={{
                backgroundColor: "#B0C4DE",
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" htmlFor="request_date">
              Request Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className="form-control"
              id="request_date"
              value={formData.request_date}
              onChange={handleInputChange}
              required
              style={{
                backgroundColor: "#B0C4DE",
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" htmlFor="shop">
              Shop <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="shop"
              value={formData.shop}
              onChange={handleInputChange}
              required
              style={{
                backgroundColor: "#B0C4DE",
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" htmlFor="priority">
              Priority <span className="text-danger">*</span>
            </label>
            <select
              className="form-control"
              id="priority"
              value={formData.priority}
              onChange={handleInputChange}
              required
              style={{
                backgroundColor: "#B0C4DE",
              }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="row mt-5">
            <div className="col">
              <button type="submit" className="btn btn-primary mt-2 w-100">
                Submit
              </button>
            </div>
          </div>
        </form>

        <div className="row">
          <div className="col d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-danger mt-2 w-100"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketEdit;

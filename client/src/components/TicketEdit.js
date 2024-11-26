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

      setMessage({ type: "success", text: "Ticket updated successfully!" });
      setTimeout(() => navigate("/"), 5000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update the ticket. Please try again.",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      id: ticket?.id || "",
      description: ticket?.description || "",
      status: ticket?.status || "",
      location: ticket?.location || "",
      request_date: ticket?.request_date || "",
      shop: ticket?.shop || "",
      priority: ticket?.priority || "",
    });
  };

  const handleCancel = () => {
    navigate("/search");
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Edit Ticket</h1>

      {message.text && (
        <div
          className={`alert ${
            message.type === "success" ? "alert-success" : "alert-danger"
          } text-center`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold">
            Ticket ID <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            value={formData.id}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">
            Description <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label fw-bold">
            Status <span className="text-danger">*</span>
          </label>
          <select
            type="text"
            className="form-control"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
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
          <label className="form-label fw-bold">
            Location <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">
            Request Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className="form-control"
            name="request_date"
            value={formData.request_date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">
            Shop <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="shop"
            value={formData.shop}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">
            Priority <span className="text-danger">*</span>
          </label>
          <select
            className="form-control"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn btn-danger me-2"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default TicketEdit;

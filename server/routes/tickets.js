const express = require("express");
const fetchTickets = require("../api/fetchTickets.js");
const supabase = require("../supabaseClient");
const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const { month, status } = req.query;

    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        error: "Invalid month. Please provide a value between 1 and 12.",
      });
    }

    const tickets = await fetchTickets();
    if (!tickets) {
      return res.status(500).json({ error: "Failed to fetch tickets" });
    }

    const filteredTickets = tickets.filter((ticket) => {
      const ticketDate = new Date(ticket.request_date);
      return (
        ticketDate.getMonth() + 1 === parseInt(month) &&
        ticket.status === status
      );
    });

    res.status(200).json(filteredTickets);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/by-month", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        error: "Invalid month. Please provide a value between 1 and 12.",
      });
    }

    const tickets = await fetchTickets();
    if (!tickets) {
      return res.status(500).json({ error: "Failed to fetch tickets" });
    }

    const filteredTickets = tickets.filter((ticket) => {
      const ticketDate = new Date(ticket.request_date);
      return ticketDate.getMonth() + 1 === parseInt(month);
    });

    const statusCounts = {
      Open: 0,
      WIP: 0,
      Completed: 0,
      Assigned: 0,
      Cancelled: 0,
    };

    filteredTickets.forEach((ticket) => {
      if (statusCounts[ticket.status] !== undefined) {
        statusCounts[ticket.status]++;
      }
    });

    res.status(200).json(statusCounts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const tickets = await fetchTickets();

    if (!tickets) {
      return res.status(500).json({ error: "Failed to fetch tickets" });
    }
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/submit-form", async (req, res) => {
  const { id, description, status, location, request_date, shop, priority } =
    req.body;

  try {
    const { data, error } = await supabase.from("ticket_info").insert([
      {
        id: id,
        description: description,
        status: status,
        location: location,
        request_date: request_date,
        shop: shop,
        priority: priority,
      },
    ]);

    if (error) {
      throw error;
    }

    res
      .status(200)
      .json({ message: "Ticket created successfully", data: data });
  } catch (error) {
    console.error("Error inserting ticket:", error.message);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

module.exports = router;

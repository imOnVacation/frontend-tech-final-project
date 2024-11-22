const express = require("express");
const fetchTickets = require("../api/fetchTickets.js");

const router = express.Router();

router.get("/by-keyword", async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({
        error: "Please provide a valid keyword.",
      });
    }

    const tickets = await fetchTickets();
    if (!tickets) {
      return res.status(500).json({ error: "Failed to fetch tickets" });
    }

    const filteredTickets = tickets.filter((ticket) =>
      ticket.description.toLowerCase().includes(keyword.toLowerCase())
    );

    res.status(200).json(filteredTickets);
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

module.exports = router;

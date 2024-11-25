const express = require("express");
const fetchTickets = require("../api/fetchTickets.js");
const supabase = require("../supabaseClient");
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

// Delete ticket by ID
router.delete("/ticket/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from("ticket_info").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: "Failed to delete ticket" });
    }

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

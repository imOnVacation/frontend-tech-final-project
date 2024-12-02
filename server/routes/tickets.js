const express = require('express');
const fetchTickets = require('../api/fetchTickets.js');
const router = express.Router();

router.get('/by-shop', async (req, res) => {
  try {
    const { shop } = req.query;
    if (!shop) {
      return res.status(400).json({
        error: 'Missing required query parameter: shop',
      });
    }

    const tickets = await fetchTickets();
    if (!tickets) {
      return res.status(500).json({ error: 'Failed to fetch tickets' });
    }

    const filteredTickets = tickets.filter((ticket) => ticket.shop === shop);

    // Group tickets by month and count them
    const monthlyCounts = Array(12).fill(0);
    filteredTickets.forEach((ticket) => {
      const ticketDate = new Date(ticket.request_date + 'T00:00:00Z');
      const monthIndex = ticketDate.getUTCMonth();
      monthlyCounts[monthIndex]++;
    });

    res.status(200).json({
      labels: Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString('default', { month: 'long' })
      ),
      data: monthlyCounts,
    });
  } catch (error) {
    console.error('Error in /by-shop route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/list', async (req, res) => {
  try {
    const { month, status, page = 1, size = 20 } = req.query;

    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        error: 'Invalid month. Please provide a value between 1 and 12.',
      });
    }

    if (!status) {
      return res.status(400).json({
        error: 'Status is required.',
      });
    }

    const tickets = await fetchTickets();
    if (!tickets) {
      return res.status(500).json({ error: 'Failed to fetch tickets' });
    }

    const filteredTickets = tickets.filter((ticket) => {
      const ticketDate = new Date(ticket.request_date + 'T00:00:00Z');
      const ticketMonth = ticketDate.getUTCMonth() + 1;
      return ticketMonth === parseInt(month) && ticket.status === status;
    });

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + parseInt(size);
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

    res.status(200).json({
      tickets: paginatedTickets,
      totalPages: Math.ceil(filteredTickets.length / size),
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/by-month', async (req, res) => {
  try {
    const { month } = req.query;

    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({
        error: 'Invalid month. Please provide a value between 1 and 12.',
      });
    }

    const tickets = await fetchTickets();
    if (!tickets) {
      return res.status(500).json({ error: 'Failed to fetch tickets' });
    }

    const filteredTickets = tickets.filter((ticket) => {
      const ticketDate = new Date(ticket.request_date + 'T00:00:00Z');
      const ticketMonth = ticketDate.getUTCMonth() + 1;
      return ticketMonth === parseInt(month);
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const tickets = await fetchTickets();

    if (!tickets) {
      return res.status(500).json({ error: 'Failed to fetch tickets' });
    }
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

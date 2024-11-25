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
      const ticketDate = new Date(ticket.request_date);
      const monthIndex = ticketDate.getMonth();
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
    const { month, status } = req.query;

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
      const ticketDate = new Date(ticket.request_date);
      return (
        ticketDate.getMonth() + 1 === parseInt(month) &&
        ticket.status === status
      );
    });

    res.status(200).json(filteredTickets);
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
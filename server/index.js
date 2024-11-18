const express = require('express');
const fetchTickets = require('./api/fetchTickets.js');

const app = express();

app.get('/api/tickets', async (req, res) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

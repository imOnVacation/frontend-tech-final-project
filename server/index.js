const express = require('express');
const ticketRoutes = require('./routes/tickets');
const shopsRoutes = require('./routes/shops');

const app = express();

app.use('/api/tickets', ticketRoutes);
app.use('/api/shops', shopsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

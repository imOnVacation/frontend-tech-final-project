const express = require("express");
const cors = require("cors");
const ticketRoutes = require("./routes/tickets");
const searchroutes = require("./routes/searchkey");
const shopsRoutes = require('./routes/shops');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/tickets", ticketRoutes);
app.use("/api/searchkey", searchroutes);
app.use('/api/shops', shopsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

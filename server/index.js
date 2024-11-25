const express = require("express");
const cors = require("cors");
const ticketRoutes = require("./routes/tickets");
const searchroutes = require("./routes/searchkey");
const app = express();

app.use("/api/tickets", ticketRoutes);
app.use("/api/searchkey", searchroutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

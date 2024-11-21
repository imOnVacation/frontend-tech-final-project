const express = require("express");
const ticketRoutes = require("./routes/searchkey");

const app = express();

app.use("/api/searchkey", ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

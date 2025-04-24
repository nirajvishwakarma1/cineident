const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const app = express();
const userRoutes = require("./routes/user.routes");

app.use(express.json());

app.use("/", userRoutes);

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));

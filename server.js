require("dotenv").config();

const express = require("express");
const app = express();
const routes = require("./routes");
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);

app.use((req, res, next) => {
  return res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`app running on http://localhost:${PORT}`);
});

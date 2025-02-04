const express = require("express");
const config = require("./config/index");
const database = require("./database/index");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "OK" });
});

database.authenticate()
  .then(async () => {
    console.log("Database connection established successfully.");
    await database.sync();
    console.log("Database synced successfully.");
    
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

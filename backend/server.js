const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

const resultsFilePath = path.join(__dirname, "results.json");

app.post("/save-selections", (req, res) => {
  const { selections } = req.body;

  if (!selections || !Array.isArray(selections)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    let existingData = [];
    if (fs.existsSync(resultsFilePath)) {
      existingData = JSON.parse(fs.readFileSync(resultsFilePath, "utf-8"));
    }

    const updatedData = [...existingData, ...selections];
    fs.writeFileSync(resultsFilePath, JSON.stringify(updatedData, null, 2));

    res.json({ message: "Selections saved successfully!" });
  } catch (error) {
    console.error("Error saving selections:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/get-selections", (req, res) => {
  if (!fs.existsSync(resultsFilePath)) {
    return res.json([]);
  }

  try {
    const savedData = JSON.parse(fs.readFileSync(resultsFilePath, "utf-8"));
    res.json(savedData);
  } catch (error) {
    console.error("Error reading selections:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

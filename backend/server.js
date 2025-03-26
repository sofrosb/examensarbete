const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());
app.use(
  "/assets/images",
  express.static(path.join(__dirname, "public", "assets", "images"))
);

// Path to images directory
const imagesDir = path.join(__dirname, "public", "assets", "images");
const resultsFilePath = path.join(__dirname, "results.json");

// Endpoint to save selected images
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

// Endpoint to retrieve previously saved selections
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

// Endpoint to retrieve all folders under /assets/images
app.get("/api/folders", (req, res) => {
  fs.readdir(imagesDir, { withFileTypes: true }, (err, items) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Filter to get only directories (folders)
    const folders = items
      .filter((item) => item.isDirectory())
      .map((item) => item.name);

    res.json(folders);
  });
});

// Endpoint to retrieve all images from a specific folder
app.get("/api/folder/:folder", (req, res) => {
  const folderPath = path.join(imagesDir, req.params.folder);

  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ message: "Folder not found" });
  }

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Create a list of images in the folder
    const images = files.map((file) => ({
      name: file,
      url: `/assets/images/${encodeURIComponent(
        req.params.folder
      )}/${encodeURIComponent(file)}`,
    }));

    res.json(images);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

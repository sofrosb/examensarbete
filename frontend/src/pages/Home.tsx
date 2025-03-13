import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Checkbox,
  Box,
  Drawer,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  FolderOpen,
} from "@mui/icons-material";

interface FileInfo {
  name: string;
  url: string;
}

interface DirectoryInfo {
  name: string;
}

export default function ImageVerifier() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [directories, setDirectories] = useState<DirectoryInfo[]>([]);
  const [selectedDirectory, setSelectedDirectory] = useState<string>("");
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setOpen(open);
  };

  // Get images
  function fetchImages(): void {
    axios
      .get("https://picsum.photos/v2/list?page=1&limit=25")
      .then((response) => {
        console.log("Fetched images:", response.data);
        setFiles(
          response.data.map((img: any) => ({
            name: img.id,
            url: img.download_url,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }

  // Get selected images
  function fetchSelections(): void {
    axios
      .get<string[]>("http://localhost:3001/get-selections")
      .then((response) => {
        setSelectedFiles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching selections:", error);
      });
  }

  useEffect(() => {
    fetchImages();
    fetchSelections();
  }, []);

  useEffect(() => {
    axios
      .get<string[]>("http://localhost:3001/directories")
      .then((response) => {
        const directoryInfos: DirectoryInfo[] = response.data.map(
          (directoryName) => ({
            name: directoryName,
          })
        );
        setDirectories(directoryInfos);
      })
      .catch((error) => {
        console.error("Error fetching directories:", error);
      });
  }, []);

  // Handle folder change
  function handleDirectoryChange(directory: string): void {
    setSelectedDirectory(directory);
    axios
      .get<string[]>(`http://localhost:3001/files/${directory}`)
      .then((response) => {
        setFiles(
          response.data.map((fileName) => ({
            name: fileName,
            url: `http://localhost:3001/uploads/${directory}/${fileName}`,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }

  // Handle image selection
  function handleFileSelect(fileName: string): void {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.includes(fileName)
        ? prevSelectedFiles.filter((file) => file !== fileName)
        : [...prevSelectedFiles, fileName]
    );
  }

  // Send selected images
  function handleSend(): void {
    axios
      .post("http://localhost:3001/save-selections", {
        selections: selectedFiles,
      })
      .then(() => {
        console.log("Selected files saved.");
      })
      .catch((error) => {
        console.error("Error saving selected files:", error);
      });
  }

  return (
    <Box display="flex" width="100%" height="100vh">
      {/* <IconButton
        color="inherit"
        edge="start"
        onClick={() => toggleDrawer(true)}
        sx={{ marginLeft: "10px", alignSelf: "flex-start", margin: "5px" }}
      >
        <FolderOpen />
      </IconButton> */}

      {/* Folder menu */}
      {/* <Drawer anchor="left" open={open} onClose={() => toggleDrawer(false)}> */}
      <Box
        sx={{
          width: "250px",
          backgroundColor: "#f5f5f5",
          padding: "10px",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            Choose folder
          </Typography>

          {/* Close button */}
          <IconButton
            color="inherit"
            onClick={() => toggleDrawer(false)}
            sx={{ marginBottom: "15px", padding: "5px" }}
          >
            {/* <CloseIcon /> */}
          </IconButton>
        </Box>

        {directories.map((directory) => (
          <Button
            key={directory.name}
            fullWidth
            variant="text"
            sx={{ marginBottom: "5px" }}
            onClick={() => handleDirectoryChange(directory.name)}
          >
            {directory.name}
          </Button>
        ))}
      </Box>
      {/* </Drawer> */}

      {/* Image section */}
      <Box
        width="100%"
        padding="10px"
        sx={{
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          {selectedDirectory ? `Images in "${selectedDirectory}"` : "Images"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            maxWidth: "1400px",
          }}
        >
          {files.map((file) => (
            <Box key={file.name} position="relative">
              <img
                src={file.url}
                alt={file.name}
                style={{
                  width: "300px",
                  height: "auto",
                  borderRadius: "5px",
                  maxHeight: "250px",
                }}
              />
              <Checkbox
                checked={selectedFiles.includes(file.name)}
                onChange={() => handleFileSelect(file.name)}
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              />
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            marginTop: "20px",
            maxWidth: "1400px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSend}
            sx={{ alignSelf: "flex-end" }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

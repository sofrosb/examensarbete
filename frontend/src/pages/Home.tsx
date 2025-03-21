import { useState, useEffect } from "react";
import axios from "axios";
import ToastService from "../utils/toastify";
import { Button, Checkbox, Box, Typography } from "@mui/material";

interface FileInfo {
  name: string;
  url: string;
}

export default function ImageVerifier() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Get images
  function fetchImages(): void {
    axios
      .get("https://picsum.photos/v2/list?page=1&limit=28")
      .then((response) => {
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
      .then(() => {})
      .catch((error) => {
        console.error("Error fetching selections:", error);
      });
  }

  useEffect(() => {
    fetchSelections();
    fetchImages();
  }, []);

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
        ToastService.success(
          selectedFiles && selectedFiles.length > 1
            ? "Images sent"
            : "Image sent"
        );
        setSelectedFiles([]);
      })
      .catch((error) => {
        ToastService.error("Could not send images.");
        console.error("Error saving selected files:", error);
      });
  }

  return (
    <Box display="flex" width="100%" height="100vh">
      <Box
        width="100%"
        padding="10px"
        sx={{
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          {" "}
          Images
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
            maxWidth: "1245px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSend}
            sx={{ alignSelf: "flex-end", marginLeft: "auto" }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

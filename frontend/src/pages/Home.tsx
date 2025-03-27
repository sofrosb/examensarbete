import { useState, useEffect } from "react";
import axios from "axios";
import ToastService from "../utils/toastify";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { Close as CloseIcon, FolderOpen } from "@mui/icons-material";

interface FileInfo {
  name: string;
  url: string;
}

export default function ImageVerifier() {
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  // Generate a URL for an image based on folder and image name
  function getImageUrl(folder: string, imageName: string) {
    const imageUrl = `http://localhost:3001/assets/images/${encodeURIComponent(
      folder
    )}/${encodeURIComponent(imageName)}`;
    return imageUrl;
  }

  // Handle folder selection
  function handleFolderSelect(folder: string) {
    setSelectedFolder(folder);
    localStorage.setItem("selectedFolder", folder);
  }

  // Open modal with clicked image
  function handleImageClick(imageUrl: string) {
    setSelectedImage(imageUrl);
  }

  // Close modal
  function handleCloseModal() {
    setSelectedImage(null);
  }

  // Fetch all folders when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/folders")
      .then((response) => {
        const sortedFolders = response.data.sort((a: string, b: string) => {
          const numA = parseInt(a.replace(/\D/g, ""), 10);
          const numB = parseInt(b.replace(/\D/g, ""), 10);

          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }

          return a.localeCompare(b);
        });

        setFolders(sortedFolders);

        const storedFolder = localStorage.getItem("selectedFolder");

        if (storedFolder && sortedFolders.includes(storedFolder)) {
          setSelectedFolder(storedFolder);
        } else if (sortedFolders.length > 0) {
          setSelectedFolder(sortedFolders[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching folders:", error);
      });
  }, []);

  // Fetch images when a folder is selected
  useEffect(() => {
    if (selectedFolder) {
      axios
        .get(`http://localhost:3001/api/folder/${selectedFolder}`)
        .then((response) => {
          setFiles(response.data);

          // Select all images in the folder
          setSelectedFiles(response.data.map((file: FileInfo) => file.name));
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });
    }
  }, [selectedFolder]);

  // Restore the last selected folder when the component mounts
  useEffect(() => {
    const storedFolder = localStorage.getItem("selectedFolder");
    if (storedFolder) {
      setSelectedFolder(storedFolder);
    }
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
    if (selectedFiles.length === 0) {
      ToastService.warning(
        "You must select at least one image before sending."
      );
      return;
    }

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
        setSelectedFiles(selectedFiles);
      })
      .catch((error) => {
        ToastService.error("Could not send images.");
        console.error("Error saving selected files:", error);
      });
  }

  return (
    <Box display="flex" width="100%" height="100vh">
      {/* Menu icon container */}
      <Box
        sx={{
          width: "50px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: open ? "#f5f5f5" : "white",
        }}
      >
        <IconButton
          color="inherit"
          onClick={() => setOpen((prev) => !prev)}
          sx={{ margin: "5px" }}
        >
          {open ? <CloseIcon /> : <FolderOpen />}
        </IconButton>
      </Box>

      {/* Sidebar */}
      <Box
        sx={{
          width: open ? "250px" : "0px",
          backgroundColor: "#f5f5f5",
          height: "100vh",
          overflow: "hidden",
          transition: "width 0.3s ease-in-out",
          padding: open ? "10px" : "0px",
          display: "flex",
          flexDirection: "column",
          alignItems: open ? "start" : "center",
        }}
      >
        {open && (
          <>
            <Typography variant="h6" sx={{ marginBottom: "10px" }}>
              Choose folder
            </Typography>
            <Box
              sx={{
                maxHeight: "80vh",
                overflowY: "auto",
                width: "100%",
              }}
            >
              {folders.map((folder) => (
                <Button
                  key={folder}
                  onClick={() => handleFolderSelect(folder)}
                  sx={{
                    textAlign: "left",
                    width: "100%",
                    justifyContent: "flex-start",
                    color: "black",
                    backgroundColor:
                      selectedFolder === folder ? "#ddd" : "transparent",
                    ":hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  {folder}
                </Button>
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* Image section */}
      <Box
        sx={{
          flexGrow: 1,
          padding: "10px",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          Images in {selectedFolder}
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
              {selectedFolder && (
                <img
                  src={getImageUrl(selectedFolder, file.name)}
                  alt={file.name}
                  style={{
                    width: "300px",
                    height: "auto",
                    borderRadius: "5px",
                    maxHeight: "250px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleImageClick(getImageUrl(selectedFolder, file.name))
                  }
                />
              )}
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
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
            maxWidth: "1400px",
            width: "100%",
            marginLeft: "auto",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              if (selectedFiles.length === files.length) {
                setSelectedFiles([]);
              } else {
                setSelectedFiles(files.map((file) => file.name));
              }
            }}
          >
            {selectedFiles.length === files.length
              ? "Deselect All"
              : "Select All"}
          </Button>
          <Button variant="contained" onClick={handleSend}>
            Send
          </Button>
        </Box>
      </Box>

      {/* Modal for image */}
      <Modal open={!!selectedImage} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 1,
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected"
              style={{
                maxWidth: "90vw",
                maxHeight: "80vh",
                borderRadius: "5px",
              }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
}

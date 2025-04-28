import React, { useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import * as XLSX from 'xlsx';

const ImportShopeeOrder = () => {
    // ... (state lainnya tetap sama) ...
    const [setSelectedFile] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState("upload");
  
    const allowedFileTypes = ".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const handleFileChange = (event) => {
    setError(null);
    setParsedData([]);
    setHeaders([]);
    const file = event.target.files[0];

    if (file) {
      // Basic validation for XLSX
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      if (
        !fileName.endsWith(".xlsx") &&
        fileType !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setError("Invalid file type. Please upload an XLSX file.");
        setSelectedFile(null);
        event.target.value = null; // Clear the input
        setStep("upload");
        return;
      }

      setSelectedFile(file);
      setStep("parsing"); // Indicate parsing is about to start
      readXlsxFile(file); // Call the XLSX reading function
    } else {
      setSelectedFile(null);
      setStep("upload");
    }
  };

  const readXlsxFile = (file) => {
    setIsLoading(true);
    setError(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" }); // Read file data

        // --- Get the first sheet ---
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          throw new Error("The XLSX file seems empty or has no sheets.");
        }
        const worksheet = workbook.Sheets[firstSheetName];

        // --- Convert sheet to JSON array of objects ---
        // This assumes the first row contains headers
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log("Parsed XLSX data:", jsonData);

        if (!jsonData || jsonData.length === 0) {
          // Check if there are headers but no data rows
          const headerRow = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          })[0];
          if (headerRow && headerRow.length > 0) {
            setHeaders(headerRow);
            setParsedData([]); // No data rows
            setError("File contains headers but no data rows."); // Use warning/info later?
            setStep("preview"); // Still go to preview to show headers
          } else {
            throw new Error(
              "Could not parse any data or headers from the sheet."
            );
          }
        } else {
          // --- Extract headers (keys from the first data object) ---
          // Ensure headers are treated as strings, handle potential null/undefined
          const extractedHeaders = Object.keys(jsonData[0]).map(String);
          setHeaders(extractedHeaders);
          setParsedData(jsonData);
          setStep("preview"); // Move to preview step
        }
      } catch (err) {
        console.error("Error parsing XLSX file:", err);
        setError(
          `Failed to parse XLSX file: ${err.message}. Ensure the file is valid and the first sheet contains data.`
        );
        setParsedData([]);
        setHeaders([]);
        setStep("upload"); // Go back to upload on critical error
      } finally {
        setIsLoading(false); // Stop loading indicator
      }
    };

    reader.onerror = (err) => {
      console.error("FileReader error:", err);
      setError("Failed to read the file.");
      setIsLoading(false);
      setStep("upload");
    };

    // Read the file as an ArrayBuffer, suitable for XLSX.read
    reader.readAsArrayBuffer(file);
  };

  const handleConfirm = () => {
    console.log("Confirmed Data (from XLSX):", parsedData);
    // TODO: Add logic to actually process/save the parsedData
    alert(
      "Data confirmed! (Check console for data). Implement actual saving logic here."
    );
    // Optionally reset after confirmation
    // handleCancel();
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setParsedData([]);
    setHeaders([]);
    setError(null);
    setIsLoading(false);
    setStep("upload");
    // Reset the file input visually
    const fileInput = document.getElementById("xlsxFileInput");
    if (fileInput) {
      fileInput.value = null;
    }
  };

  // --- The JSX structure remains largely the same ---
  // --- Only texts and input 'accept' attribute change ---
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Import Order Shopee (XLSX)
      </Typography>

      {/* --- Step 1: Upload --- */}
      {step === "upload" && (
        <Box>
          {error && ( <Alert severity="error" sx={{ mb: 2 }}> <AlertTitle>Error</AlertTitle> {error} </Alert> )}
          <Typography variant="body1" mb={2}> Please select the XLSX file exported from Shopee. </Typography>
          <Button variant="contained" component="label"> Select XLSX File <input id="xlsxFileInput" type="file" hidden accept={allowedFileTypes} onChange={handleFileChange} /> </Button>
        </Box>
      )}

      {/* --- Parsing Indicator --- */}
      {step === "parsing" && isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', p: 3 }}>
           <CircularProgress />
           <Typography sx={{ mt: 2 }}>Reading XLSX file...</Typography>
        </Box>
      )}

      {/* --- Step 2: Preview & Confirm --- */}
      {step === "preview" && !isLoading && (
        <Box>
          {error && !parsedData.length && ( /* Tampilkan error hanya jika fatal dan tidak ada data */
             <Alert severity="error" sx={{ mb: 2 }}> <AlertTitle>Error</AlertTitle> {error} </Alert>
          )}
           {error && parsedData.length > 0 && ( /* Tampilkan sebagai warning jika ada data tapi ada error minor */
             <Alert severity="warning" sx={{ mb: 2 }}> <AlertTitle>Warning</AlertTitle> {error} </Alert>
           )}
          {headers.length > 0 ? (
             <>
                <Typography variant="body1" mb={2}>
                    Preview of the uploaded data. Please verify before confirming.
                    ({parsedData.length} data rows found)
                </Typography>

                {/* Pastikan TableContainer mengizinkan scroll horizontal dan vertikal */}
                <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto', mb: 3 }}>
                    {/* JANGAN gunakan tableLayout: 'fixed'. Biarkan default (auto) */}
                    <Table stickyHeader aria-label="preview table">
                    <TableHead>
                        <TableRow>
                        {/* Terapkan whiteSpace: 'nowrap' ke semua header */}
                        {headers.map((header) => (
                            <TableCell
                                key={header}
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: 'grey.200',
                                    whiteSpace: 'nowrap', // <-- PENTING: Agar header tidak wrap
                                }}
                            >
                                {header}
                            </TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {parsedData.map((row, rowIndex) => (
                        <TableRow key={rowIndex} hover>
                             {/* Terapkan whiteSpace: 'nowrap' ke semua sel data */}
                            {headers.map((header) => (
                            <TableCell
                                key={`${rowIndex}-${header}`}
                                sx={{
                                    whiteSpace: 'nowrap', // <-- PENTING: Agar data tidak wrap
                                }}
                            >
                                {row[header] !== undefined && row[header] !== null ? String(row[header]) : ''}
                            </TableCell>
                            ))}
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>

                {/* Tombol Aksi */}
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleConfirm} disabled={parsedData.length === 0}>
                    Confirm Import
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                    Cancel / Change File
                    </Button>
                </Box>
            </>
          ) : (
             // Tampilkan hanya jika tidak ada error sebelumnya tapi tetap tidak ada header
             !error && <Alert severity="warning">Could not find any headers or data in the file.</Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ImportShopeeOrder;
// src/pages/ImportTokopediashopOrder.jsx
import React, { useState, useRef } from "react";
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
  Stack, // Untuk menata tombol bersebelahan
} from "@mui/material";
import * as XLSX from "xlsx";
import Papa from "papaparse"; // Import PapaParse untuk CSV

const ImportTokopediashopOrder = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("select_format"); // Mulai dari memilih format
  const [fileType, setFileType] = useState(null); // Untuk menyimpan tipe file yg dipilih (csv/xlsx)

  // Refs untuk file input tersembunyi
  const csvInputRef = useRef(null);
  const xlsxInputRef = useRef(null);

  // ... (state dan refs tetap sama) ...
  const [fileDescriptionRow, setFileDescriptionRow] = useState([]);

  // Fungsi untuk memicu klik pada input file tersembunyi
  const handleSelectFileClick = (type) => {
    setError(null); // Reset error saat memilih file baru
    setFileType(type); // Simpan tipe file yang dipilih
    if (type === "csv" && csvInputRef.current) {
      csvInputRef.current.click(); // Buka dialog file untuk CSV
    } else if (type === "xlsx" && xlsxInputRef.current) {
      xlsxInputRef.current.click(); // Buka dialog file untuk XLSX
    }
  };

  // Handler ketika file dipilih dari dialog
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setStep("parsing"); // Pindah ke state parsing
      readFileContent(file, fileType); // Panggil fungsi pembacaan utama
    } else {
      // Jika pengguna cancel dialog file
      setSelectedFile(null);
      setFileType(null);
      setStep("select_format"); // Kembali ke pemilihan format
    }

    // Reset value input agar onChange bisa trigger lagi jika file yg sama dipilih
    event.target.value = null;
  };

  // Fungsi utama untuk membaca dan mem-parsing file (CSV atau XLSX)
  const readFileContent = (file, type) => {
    setIsLoading(true);
    setError(null);
    setParsedData([]);
    setHeaders([]);
    setFileDescriptionRow([]);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        let headerRow = [];
        let descriptionRow = [];
        let dataRowsAsArrays = [];
        let parsingErrorMessage = null; // Tampung pesan error sementara

        if (type === "xlsx") {
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          if (!firstSheetName) throw new Error("XLSX file has no sheets.");
          const worksheet = workbook.Sheets[firstSheetName];
          const sheetDataAsArray = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            blankrows: false,
          });

          if (sheetDataAsArray.length < 1)
            throw new Error("XLSX file seems empty or has no header row.");

          headerRow = sheetDataAsArray[0];
          descriptionRow =
            sheetDataAsArray.length >= 2 ? sheetDataAsArray[1] : [];
          dataRowsAsArrays =
            sheetDataAsArray.length >= 3 ? sheetDataAsArray.slice(2) : [];

          // Set pesan error spesifik jika hanya header (+deskripsi) yg ditemukan
          if (sheetDataAsArray.length >= 1 && dataRowsAsArrays.length === 0) {
            parsingErrorMessage =
              "XLSX file contains headers (and possibly descriptions) but no actual data rows found.";
          }
        } else if (type === "csv") {
          const csvString = new TextDecoder().decode(data);
          const results = Papa.parse(csvString, {
            header: false,
            skipEmptyLines: true,
          });

          if (results.errors.length > 0) {
            console.error("CSV Parsing Errors:", results.errors);
            const firstError = results.errors[0];
            throw new Error(
              `CSV Parsing Error: ${firstError.message}${
                firstError.row !== undefined
                  ? " near row " + (firstError.row + 1)
                  : ""
              }. Please check the file format.`
            );
          }
          const csvDataAsArray = results.data;

          if (csvDataAsArray.length < 1)
            throw new Error("CSV file seems empty or has no header row.");

          headerRow = csvDataAsArray[0];
          descriptionRow = []; // Tidak ada deskripsi di CSV
          dataRowsAsArrays =
            csvDataAsArray.length >= 2 ? csvDataAsArray.slice(1) : [];

          // Set pesan error spesifik jika hanya header yg ditemukan
          if (csvDataAsArray.length >= 1 && dataRowsAsArrays.length === 0) {
            parsingErrorMessage =
              "CSV file contains headers but no actual data rows found.";
          }
        } else {
          throw new Error("Unsupported file type selected.");
        }

        // --- Validasi Header dan Konversi Data ke Objek ---
        const trueHeaders = headerRow.map(String);
        if (!trueHeaders || trueHeaders.length === 0) {
          throw new Error("Could not extract headers from the file.");
        }

        const actualDataRows = dataRowsAsArrays.map((rowArray) => {
          const rowObject = {};
          trueHeaders.forEach((header, index) => {
            rowObject[header] =
              index < rowArray.length ? rowArray[index] : null;
          });
          return rowObject;
        });

        // --- Set State ---
        setHeaders(trueHeaders);
        setFileDescriptionRow(descriptionRow);
        setParsedData(actualDataRows);

        // Set error HANYA jika ada pesan error dari parsing dan tidak ada data aktual
        // (jangan timpa error parsing yg lebih serius jika ada)
        if (parsingErrorMessage && actualDataRows.length === 0) {
          setError(parsingErrorMessage);
        }
        // Jika tidak ada pesan error parsing spesifik TAPI data tetap kosong,
        // cek lagi (meskipun seharusnya sudah tertangkap error sebelumnya)
        else if (
          !parsingErrorMessage &&
          actualDataRows.length === 0 &&
          trueHeaders.length > 0
        ) {
          setError("Headers were found, but no data rows could be processed.");
        }

        setStep("preview");
      } catch (err) {
        // Tangkap semua error lainnya dari proses parsing
        console.error(`Error parsing ${type.toUpperCase()} file:`, err);
        setError(`Failed to parse ${type.toUpperCase()} file: ${err.message}.`);
        setParsedData([]);
        setHeaders([]);
        setFileDescriptionRow([]);
        setStep("select_format");
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = (err) => {
      console.error("FileReader error:", err);
      setError("Failed to read the file.");
      setIsLoading(false);
      setFileDescriptionRow([]);
      setStep("select_format");
    };

    reader.readAsArrayBuffer(file);
  };

  // Handler Confirm dan Cancel tetap sama logikanya
  const handleConfirm = () => {
    setIsLoading(true); // Tampilkan loading saat proses konfirmasi
    setError(null);
    console.log(
      "Confirmed Data (from " + fileType.toUpperCase() + "):",
      parsedData
    );
    // TODO: Implementasikan logika backend untuk menyimpan `parsedData`
    // Contoh: saveDataToBackend(parsedData, fileType)
    //         .then(() => { setSuccess("Data imported successfully!"); handleCancel(); }) // Kembali setelah sukses
    //         .catch(err => setError("Failed to save data: " + err.message))
    //         .finally(() => setIsLoading(false));

    // Simulasi sukses (ganti dengan logika API call sesungguhnya)
    setTimeout(() => {
      alert(
        "Data confirmed! (Check console for data). Implement actual saving logic here."
      );
      setIsLoading(false);
      handleCancel(); // Kembali ke awal setelah konfirmasi (opsional)
    }, 1000);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setParsedData([]);
    setHeaders([]);
    setError(null);
    setIsLoading(false);
    setFileType(null);
    setStep("select_format"); // Kembali ke langkah awal

    // Reset input file tersembunyi (opsional tapi bagus)
    if (csvInputRef.current) csvInputRef.current.value = null;
    if (xlsxInputRef.current) xlsxInputRef.current.value = null;
  };

  // --- Render JSX ---
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Import Order Tokopedia (CSV / XLSX)
      </Typography>

      {/* --- Step 1: Pilih Format File --- */}
      {step === "select_format" && (
        <Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {" "}
              <AlertTitle>Error</AlertTitle> {error}{" "}
            </Alert>
          )}
          <Typography variant="body1" mb={2}>
            {" "}
            Please select the file format you want to upload:{" "}
          </Typography>
          {/* Tombol untuk memilih tipe file */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => handleSelectFileClick("csv")}
            >
              {" "}
              Select CSV File{" "}
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSelectFileClick("xlsx")}
            >
              {" "}
              Select XLSX File{" "}
            </Button>
          </Stack>
          {/* Input file tersembunyi */}
          <input
            ref={csvInputRef}
            type="file"
            hidden
            accept=".csv"
            onChange={handleFileChange}
          />
          <input
            ref={xlsxInputRef}
            type="file"
            hidden
            accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={handleFileChange}
          />
        </Box>
      )}

      {/* --- Step 2: Parsing Indicator --- */}
      {step === "parsing" && isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            p: 3,
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            Reading {fileType?.toUpperCase()} file...
          </Typography>
        </Box>
      )}

      {/* --- Step 3: Preview & Confirm --- */}
      {step === "preview" && !isLoading && (
        <Box>
          {/* Tampilkan error parsing yang tidak fatal (misal: hanya header tanpa data) */}
          {error && (
            <Alert
              severity={parsedData.length > 0 ? "warning" : "error"}
              sx={{ mb: 2 }}
            >
              <AlertTitle>
                {parsedData.length > 0 ? "Warning" : "Error"}
              </AlertTitle>
              {error}
            </Alert>
          )}

          {headers.length > 0 ? (
            <>
              <Typography variant="body1" mb={1}>
                File: <strong>{selectedFile?.name}</strong> (
                {fileType?.toUpperCase()})
              </Typography>
              <Typography variant="body1" mb={2}>
                Preview of the uploaded data. Please verify before confirming. (
                {parsedData.length} data rows found)
              </Typography>

              {/* Tabel Preview (sama seperti sebelumnya) */}
              <TableContainer
                component={Paper}
                sx={{ maxHeight: 400, overflow: "auto", mb: 3 }}
              >
                <Table stickyHeader aria-label="preview table">
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            fontWeight: "bold",
                            backgroundColor: "grey.200",
                            whiteSpace: "nowrap",
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
                        {headers.map((header) => (
                          <TableCell
                            key={`${rowIndex}-${header}`}
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {/* Handle jika data di row itu undefined/null, tampilkan string kosong */}
                            {/* Pastikan semua diubah ke string untuk konsistensi di cell */}
                            {row[header] !== undefined && row[header] !== null
                              ? String(row[header])
                              : ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Tombol Aksi */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirm}
                  disabled={parsedData.length === 0 || isLoading}
                >
                  {isLoading && step === "preview" ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Confirm Import"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel / Change File
                </Button>
              </Box>
            </>
          ) : (
            // Tampilkan ini jika parsing selesai tapi tidak ada header sama sekali (dan tidak ada error parsing sebelumnya)
            !error && (
              <Alert severity="warning">
                Could not find any headers or data in the uploaded file.
              </Alert>
            )
          )}
        </Box>
      )}
    </Box>
  );
};

export default ImportTokopediashopOrder;

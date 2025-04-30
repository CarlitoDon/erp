// src/pages/UserManagementPage.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  // Anda perlu mengimpor komponen form di sini nanti:
  // TextField, Select, MenuItem, FormControl, InputLabel, RadioGroup, Radio, FormLabel, Stack
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../contexts/AuthContext"; // Sesuaikan path jika perlu
import UserFormDialog from '../components/Users/UserFormDialog'; // Jika pakai komponen terpisah

// Definisikan konstanta Role di frontend (harus cocok dengan backend/enum)
const UserRole = {
  ADMIN: "ADMIN",
  SALES_ACQUISITION: "SALES_ACQUISITION",
  SALES_RETENTION: "SALES_RETENTION",
  MARKETPLACE_MANAGER: "MARKETPLACE_MANAGER",
  WAREHOUSE_STAFF: "WAREHOUSE_STAFF",
  FINANCE_STAFF: "FINANCE_STAFF",
};

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [tableLoading, setTableLoading] = useState(false); // Loading untuk tabel DataGrid
  const [formLoading, setFormLoading] = useState(false); // Loading khusus untuk submit form
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Ambil token dan status loading dari AuthContext
  const { token, loading: authLoading } = useContext(AuthContext);

  const fetchUsers = async () => {
    // Jangan set loading tabel jika auth masih loading
    if (authLoading) return;

    setTableLoading(true);
    setError(null);

    // Token sudah dicek oleh logic di useEffect

    try {
      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = `Gagal mengambil data pengguna (Status: ${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          /* Biarkan pesan default */
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(
        err.message || "Terjadi kesalahan saat mengambil data pengguna."
      );
      console.error("Fetch Users Error:", err);
      setUsers([]);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    // Hanya fetch jika proses loading auth sudah selesai DAN token ada
    if (!authLoading && token) {
      console.log("Auth finished and token present, fetching users...");
      fetchUsers();
    } else if (!authLoading && !token) {
      // Jika auth selesai tapi tidak ada token (belum login/logout)
      setError("Autentikasi dibutuhkan untuk mengakses data ini.");
      setUsers([]); // Kosongkan user jika tidak ada token
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, token]); // Dependensi pada authLoading dan token

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
    setSuccess(null);
    setError(null);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
    setSuccess(null);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setError(null);
    setSuccess(null);
    const isEditing = !!editingUser;
    const url = isEditing ? `/api/users/${editingUser.id}` : "/api/users";
    const method = isEditing ? "PUT" : "POST";

    console.log("Calling API to save user", { method, url, data: formData });

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMessage = `Gagal ${
          isEditing ? "memperbarui" : "menambah"
        } pengguna (Status: ${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          /* Biarkan pesan default */
        }
        throw new Error(errorMessage);
      }

      setSuccess(`Pengguna ${isEditing ? "diperbarui" : "ditambahkan"}!`);
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      // Tampilkan error di form atau di atas halaman
      setError(
        err.message ||
          `Terjadi kesalahan saat ${
            isEditing ? "memperbarui" : "menambah"
          } pengguna.`
      );
      console.error("Submit error:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Anda yakin ingin menghapus pengguna ini?")) return;
    setTableLoading(true); // Gunakan loading tabel
    setError(null);
    setSuccess(null);
    console.log("Calling API DELETE /api/users/", userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let errorMessage = `Gagal menghapus pengguna (Status: ${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          /* Biarkan pesan default */
        }
        throw new Error(errorMessage);
      }

      setSuccess("Pengguna berhasil dihapus!");
      fetchUsers();
    } catch (err) {
      setError(err.message || "Gagal menghapus pengguna.");
      console.error("Delete error:", err);
    } finally {
      setTableLoading(false); // Matikan loading tabel
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 150, flex: 1 },
    { field: "role", headerName: "Role", width: 180 },
    {
      field: "createdAt",
      headerName: "Tanggal Dibuat",
      width: 180,
      type: "dateTime",
      valueGetter: (value) => (value ? new Date(value) : null),
      renderCell: (params) =>
        params.value
          ? params.value.toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : "-",
    },
    {
      field: "actions",
      headerName: "Aksi",
      sortable: false,
      filterable: false,
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleOpenEditModal(params.row)}
            disabled={tableLoading || formLoading}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteUser(params.row.id)}
            disabled={tableLoading || formLoading}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Tampilkan loading utama jika auth masih loading
  if (authLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 150px)",
        }}
      >
        {" "}
        {/* Sesuaikan tinggi */}
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="medium">
          Manajemen Pengguna
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenAddModal}
          disabled={tableLoading}
        >
          Tambah Pengguna Baru
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={tableLoading} // Gunakan state loading tabel
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
        />
      </Paper>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          {editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
        </DialogTitle>
        <DialogContent>
        <UserFormDialog
                open={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                initialData={editingUser}
                isLoading={formLoading} // Kirim state loading form
                availableRoles={UserRole} // Kirim object/enum roles
            />
          <pre
            style={{
              fontSize: "0.75rem",
              background: "#f5f5f5",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            {JSON.stringify(
              { username: "", password: "", confirmPassword: "", role: "" },
              null,
              2
            )}
          </pre>
          {/* Jika error terjadi saat submit form, Anda bisa menampilkannya di sini */}
          {/* {error && isModalOpen && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>} */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={formLoading}>
            Batal
          </Button>
          {/* Tombol submit idealnya ada di dalam komponen form */}
          <Button onClick={() => handleFormSubmit({})} disabled={formLoading}>
            {" "}
            {/* Ganti {} dengan data form asli */}
            {formLoading ? <CircularProgress size={24} /> : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagementPage;

"use client";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "doctor_patients";

export default function ListPatients() {
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    setPatients(parsed);
  }, []);

  const handleAddPatient = () => {
    const newPatient = {
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...patients, newPatient];
    setPatients(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setForm({ name: "", dob: "", gender: "", email: "", phone: "" });
    setModalOpen(false);
  };

  const columns = [
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "email", headerName: "Correo", flex: 1 },
    { field: "phone", headerName: "Teléfono", width: 140 },
    { field: "gender", headerName: "Género", width: 100 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      renderCell: (params) => (
        <IconButton
          onClick={() => router.push(`/doctor/patients/${params.row.id}`)}
        >
          <VisibilityIcon color="primary" />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Pacientes
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
        >
          Agregar Paciente
        </Button>
      </Stack>

      {isMobile ? (
        <Stack spacing={2}>
          {patients.map((patient) => (
            <Card key={patient.id}>
              <CardContent>
                <Typography variant="h6">{patient.name}</Typography>
                <Typography variant="body2">Correo: {patient.email}</Typography>
                <Typography variant="body2">
                  Teléfono: {patient.phone}
                </Typography>
                <Typography variant="body2">
                  Género: {patient.gender}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  onClick={() => router.push(`/doctor/patients/${patient.id}`)}
                >
                  <VisibilityIcon color="primary" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Stack>
      ) : (
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={patients}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            getRowId={(row) => row.id}
          />
        </Box>
      )}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth>
        <DialogTitle>Agregar Paciente</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              type="date"
              label="Fecha de Nacimiento"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Género</InputLabel>
              <Select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                label="Género"
              >
                <MenuItem value="masculino">Masculino</MenuItem>
                <MenuItem value="femenino">Femenino</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Correo"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Teléfono"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddPatient} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

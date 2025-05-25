"use client";

import {
  Box,
  Tabs,
  Tab,
  Typography,
  Stack,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import RecipeHistory from "./RecipeHistory";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function ViewPatient({ patient }) {
  const [tab, setTab] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const [info, setInfo] = useState({
    name: patient.name || "",
    email: patient.email || "",
    phone: patient.phone || "",
    dob: patient.dob || "",
    gender: patient.gender || "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    setInfo({
      name: patient.name || "",
      email: patient.email || "",
      phone: patient.phone || "",
      dob: patient.dob || "",
      gender: patient.gender || "",
    });
  }, [patient]);

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleInputChange = (field) => (e) => {
    setInfo({ ...info, [field]: e.target.value });
  };

  const handleSave = () => {
    const storedPatients =
      JSON.parse(localStorage.getItem("doctor_patients")) || [];
    const updatedPatients = storedPatients.map((p) =>
      p.id === patient.id ? { ...p, ...info } : p
    );
    localStorage.setItem("doctor_patients", JSON.stringify(updatedPatients));

    setEditMode(false);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="Tabs de información del paciente"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab
          label="Información"
          id="patient-tab-0"
          aria-controls="patient-tabpanel-0"
        />
        <Tab
          label="Historial de Recetas"
          id="patient-tab-1"
          aria-controls="patient-tabpanel-1"
        />
      </Tabs>

      {/* Tab Información */}
      <TabPanel value={tab} index={0}>
        <Paper sx={{ p: 3, maxWidth: 600 }}>
          {!editMode ? (
            <Stack spacing={2}>
              <Typography variant="h6">{info.name}</Typography>
              <Typography>
                <strong>Email:</strong> {info.email}
              </Typography>
              <Typography>
                <strong>Teléfono:</strong> {info.phone}
              </Typography>
              <Typography>
                <strong>Fecha de nacimiento:</strong>{" "}
                {info.dob ? new Date(info.dob).toLocaleDateString() : ""}
              </Typography>
              <Typography>
                <strong>Género:</strong> {info.gender}
              </Typography>

              <Button variant="outlined" onClick={() => setEditMode(true)}>
                Editar información
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <TextField
                label="Nombre"
                value={info.name}
                onChange={handleInputChange("name")}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={info.email}
                onChange={handleInputChange("email")}
                fullWidth
              />
              <TextField
                label="Teléfono"
                value={info.phone}
                onChange={handleInputChange("phone")}
                fullWidth
              />
              <TextField
                label="Fecha de nacimiento"
                type="date"
                value={info.dob}
                onChange={handleInputChange("dob")}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="Género"
                value={info.gender}
                onChange={handleInputChange("gender")}
                fullWidth
              />

              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleSave}>
                  Guardar
                </Button>
                <Button onClick={() => setEditMode(false)}>Cancelar</Button>
              </Stack>
            </Stack>
          )}
        </Paper>
      </TabPanel>

      {/* Tab Historial de Recetas */}
      <TabPanel value={tab} index={1}>
        <RecipeHistory patientEmail={info.email} />
      </TabPanel>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Información actualizada correctamente.
        </Alert>
      </Snackbar>
    </Box>
  );
}

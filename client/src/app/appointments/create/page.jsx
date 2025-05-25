"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";

import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const availability = {
  1: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  2: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  3: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  4: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  5: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
};

const STORAGE_KEY = "doctor_appointments";

export default function CreateAppointmentPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: dayjs().format("YYYY-MM-DD"),
    time: "",
  });
  const [availableTimes, setAvailableTimes] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const getStoredAppointments = () => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  useEffect(() => {
    if (!form.date) {
      setAvailableTimes([]);
      return;
    }
    const day = dayjs(form.date).day();
    const possibleTimes = availability[day] || [];

    const appointments = getStoredAppointments();

    const occupiedTimes = appointments
      .filter((appt) => appt.date === form.date)
      .map((appt) => appt.time);

    const freeTimes = possibleTimes.filter(
      (time) => !occupiedTimes.includes(time)
    );
    setAvailableTimes(freeTimes);

    if (!freeTimes.includes(form.time)) {
      setForm((f) => ({ ...f, time: "" }));
    }
  }, [form.date]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone || !form.date || !form.time) {
      setError("Por favor completa todos los campos.");
      return;
    }

    const appointments = getStoredAppointments();
    appointments.push({
      ...form,
      id: Date.now(),
      status: "pendiente",
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));

    setSuccess(true);
    setForm({
      name: "",
      email: "",
      phone: "",
      date: dayjs().format("YYYY-MM-DD"),
      time: "",
    });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <CalendarMonthIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" gutterBottom>
          Reservar Cita con el Dr. Pablo Cotí
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Elige una fecha y hora disponibles para agendar tu cita.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            required
            label="Nombre completo"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            required
            label="Teléfono"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
          />
          <TextField
            required
            label="Correo electrónico"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            required
            label="Fecha deseada"
            name="date"
            type="date"
            inputProps={{ min: dayjs().format("YYYY-MM-DD") }}
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            required
            select
            label="Hora disponible"
            name="time"
            value={form.time}
            onChange={handleChange}
            disabled={availableTimes.length === 0}
            helperText={
              availableTimes.length === 0
                ? "No hay horarios disponibles para esta fecha."
                : ""
            }
          >
            {availableTimes.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!form.time}
          >
            Solicitar cita
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          ¡Tu cita fue solicitada con éxito! El doctor la confirmará pronto.
        </Alert>
      </Snackbar>
    </Container>
  );
}

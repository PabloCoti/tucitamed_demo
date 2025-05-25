"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import UpdateIcon from "@mui/icons-material/Update";

const STORAGE_KEY = "doctor_appointments";

export default function CitasPage() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [dateFilter, setDateFilter] = useState(dayjs().format("YYYY-MM-DD"));
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });

  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const availability = {
    1: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    2: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    3: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    4: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    5: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    setAppointments(parsed);
  }, []);

  useEffect(() => {
    let list = [...appointments];
    if (showOnlyPending) list = list.filter((a) => a.status === "pendiente");
    if (statusFilter !== "todos")
      list = list.filter((a) => a.status === statusFilter);
    if (dateFilter) list = list.filter((a) => a.date === dateFilter);

    list.sort((a, b) => {
      if (a.date === b.date) {
        return a.time.localeCompare(b.time);
      }
      return a.date.localeCompare(b.date);
    });

    setFiltered(list);
  }, [appointments, showOnlyPending, statusFilter, dateFilter]);

  useEffect(() => {
    if (!form.date) {
      setAvailableTimes([]);
      return;
    }

    const day = dayjs(form.date).day();
    const possibleTimes = availability[day] || [];

    const occupied = appointments
      .filter((appt) => appt.date === form.date)
      .map((appt) => appt.time);

    const freeTimes = possibleTimes.filter((t) => !occupied.includes(t));
    setAvailableTimes(freeTimes);

    if (!freeTimes.includes(form.time)) {
      setForm((f) => ({ ...f, time: "" }));
    }
  }, [form.date, appointments]);

  const updateAppointmentStatus = (id, newStatus) => {
    const updated = appointments.map((a) =>
      a.id === id ? { ...a, status: newStatus } : a
    );
    setAppointments(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleCreateAppointment = () => {
    const newAppointment = {
      ...form,
      id: Date.now(),
      status: "confirmada",
      createdAt: new Date().toISOString(),
    };
    const updated = [...appointments, newAppointment];
    setAppointments(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setForm({ name: "", email: "", phone: "", date: "", time: "" });
    setModalOpen(false);
  };

  const columns = [
    { field: "name", headerName: "Paciente", flex: 1 },
    { field: "date", headerName: "Fecha", width: 110 },
    { field: "time", headerName: "Hora", width: 100 },
    { field: "status", headerName: "Estado", width: 140 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 160,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => updateAppointmentStatus(params.row.id, "confirmada")}
          >
            <DoneIcon color="success" />
          </IconButton>
          <IconButton
            onClick={() => updateAppointmentStatus(params.row.id, "cancelada")}
          >
            <CancelIcon color="error" />
          </IconButton>
          <IconButton
            onClick={() => {
              setRescheduleForm(params.row);
              setRescheduleModalOpen(true);
            }}
          >
            <UpdateIcon color="primary" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Citas
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="estado-label">Estado</InputLabel>
          <Select
            labelId="estado-label"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Estado"
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="confirmada">Confirmada</MenuItem>
            <MenuItem value="cancelada">Cancelada</MenuItem>
            <MenuItem value="reprogramada">Reprogramada</MenuItem>
            <MenuItem value="hecha">Hecha</MenuItem>
            <MenuItem value="saltada">Saltada</MenuItem>
          </Select>
        </FormControl>

        <TextField
          type="date"
          size="small"
          label="Fecha"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth={isMobile}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showOnlyPending}
              onChange={(e) => setShowOnlyPending(e.target.checked)}
            />
          }
          label="Solo pendientes"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
        >
          Crear Cita
        </Button>
      </Stack>

      {isMobile ? (
        <Stack spacing={2}>
          {filtered.map((appt) => (
            <Card key={appt.id}>
              <CardContent>
                <Typography variant="h6">{appt.name}</Typography>
                <Typography variant="body2">
                  Fecha: {appt.date} - Hora: {appt.time}
                </Typography>
                <Typography variant="body2">Estado: {appt.status}</Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  onClick={() => updateAppointmentStatus(appt.id, "confirmada")}
                >
                  <DoneIcon color="success" />
                </IconButton>
                <IconButton
                  onClick={() => updateAppointmentStatus(appt.id, "cancelada")}
                >
                  <CancelIcon color="error" />
                </IconButton>
                <IconButton
                  onClick={() =>
                    updateAppointmentStatus(appt.id, "reprogramada")
                  }
                >
                  <UpdateIcon color="primary" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Stack>
      ) : (
        <Box sx={{ height: 500 }}>
          {filtered.length === 0 ? (
            <Box
              sx={{
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed grey",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No hay citas para este día.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ height: 500 }}>
              <DataGrid
                rows={filtered}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                getRowId={(row) => row.id}
              />
            </Box>
          )}
        </Box>
      )}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth>
        <DialogTitle>Crear Cita</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
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
            <TextField
              type="date"
              label="Fecha"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Hora</InputLabel>
              <Select
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                label="Hora"
                disabled={availableTimes.length === 0}
              >
                {availableTimes.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateAppointment} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        fullWidth
      >
        <DialogTitle>Reprogramar Cita</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Typography variant="subtitle1">
              Paciente: {rescheduleForm.name}
            </Typography>
            <TextField
              type="date"
              label="Nueva Fecha"
              value={rescheduleForm.date}
              onChange={(e) =>
                setRescheduleForm({ ...rescheduleForm, date: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Nueva Hora</InputLabel>
              <Select
                value={rescheduleForm.time}
                onChange={(e) =>
                  setRescheduleForm({ ...rescheduleForm, time: e.target.value })
                }
                label="Nueva Hora"
              >
                {(availability[dayjs(rescheduleForm.date).day()] || [])
                  .filter(
                    (t) =>
                      !appointments.some(
                        (appt) =>
                          appt.date === rescheduleForm.date && appt.time === t
                      )
                  )
                  .map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRescheduleModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const updated = appointments.map((appt) =>
                appt.id === rescheduleForm.id
                  ? { ...appt, status: "reprogramada" }
                  : appt
              );
              const newAppointment = {
                ...rescheduleForm,
                id: Date.now(),
                status: "pendiente",
                createdAt: new Date().toISOString(),
              };
              const finalList = [...updated, newAppointment];
              setAppointments(finalList);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(finalList));
              setRescheduleModalOpen(false);
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

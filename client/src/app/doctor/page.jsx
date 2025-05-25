"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Container,
  Typography,
  Grid,
  Chip,
  IconButton,
  Stack,
  Paper,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import InfoIcon from "@mui/icons-material/Info";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const STORAGE_KEY = "doctor_appointments";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    const filtered = parsed.filter((app) => app.date === today);
    setAppointments(filtered);
  }, []);

  const countByStatus = (status) =>
    appointments.filter((app) => app.status === status).length;

  const statusColor = {
    pendiente: "warning",
    confirmada: "success",
    cancelada: "error",
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Panel del Dr. Pablo Cotí
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total de Citas
            </Typography>
            <Typography variant="h6">{appointments.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Confirmadas
            </Typography>
            <Typography variant="h6">{countByStatus("confirmada")}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Pendientes
            </Typography>
            <Typography variant="h6">{countByStatus("pendiente")}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Citas de Hoy ({dayjs().format("DD MMM YYYY")})
      </Typography>

      <Stack spacing={2}>
        {appointments.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No hay citas para hoy.
          </Typography>
        )}

        {appointments.map((app) => (
          <Paper
            key={app.id}
            elevation={0}
            variant="outlined"
            sx={{ p: 2, borderRadius: 2 }}
          >
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Typography variant="subtitle1" fontWeight={500}>
                  {app.name}
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 0.5 }}
                >
                  <AccessTimeIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {app.time} hs
                  </Typography>
                  <Chip
                    label={app.status}
                    color={statusColor[app.status] || "default"}
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <IconButton
                    size="small"
                    color="primary"
                    component="a"
                    href={`mailto:${app.email}`}
                  >
                    <EmailIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="success"
                    component="a"
                    href={`tel:${app.phone}`}
                  >
                    <PhoneIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="info"
                    onClick={() => alert(`Paciente: ${app.name}\nNotas: ...`)}
                  >
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}

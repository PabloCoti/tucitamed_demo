"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ViewPatient from "./ViewPatient";
import { Typography } from "@mui/material";

export default function PatientPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const storedPatients =
      JSON.parse(localStorage.getItem("doctor_patients")) || [];
    const found = storedPatients.find((p) => p.id == id);

    if (found) {
      setPatient(found);
    } else {
      setPatient(null);
    }

    setLoading(false);
  }, [id]);

  if (loading) return <Typography>Cargando paciente...</Typography>;
  if (!patient) return <Typography>No se encontró el paciente</Typography>;

  return <ViewPatient patient={patient} />;
}

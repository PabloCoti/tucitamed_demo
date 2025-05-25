"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";

import { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const STORAGE_KEY = "patient_recipes";

export default function RecipeHistory({ patientEmail }) {
  const [recipes, setRecipes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [form, setForm] = useState({
    date: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const printRef = useRef();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allRecipes = stored ? JSON.parse(stored) : [];
    const filtered = allRecipes.filter((r) => r.patientEmail === patientEmail);
    setRecipes(filtered);
  }, [patientEmail]);

  const saveRecipes = (newList) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allRecipes = stored ? JSON.parse(stored) : [];
    const filteredOut = allRecipes.filter(
      (r) => r.patientEmail !== patientEmail
    );
    const updated = [...filteredOut, ...newList];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const openAddModal = () => {
    setForm({
      date: "",
      diagnosis: "",
      treatment: "",
      notes: "",
    });
    setEditingRecipe(null);
    setModalOpen(true);
  };

  const openEditModal = (recipe) => {
    setForm({
      date: recipe.date,
      diagnosis: recipe.diagnosis,
      treatment: recipe.treatment,
      notes: recipe.notes,
    });
    setEditingRecipe(recipe);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.date || !form.diagnosis || !form.treatment) {
      alert(
        "Por favor completa los campos requeridos (fecha, diagnóstico y tratamiento)."
      );
      return;
    }
    if (editingRecipe) {
      const updated = recipes.map((r) =>
        r.id === editingRecipe.id ? { ...r, ...form } : r
      );
      setRecipes(updated);
      saveRecipes(updated);
    } else {
      const newRecipe = {
        ...form,
        id: Date.now(),
        patientEmail,
      };
      const updated = [...recipes, newRecipe];
      setRecipes(updated);
      saveRecipes(updated);
    }
    setModalOpen(false);
  };

  const confirmDeleteRecipe = (recipe) => {
    setRecipeToDelete(recipe);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    const updated = recipes.filter((r) => r.id !== recipeToDelete.id);
    setRecipes(updated);
    saveRecipes(updated);
    setDeleteConfirmOpen(false);
    setRecipeToDelete(null);
  };

  const sendEmail = () => {
    setSnackbar({
      open: true,
      message: "Receta enviada por correo",
      severity: "success",
    });
  };

  const sendWhatsApp = () => {
    setSnackbar({
      open: true,
      message: "Receta preparada para enviar por WhatsApp",
      severity: "success",
    });
  };

  const handlePrint = (recipe) => {
    const doc = new jsPDF();
    const primaryColor = "#1976d2";

    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text("Clínica del Dr. Pablo Cotí", 105, 20, { align: "center" });
    doc.setDrawColor(primaryColor);
    doc.line(20, 25, 190, 25);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    doc.text(`Fecha: ${recipe.date}`, 20, 40);
    doc.text(`Diagnóstico:`, 20, 50);
    doc.text(doc.splitTextToSize(recipe.diagnosis, 170), 25, 58);

    const yTreatmentStart =
      58 + doc.splitTextToSize(recipe.diagnosis, 170).length * 7 + 10;
    doc.text(`Tratamiento:`, 20, yTreatmentStart);
    doc.text(
      doc.splitTextToSize(recipe.treatment, 170),
      25,
      yTreatmentStart + 8
    );

    let yNotesStart =
      yTreatmentStart +
      doc.splitTextToSize(recipe.treatment, 170).length * 7 +
      10;
    if (recipe.notes) {
      doc.text(`Notas:`, 20, yNotesStart);
      doc.text(doc.splitTextToSize(recipe.notes, 170), 25, yNotesStart + 8);
      yNotesStart += doc.splitTextToSize(recipe.notes, 170).length * 7 + 10;
    }

    doc.save(`receta_${recipe.date}.pdf`);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Historial de Recetas Médicas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddModal}
        >
          Agregar Receta
        </Button>
      </Stack>

      {recipes.length === 0 ? (
        <Typography color="text.secondary">
          No hay recetas médicas registradas.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {recipes
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((recipe) => (
              <Card key={recipe.id} variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Fecha: {recipe.date}
                  </Typography>
                  <Typography>
                    <strong>Diagnóstico:</strong> {recipe.diagnosis}
                  </Typography>
                  <Typography>
                    <strong>Tratamiento:</strong> {recipe.treatment}
                  </Typography>
                  {recipe.notes && (
                    <Typography>
                      <strong>Notas:</strong> {recipe.notes}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Tooltip title="Editar receta">
                    <IconButton onClick={() => openEditModal(recipe)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar receta">
                    <IconButton
                      onClick={() => confirmDeleteRecipe(recipe)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Enviar por correo">
                    <IconButton
                      onClick={() => sendEmail(recipe)}
                      color="primary"
                    >
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Enviar por WhatsApp">
                    <IconButton
                      onClick={() => sendWhatsApp(recipe)}
                      sx={{ color: "#25D366" }}
                    >
                      <WhatsAppIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Imprimir receta">
                    <IconButton onClick={() => handlePrint(recipe)}>
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            ))}
        </Stack>
      )}

      {/* Modal Agregar / Editar */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingRecipe ? "Editar Receta Médica" : "Agregar Receta Médica"}
          <IconButton
            aria-label="cerrar"
            onClick={() => setModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Fecha"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Diagnóstico"
              required
              multiline
              minRows={2}
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
              fullWidth
            />
            <TextField
              label="Tratamiento"
              required
              multiline
              minRows={2}
              value={form.treatment}
              onChange={(e) => setForm({ ...form, treatment: e.target.value })}
              fullWidth
            />
            <TextField
              label="Notas (opcional)"
              multiline
              minRows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingRecipe ? "Guardar cambios" : "Agregar receta"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmación eliminar */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro que deseas eliminar esta receta médica?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

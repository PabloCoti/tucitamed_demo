import Head from 'next/head'
import Image from 'next/image'

import {
  Container,
  Typography,
  Button,
  Box,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material'

import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import FacebookIcon from '@mui/icons-material/Facebook'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import InstagramIcon from '@mui/icons-material/Instagram'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Dr. Pablo Cotí - Otorrino Laringólogo | Atención Profesional</title>
        <meta
          name="description"
          content="El Dr. Pablo Cotí, especialista en otorrinolaringología, ofrece consultas para problemas de oído, nariz y garganta. Tratamientos avanzados y atención personalizada."
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Dr. Pablo Cotí" />
        <meta
          name="keywords"
          content="otorrino, laringólogo, otorrinolaringología, tratamientos oído, tratamientos garganta, salud auditiva"
        />
      </Head>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ flexShrink: 0, borderRadius: 3, overflow: 'hidden', width: 280, height: 280, boxShadow: 3 }}>
            <Image
              src="/images/doctor.jpeg"
              alt="Foto del Dr. Pablo Cotí"
              width={280}
              height={280}
              style={{ objectFit: 'cover' }}
              priority
            />
          </Box>

          <Box>
            <Typography component="h1" variant="h3" gutterBottom>
              Dr. Pablo Cotí
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Otorrino Laringólogo
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify' }}>
              El Dr. Pablo Cotí es especialista en diagnóstico y tratamiento de enfermedades de oído, nariz y garganta, con años de experiencia y atención personalizada para cada paciente.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Tratamientos que ofrecemos:
            </Typography>
            <List dense>
              {[
                'Tratamiento para otitis media',
                'Rehabilitación auditiva',
                'Cirugía de amigdalitis',
                'Manejo de apnea del sueño',
                'Tratamiento para rinitis alérgica',
                'Diagnóstico y tratamiento de vértigo',
                'Laringoscopía y cuidado de la voz',
              ].map((trat, i) => (
                <ListItem key={i}>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={trat} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mx: 'auto' }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                sx={{
                  '& .MuiButton-root': {
                    whiteSpace: 'nowrap',
                    minWidth: 140,
                  },
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PhoneIcon />}
                  href="tel:+50257058159"
                >
                  Llamar ahora
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EmailIcon />}
                  href="mailto:pca2003gte@gmail.com?subject=Reservación de cita&body=Hola Dr. Pablo Cotí, me gustaría reservar una cita."
                >
                  Enviar email
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<CalendarMonthIcon />}
                  href="/appointments/create"
                >
                  Haz una reservación
                </Button>
              </Stack>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <IconButton
                    component="a"
                    href="https://www.instagram.com/pablo._.coti/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    color="primary"
                  >
                    <InstagramIcon />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://www.facebook.com/pablo.coti.830312"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    color="primary"
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://www.linkedin.com/in/pacoti2003/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    color="primary"
                  >
                    <LinkedInIcon />
                  </IconButton>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Container>
    </>
  )
}

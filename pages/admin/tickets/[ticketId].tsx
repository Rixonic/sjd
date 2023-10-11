import React, { useState, useContext } from "react";
import { getSession, useSession } from "next-auth/react";
import {
  NextPage,
  GetServerSideProps,
} from "next";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Box,
  Button,
  Stack,
  Chip,
  Grid,
  Typography,
  Divider,
  Container,
  TextField,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { format } from "date-fns";
import { ShopLayout } from "../../../components/layouts";
import { ItemSlideshow } from "../../../components/item";
import Avatar from "@mui/material/Avatar";
import { dbTickets, dbUsers } from "../../../database";
import { ITicket, IUser } from "../../../interfaces";
import Paper from "@mui/material/Paper";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
const sideSeparation = 3;
const mainSeparation = 2;
import { getUserData } from "../../../database/dbUsers";
import { UiContext, AuthContext } from "../../../context";
import { redirect } from "next/dist/server/api-utils";

interface Props {
  ticket: ITicket;
  user: IUser;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const steps = [
  {
    type: "REPARACION",
    step: [
      {
        status: "Solicitud creada",
        label: "Solicitud realizada",
        description: ` `,
      },
      {
        status: "Asignado",
        label: "Asignado",
        description: "",
      },
      {
        status: "En revision",
        label: "En revision",
        description: "",
      },
      {
        status: "Diagnosticado",
        label: "Diagnosticado",
        description: "",
      },
      {
        status: "Reparado",
        label: "Reparado",
        description: ``,
      },
    ],
  },
  {
    type: "TRASLADO",
    step: [
      {
        status: "Solicitud creada",
        label: "Solicitud realizada",
        description: ` `,
      },
      {
        status: "Traslado en curso",
        label: "Pendiente de asignacion",
        description: "",
      },
      {
        status: "Finalizado",
        label: "Solicitud Finalizada",
        description: ``,
      },
    ],
  },
];

const status = ["Solicitud creada", "Asignado", "En progreso"];
const person = [
  "Pablo Goldemberg",
  "Pablo Vilchez",
  "Franco Lagraña",
  "Franco Cejas",
  "Alejandra Lazcarro",
  "Jonathan Barragan",
];

const TicketPage: NextPage<Props> = ({ ticket, user }) => {
  const ticketType = steps.findIndex((step) => step.type === ticket.type);
  const [updatedStatus, setUpdatedStatus] = useState(ticket.status);
  const [updatedPriority, setUpdatedPriority] = useState(ticket.priority);
  const [updatedAssigned, setUpdatedAssigned] = useState(ticket.assignedTo);
  const [newDiagnostic, setNewDiagnostic] = useState(
    ticket.diagnostic.observation
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    ticket.estimatedFinish ? new Date(ticket.estimatedFinish) : null
  );
  const [isSaving, setIsSaving] = useState(false);

  const [comments, setComments] = useState(ticket.comments || []);
  const [newComment, setNewComment] = useState("");

  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openDanger, setOpenDanger] = React.useState(false);

  const handleClickSuccess = () => {
    setOpenSuccess(true);
  };
  const handleClickDanger = () => {
    setOpenDanger(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccess(false);
    setOpenDanger(false);
  };

  const handleDateChange = async (newDate: Date | null) => {
    try {
      setIsSaving(true);

      const response = await fetch("/api/admin/tickets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: ticket._id,
          estimatedFinish: newDate, // Actualiza la fecha estimada en la base de datos
        }),
      });

      if (response.ok) {
        const updatedTicket = await response.json();
        setSelectedDate(newDate);
        handleClose();
        handleClickSuccess();
      } else {
        handleClose();
        handleClickDanger();
      }
    } catch (error) {
      console.error("Error al actualizar la fecha", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (event: SelectChangeEvent) => {
    const newStatus = event.target.value;
    setUpdatedStatus(newStatus);

    // Realiza una solicitud PUT al servidor para actualizar el estado del ticket
    try {
      setIsSaving(true);

      const response = await fetch("/api/admin/tickets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: ticket._id,
          status: newStatus,
        }),
      });

      if (response.ok) {
        handleClose();
        handleClickSuccess();
      } else {
        handleClose();
        handleClickDanger();
      }
    } catch (error) {
      console.error("Error al actualizar el estado", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAssignedChange = async (event: SelectChangeEvent) => {
    const newAssigned = event.target.value;
    setUpdatedAssigned(newAssigned);

    // Realiza una solicitud PUT al servidor para actualizar el estado del ticket
    try {
      setIsSaving(true);

      const response = await fetch("/api/admin/tickets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: ticket._id,
          assignedTo: newAssigned,
        }),
      });

      if (response.ok) {
        handleClose();
        handleClickSuccess();
      } else {
        handleClose();
        handleClickDanger();
      }
    } catch (error) {
      console.error("Error al actualizar el estado", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePriorityChange = async (event: SelectChangeEvent) => {
    const newPriority = event.target.value;
    setUpdatedPriority(newPriority);

    // Realiza una solicitud PUT al servidor para actualizar la prioridad del ticket
    try {
      setIsSaving(true);

      const response = await fetch("/api/admin/tickets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: ticket._id,
          priority: newPriority,
        }),
      });

      if (response.ok) {
        handleClickSuccess();
      } else {
        handleClickDanger();
      }
    } catch (error) {
      console.error("Error al actualizar la prioridad", error);
    } finally {
      setIsSaving(false);
    }
  };

  const finishTicket = async () => {
    // Realiza una solicitud PUT al servidor para actualizar la prioridad del ticket
    try {
      setIsSaving(true);

      const response = await fetch("/api/admin/tickets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: ticket._id,
          finishBy: user.name,
          finishAt: new Date(),
          status: "Finalizado",
        }),
      });

      if (response.ok) {
        handleClickSuccess();
      } else {
        handleClickDanger();
      }
    } catch (error) {
      console.error("Error al actualizar la prioridad", error);
    } finally {
      setIsSaving(false);
      window.location.reload();
    }
  };

  const addDiagnostic = async () => {
    // Realiza una solicitud PUT al servidor para actualizar la prioridad del ticket
    try {
      setIsSaving(true);

      const response = await fetch("/api/admin/tickets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: ticket._id,
          diagnostic: {
            user: user.name,
            observation: newDiagnostic,
          },
        }),
      });

      if (response.ok) {
        handleClickSuccess();
      } else {
        handleClickDanger();
      }
    } catch (error) {
      console.error("Error al actualizar la prioridad", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addComment = async () => {
    if (newComment.trim() === "") {
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch("/api/admin/tickets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: ticket._id, // Assuming ticket._id is the ID of the current ticket
          comments: [
            {
              user: user.name, // Replace with actual user ID
              comment: newComment,
              createdAt: new Date(),
            },
            ...comments, // Keep the existing comments
          ],
        }),
      });

      if (response.ok) {
        // Comment successfully added to the server
        const updatedTicket = await response.json();
        setComments(updatedTicket.comments);
        setNewComment("");
        handleClickSuccess();
      } else {
        // Handle error
        handleClickDanger();
      }
    } catch (error) {
      console.error("Error adding comment", error);
    } finally {
      setIsSaving(false);
    }
  };

  function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name: string, size: number) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: size,
        height: size,
        fontSize: size / 2,
      },
      children: name
        .split(" ")
        .map((word) => word[0])
        .join(""),
    };
  }

  const activeStep =
    1 + steps.findIndex((step) => step[ticketType]?.status === ticket.status);

  return (
    <ShopLayout title={ticket.ticketId} pageDescription={ticket.summary}>
      <Box
        display="flex"
        flexDirection="row"
        gap={2}
        justifyContent="center"
        alignItems="start"
      >
        <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleClose} anchorOrigin =  { { vertical: 'top', horizontal: 'center' } }>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Actualizacion exitosa
          </Alert>
        </Snackbar>
        <Snackbar open={openDanger} autoHideDuration={3000} onClose={handleClose} anchorOrigin =  { { vertical: 'top', horizontal: 'center' } }>
          <Alert
            onClose={handleClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            Ups! Hubo un problema, vuelva a intentarlo o llame al interno
          </Alert>
        </Snackbar>
        <Grid item xs={12} sm={8} gap={2}>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* titulos */}
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" flexDirection="row" gap={1}>
                <Typography
                  variant="subtitle1"
                  component="h2"
                >{`Ticket Nro:`}</Typography>
                <Typography variant="h1" component="h1">
                  {ticket.ticketId}
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{ width: "auto", padding: 1, margin: 2 }}
                onClick={finishTicket}
              >
                Finalizar ticket
              </Button>
            </Box>
            <Box display="flex" flexDirection="row" gap={2}>
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2">Problema:</Typography>
                <TextField
                  id="outlined-multiline-static"
                  disabled
                  multiline
                  rows={3}
                  value={ticket.summary}
                />
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2">Descripción:</Typography>
                <TextField
                  id="outlined-multiline-static"
                  disabled
                  multiline
                  rows={3}
                  value={ticket.detail}
                />
              </Box>
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Typography variant="subtitle2">Diagnostico:</Typography>
                <TextField
                  id="outlined-multiline-static"
                  disabled={
                    user?.role != "admin" ||
                    ticket.diagnostic.observation == null
                  }
                  multiline
                  rows={3}
                  value={newDiagnostic}
                  onChange={(e) => setNewDiagnostic(e.target.value)}
                />
                {user?.role == "admin" && !ticket.diagnostic.observation ? (
                  <Button onClick={addDiagnostic}>Agregar Diagnostico</Button>
                ) : null}
              </Box>
            </Box>
            {/* Descripción */}

            <Typography variant="subtitle2">Seguimiento:</Typography>
            <Box display="flex" flexDirection="row" gap={2}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps[ticketType].step.map((step) => (
                  <Step key={step.label}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {!ticket.finishBy && (
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="subtitle2" component="h2">
                    Fecha estimada de finalizacion:
                  </Typography>
                  {user?.role == "admin" && !ticket.finishBy ? (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        format="dd/MM/yyyy"
                        value={new Date(ticket?.estimatedFinish)}
                        onChange={handleDateChange}
                      />
                    </LocalizationProvider>
                  ) : (
                    <Typography variant="h1" component="h1">
                      {ticket.estimatedFinish &&
                        format(new Date(ticket.estimatedFinish), "dd/MM/yyyy")}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
            {ticket.images && ticket.images.length > 0 ? (
              <Typography variant="subtitle2" component="h2">
                No hay imagenes asociadas
              </Typography>
            ) : (
              <Typography variant="subtitle2" component="h2">
                No hay imagenes asociadas
              </Typography>
            )}
          </Box>
          {/* Comentarios */}
          <Box sx={{ mt: 3 }}>
            <Grid item xs={12} sm={12}>
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h1">Comentarios</Typography>
                <Paper
                  style={{ maxHeight: 200, overflow: "auto" }}
                  elevation={0}
                >
                  <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                    overflow="hidden"
                  >
                    {comments.map((comment) => (
                      <Card
                        sx={{ maxWidth: 545, width: 400, height: 120 }}
                        key={format(
                          new Date(comment.createdAt),
                          "dd/MM/yyyy HH:mm:ss"
                        )}
                      >
                        <CardHeader
                          avatar={
                            <Avatar {...stringAvatar(comment.user, 35)} />
                          }
                          title={comment.user}
                          subheader={format(
                            new Date(comment.createdAt),
                            "dd/MM/yyyy HH:mm"
                          )}
                        />
                        <Divider variant="middle" />
                        <CardActions>
                          <Typography variant="body2" color="text.secondary">
                            {comment.comment}
                          </Typography>
                        </CardActions>
                      </Card>
                    ))}
                  </Stack>
                </Paper>
                <Divider variant="middle" />
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems={"center"}
                  gap={2}
                >
                  <TextField
                    label="Agregar comentario"
                    multiline
                    rows={2}
                    fullWidth
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={addComment}>Agregar Comentario</Button>
                </Box>
              </Box>
            </Grid>
          </Box>
        </Grid>
        {/*Sector lateral*/}
        <Box width={400} display="flex" flexDirection="column" gap={5}>
          <Paper elevation={6}>
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={6}
              paddingBottom={3}
              paddingTop={3}
              paddingLeft={4}
            >
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="subtitle2" component="h2">
                  Estado:
                </Typography>
                {user?.role == "admin" && !ticket.finishBy ? (
                  <Select
                    value={updatedStatus}
                    defaultValue={ticket.status}
                    onChange={handleStatusChange}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {status.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Typography
                    variant="h1"
                    component="h1"
                    paddingLeft={sideSeparation}
                  >
                    {ticket.status}
                  </Typography>
                )}
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="subtitle2" component="h2">
                  Prioridad
                </Typography>
                {user?.role == "admin" && !ticket.finishBy ? (
                  <Select
                    value={updatedPriority}
                    defaultValue={ticket.priority}
                    onChange={handlePriorityChange}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value={"ALTA"}>Alta</MenuItem>
                    <MenuItem value={"MEDIA"}>Media</MenuItem>
                    <MenuItem value={"BAJA"}>Baja</MenuItem>
                  </Select>
                ) : (
                  <Typography
                    variant="h1"
                    component="h1"
                    paddingLeft={sideSeparation}
                  >
                    {ticket?.priority}
                  </Typography>
                )}
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="subtitle2" component="h2">
                  Creado el:
                </Typography>
                <Typography
                  variant="h1"
                  component="h1"
                  paddingLeft={sideSeparation}
                >
                  {format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm")}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="subtitle2" component="h2">
                  Finalizado el:
                </Typography>
                <Typography
                  variant="h1"
                  component="h1"
                  paddingLeft={sideSeparation}
                >
                  {ticket.finishAt
                    ? format(new Date(ticket.finishAt), "dd/MM/yyyy HH:mm")
                    : "-"}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="subtitle2" component="h2">
                  Reportado por:
                </Typography>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems={"center"}
                  gap={1}
                  paddingLeft={sideSeparation}
                >
                  <Avatar {...stringAvatar(ticket.user, 50)} />
                  <Typography variant="h1" component="h1">
                    {ticket.user}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="subtitle2" component="h2">
                  Assignado a:
                </Typography>
                {user?.role == "admin" && !ticket.finishBy ? (
                  <Select
                    value={updatedAssigned}
                    defaultValue={updatedAssigned}
                    onChange={handleAssignedChange}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {person.map((person) => (
                      <MenuItem key={person} value={person}>
                        {person}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <>
                    {ticket.assignedTo ? (
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems={"center"}
                        gap={1}
                        paddingLeft={sideSeparation}
                      >
                        <Avatar {...stringAvatar(ticket.assignedTo, 50)} />
                        <Typography variant="h1" component="h1">
                          {ticket.assignedTo}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography
                        variant="h1"
                        component="h1"
                        paddingLeft={sideSeparation}
                      >
                        -
                      </Typography>
                    )}
                  </>
                )}
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="subtitle2" component="h2">
                  Equipo asociado
                </Typography>
                <Typography
                  variant="h1"
                  component="h1"
                  paddingLeft={sideSeparation}
                >
                  {ticket.equipId}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </ShopLayout>
  );
};
export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  let ticketId = query.ticketId;

  if (Array.isArray(ticketId)) {
    ticketId = ticketId[0];
  }

  const ticket = await dbTickets.getTicketByTicketId(ticketId);
  const session = await getSession({ req });
  const user = await getUserData(session.user.email);

  delete user._id;

  if (ticket.finishBy){
    return {
        redirect: {
            destination: `/ticket/${ticketId}`,
            permanent: false,
        }
    }
  }
  return {
    props: {
      ticket,
      user,
    },
  };
};

export default TicketPage;

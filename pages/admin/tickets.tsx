import { signIn, getSession, getProviders } from 'next-auth/react';

import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { UiContext, AuthContext } from "../../context";
import Cookies from 'js-cookie';
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import StepContent from "@mui/material/StepContent";
import useSWR from "swr";
import Typography from "@mui/material/Typography";
import { Ticket } from "../../models";
import EditIcon from "@mui/icons-material/Edit";
import { GetServerSideProps } from "next";
import { useForm } from "react-hook-form";
import { TheTable } from "../../components/table";
import StepLabel from "@mui/material/StepLabel";
import {
  ChangeEvent,
  FC,
  useEffect,
  useRef,
  useState,
} from "react";
import { ColumnDef } from "@tanstack/react-table";
import { tesloApi } from "../../api";
import { format } from "date-fns";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import {
  Box,
  Button,
  Stack,
  Chip,
  Card,
  CardActions,
  CardMedia,
  FormLabel,
  Grid,
  TextField,
} from "@mui/material";
import { AddOutlined, UploadOutlined } from "@mui/icons-material";

import {validLocations}  from '../../utils/validLocations';


import { AdminLayout } from "../../components/layouts";
import { ITicket , IUser} from "../../interfaces";

import { getUserData } from '../../database/dbUsers';
import { getTicketsByLocation } from '../../database/dbTickets';

const steps = [
  {
    label: "Datos principales",
  },
  {
    label: "Tipo de solicitud",
  },
  {
    label: "Datos adicionales",
  },
];

const validSolicitud = [
  {
    value: "TRASLADO",
    label: "TRASLADO",
  },
  {
    value: "REPARACION",
    label: "REPARACION",
  },
];

interface FormData {
  _id?: string;
  ticketId: string;
  images: string[];
  summary: string;
  detail: string;
  user: string;
  assignedTo: string;
  location: string;
  sector: string;
  equipId: string;
  type: string;
  comments: {
    user: string;
    comment: string;
    createdAt: Date;
  }[];
}

interface Props {
  ticket: ITicket;
  userData: IUser;
  filteredTicketJSON: string;
}


const cols: ColumnDef<ITicket>[] = [
  {
    accessorKey: "ticketId",
    header: () => "Ticket ID",
    footer: (props) => props.column.id,
    meta: {
      align: "center",
    },
  },
  {
    accessorKey: "createdAt",
    header: () => "Creado el",
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm");
    },
    meta: {
      align: "center",
    },
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "user",
    header: () => "Solicitante",
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "summary",
    header: () => "Descripcion",
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "status",
    header: () => "Estado",
    cell: ({ row }) => {
      return (
        <Chip label={row.original.status} color={row.original.status.toUpperCase()=="FINALIZADO"?"success":"warning"} variant="filled" />
      );
    },
    meta: {
      align: "center",
    },
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "location",
    header: () => "Servicio",
    meta: {
      align: "center",
    },
    footer: (props) => props.column.id,
  },
  {
    header: "Acciones",
    columns: [
      {
        id: "_id",
        cell: ({ row }) => (
          
          <Stack direction="row">
            <IconButton href={`/admin/tickets/${row.original.ticketId}`}>
              <EditIcon />
            </IconButton>
            <IconButton href={`/ticket/${row.original.ticketId}`}>
              <VisibilityIcon />
            </IconButton>
          </Stack>
        ),
        footer: (props) => props.column.id,
      },
    ],
  },
];

const TicketsPage: FC<Props> = ({ ticket , userData, filteredTicketJSON  }) => {
  const allTickets: ITicket[] = JSON.parse(filteredTicketJSON);
  const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
    defaultValues: {
      ...ticket
    },
  });

  const [open, setOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 2;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const location = watch("location"); // Obtener el valor del sector seleccionado

  useEffect(() => {
    setValue("location", location, { shouldValidate: true }); // Set the location value immediately
    const sectorTicketCount = (allTickets || []).filter(
      (ticket) => ticket.location === location
    ).length;

    const selectedLocation = validLocations.find(
      (option) => option.value === location
    );
    const locationAbreviation = selectedLocation
      ? selectedLocation.abreviation
      : "";

    const newTicketNumber = (sectorTicketCount + 1).toString().padStart(4, "0");
    const newTicketId = `${locationAbreviation}-${newTicketNumber}`;

    setValue("ticketId", newTicketId, { shouldValidate: true }); // Update the ID using the calculated value
  }, [location, setValue]);



  const onFilesSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }

    try {
      for (const file of target.files) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await tesloApi.post<{ message: string }>(
          "/admin/upload",
          formData
        );
        setValue("images", [...getValues("images"), data.message], {
          shouldValidate: true,
        });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const onDeleteImage = (image: string) => {
    setValue(
      "images",
      getValues("images").filter((img) => img !== image),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (form: FormData) => {
    setIsSaving(true);
    setOpen(false);
    setActiveStep(0);
    try {
      const { data } = await tesloApi({
        url: "/admin/tickets",
        method: form._id ? "PUT" : "POST", // si tenemos un _id, entonces actualizar, si no crear
        data: form,
      });

     
      if (!form._id) {
        await fetch('/api/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }


     window.location.reload();
    } catch (error) {
      console.log(error);
      setIsSaving(false);
      <Alert severity="error">Ups! Hubo un problema</Alert>;
      
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    <Alert severity="success">Su ticket a sido creado exitosamente</Alert>;
  };

  return (
    
    <AdminLayout
      title={"Tickets"}
      subTitle={"Historial"}
      icon={<ConfirmationNumberOutlined />}
    >
       
      <Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          onClick={handleClickOpen}
        >
          Crear ticket
        </Button>
      </Box>
      <Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <TheTable data={allTickets} columns={cols} />
        </Grid>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Crear Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </DialogContentText>

          <form onSubmit={handleSubmit(onSubmit)}>
            {activeStep == 0 ? (
              <>
                <TextField
                  label="Solicitante"
                  variant="standard"
                  fullWidth
                  value={userData.name || ''}
                  sx={{ mb: 1 }}
                  {...register("user", {
                    required: "Este campo es requerido",
                  })}
                  error={!!errors.user}
                  helperText={errors.user?.message}
                />
                <TextField
                  select
                  label="Sector"
                  defaultValue=""
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 1 }}
                  {...register("location")}
                >
                  {validLocations.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Ubicacion"
                  defaultValue=""
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 1 }}
                  {...register("sector")}
                />
              </>
            ) : null}

            {activeStep == 1 ? (
              <>
                <TextField
                  select
                  label="Tipo"
                  variant="outlined"
                  fullWidth
                  multiline
                  sx={{ mb: 1 }}
                  {...register("type", {
                    required: "Este campo es requerido",
                  })}
                  error={!!errors.type}
                  helperText={errors.type?.message}
                >
                  {validSolicitud.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            ) : null}

            {activeStep == 2 ? (
              <>
                <TextField
                  label="Resumen"
                  variant="outlined"
                  fullWidth
                  multiline
                  sx={{ mb: 1 }}
                  {...register("summary", {
                    required: "Este campo es requerido",
                  })}
                  error={!!errors.summary}
                  helperText={errors.summary?.message}
                />

                <TextField
                  label="Detalle"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mb: 1 }}
                  {...register("detail", {
                    required: "Este campo es requerido",
                  })}
                  error={!!errors.detail}
                  helperText={errors.detail?.message}
                />

                <TextField
                  label="Codigo IC"
                  variant="outlined"
                  //disabled={ticket._id?false:true}
                  fullWidth
                  multiline
                  sx={{ mb: 1 }}
                  {...register("equipId")}
                  error={!!errors.equipId}
                  helperText={errors.equipId?.message}
                />
                <Box display="flex" flexDirection="column">
                  <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
                  <Button
                    color="secondary"
                    fullWidth
                    startIcon={<UploadOutlined />}
                    sx={{ mb: 3 }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Cargar imagen
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/png, image/gif, image/jpeg"
                    style={{ display: "none" }}
                    onChange={onFilesSelected}
                  />

                  <Grid container spacing={2}>
                    {getValues("images").map((img) => (
                      <Grid item xs={4} sm={3} key={img}>
                        <Card>
                          <CardMedia
                            component="img"
                            className="fadeIn"
                            image={img}
                            alt={img}
                          />
                          <CardActions>
                            <Button
                              fullWidth
                              color="error"
                              onClick={() => onDeleteImage(img)}
                            >
                              Borrar
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </>
            ) : null}
            {
              <React.Fragment>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Atras
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  {isStepOptional(activeStep) &&
                    activeStep !== steps.length - 1 && (
                      <Button
                        color="inherit"
                        onClick={handleSkip}
                        sx={{ mr: 1 }}
                      >
                        Skip
                      </Button>
                    )}

                  {activeStep === steps.length - 1 ? (
                    <Button color="secondary" type="submit" disabled={isSaving}>
                      Guardar
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>Siguiente</Button>
                  )}
                </Box>
              </React.Fragment>
            }
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({query,req}) => {

  let ticket: ITicket | null;

  const session = await getSession({ req });
  const userData = await getUserData(session.user.email)
  const filteredTicket = await getTicketsByLocation(userData.locations)
  const tempTicket = JSON.parse(JSON.stringify(new Ticket()));
  delete tempTicket._id;

  delete userData._id;
  for (let i = 0; i < filteredTicket.length; i++) {
    delete filteredTicket[i]._id;
  }
  const filteredTicketJSON = JSON.stringify(filteredTicket);
  ticket = tempTicket;

  return {
    props: {
      ticket,
      userData,
      filteredTicketJSON
    },
  };
};

export default TicketsPage;

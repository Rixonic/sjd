import { ChangeEvent, FC, useEffect, useRef, useState, useContext } from 'react';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

import { Box, Button, Typography, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';


import { AdminLayout } from '../../../components/layouts'
import { ITicket } from '../../../interfaces';
import { dbTickets } from '../../../database';
import { tesloApi } from '../../../api';
import { Ticket } from '../../../models';
import { AuthContext } from '../../../context';


const serialNumber = [
    {serial: '13469-11-119-0290'},
    {serial: '13669-11-119-0543'},
    {serial: '13469-21-113-0341'},
    {serial: '13439-11-119-0090'},
    {serial: '13649-11-119-0423'},
    {serial: '12369-21-113-0112'},
]

const validLocations = [
    {
      value: 'NEONATOLOGIA',
      label: 'NEONATOLOGIA',
      abreviation: 'NEO',
    },
    {
      value: 'UTI',
      label: 'UTI',
      abreviation: 'UTI',
    },
    {
      value: 'QUIROFANO',
      label: 'QUIROFANO',
      abreviation: 'QX',
    },
    {
      value: 'ENFERMERIA',
      label: 'ENFERMERIA',
      abreviation: 'ENF',
    },
    {
        value: 'INTERNACION',
        label: 'INTERNACION',
        abreviation: 'INT',
      },
      {
        value: 'CONSULTORIOS',
        label: 'CONSULTORIOS',
        abreviation: 'CON',
      },
      {
        value: 'ENDOSCOPIA',
        label: 'ENDOSCOPIA',
        abreviation: 'END',
      },
      {
        value: 'HEMODINAMIA',
        label: 'HEMODINAMIA',
        abreviation: 'HEM',
      },
      {
        value: 'IMAGENES',
        label: 'IMAGENES',
        abreviation: 'IMG',
      },
      {
        value: 'INGENIERIA',
        label: 'INGENIERIA',
        abreviation: 'ING',
      },
  ];

interface IComment{
    user : string;
    commentary: string;
    dateTime: string;
}

interface FormData {
    _id?       : string;
    ticketId       : string;
    images     : string[];
    summary: string;
    detail      : string;
    user       : string;
    assignedTo     : string;
    location : string;
    equipId     : string;
   // diagnostic     : string;
    comment      : IComment[];


}

interface Props {
    ticket: ITicket;
}

const TicketAdminPage:FC<Props> = ({ ticket }) => {

    const [selectedSerial, setSelectedSerial] = useState<string>('');

    const [newComment, setNewComment] = useState<IComment>({
        user: '', // Puedes establecer el usuario automáticamente o dejarlo en blanco
        commentary: '',
        dateTime: '',
      });

    const router = useRouter();
    const { data: session } = useSession();

    const { user, isLoggedIn, logout } = useContext(AuthContext);

    const { data, error } = useSWR<ITicket[]>('/api/admin/tickets');  
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [ newTagValue, setNewTagValue ] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const incrementalId = data?.length;
    const userName = user?.name;

    const { register, handleSubmit, formState:{ errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: {
            ...ticket,
            user: user?.name || '',
        }
    });


    useEffect(() => {
      const subscription = watch(( value, { name, type } ) => {
          if ( name === 'location' ) {
              const newTicketId = value.location; 

               setValue('ticketId', newTicketId + '-' + incrementalId + 1);
          }
      });
      return () => subscription.unsubscribe();
    }, [watch, setValue])
    
    const onFilesSelected = async({ target }: ChangeEvent<HTMLInputElement>) => {
        if ( !target.files || target.files.length === 0 ) {
            return;
        }

        try {
            
            // console.log( file );
            for( const file of target.files ) {
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await tesloApi.post<{ message: string}>('/admin/upload', formData);
                setValue('images', [...getValues('images'), data.message], { shouldValidate: true });
            }


        } catch (error) {
            console.log({ error });
        }
    }

    const onDeleteImage = ( image: string) =>{
        setValue(
            'images', 
            getValues('images').filter( img => img !== image ),
            { shouldValidate: true }
        );
    }

    const addComment = () => {

        // Copia el array existente de comentarios y agrega el nuevo comentario al final
        setValue('comment', [...getValues('comment'), newComment], {
          shouldValidate: true,
        });
    
        // Limpia el estado local para el próximo comentario
        setNewComment({
            user: user?.name || '', // Puedes establecer el usuario automáticamente o dejarlo en blanco
          commentary: '',
          dateTime: new Date().toISOString(),
        });
      }

    const onSubmit = async( form: FormData ) => {
        
        //if ( form.images.length < 2 ) return alert('Mínimo 2 imagenes');
        setIsSaving(true);

        try {
            const { data } = await tesloApi({
                url: '/admin/tickets',
                method: form._id ? 'PUT': 'POST',  // si tenemos un _id, entonces actualizar, si no crear
                data: form
            });

            console.log({data});
            if ( !form._id ) {
                router.replace(`/admin/tickets/${ form.ticketId }`);
            } else {
                setIsSaving(false)
            }


        } catch (error) {
            console.log(error);
            setIsSaving(false);
        }

    }

    return (

        
        <AdminLayout 
            title={'Ticket'} 
            subTitle={`Editando: `}
            icon={ <DriveFileRenameOutline /> }
        >

            {ticket._id?(
                <Grid container spacing={12}>

                    <Grid item xs={12} sm={ 6 }>
                        <Typography variant='subtitle1' component='h2'>Solicitante:</Typography>
                        <Typography variant='h1' component='h1'>{ `${ticket.ticketId}` }</Typography>
                        <Divider></Divider>
                        <Typography variant='subtitle1' component='h2'>Servicio:</Typography>
                        <Typography variant='h1' component='h1'>{ `${ticket.location}` }</Typography>
                        <Divider></Divider>
                        <Typography variant='subtitle1' component='h2'>Creado por:</Typography>
                        <Typography variant='h1' component='h1'>{ `${ticket.user}` }</Typography>
                        <Divider></Divider>
                    </Grid>    
                    <Grid item xs={12} sm={ 6 }>
                    <Typography variant='subtitle1' component='h2'>Asunto:</Typography>
                        <Typography variant='h1' component='h1'>{ `${ticket.summary}` }</Typography>
                        <Divider></Divider>
                        <Typography variant='subtitle1' component='h2'>Problema reportado:</Typography>
                        <Typography variant='h1' component='h1'>{ `${ticket.detail}` }</Typography>
                        <Divider></Divider>
                        <Typography variant='subtitle1' component='h2'>Creado el:</Typography>
                        <Typography variant='h1' component='h1'>{ `${ticket.createdAt}` }</Typography>
                        <Divider></Divider>
                    </Grid>    
                    <Divider></Divider>
                    
                    <Grid item xs={12} sm={ 12 }>      
                    <form onSubmit={ handleSubmit( onSubmit ) }>
                        <Grid container spacing={2}>
                            {/* Data */}
                            <Grid item xs={12} sm={ 6 }>
                                <TextField
                                    label="Usuario"
                                    variant="standard"
                                    fullWidth
                                    value={newComment.user}
                                    onChange={(e) =>
                                    setNewComment({ ...newComment, user: e.target.value })
                                    }
                  // Resto de las validaciones y manejo de errores si es necesario
                                />
                <TextField
                  label="Comentario"
                  variant="standard"
                  fullWidth
                  value={newComment.commentary}
                  onChange={(e) =>
                    setNewComment({ ...newComment, commentary: e.target.value })
                  }
                  // Resto de las validaciones y manejo de errores si es necesario
                />
                            </Grid>
                    </Grid>

                
                    <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                            <Button 
                            color="secondary"
                            startIcon={ <SaveOutlined /> }
                            sx={{ width: '150px' }}
                            type="submit"
                            disabled={ isSaving }
                            >
                            Guardar
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                fullWidth
                                onClick={addComment} // Llamar a la función para agregar el comentario
                                >
                                Agregar Comentario
                            </Button>
                        </Box>
                


            </form>
            </Grid> 
                  
                </Grid>
            
            ):(
            <form onSubmit={ handleSubmit( onSubmit ) }>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button 
                        color="secondary"
                        startIcon={ <SaveOutlined /> }
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={ isSaving }
                        >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    
                    <Grid item xs={12} sm={ 6 }>

                        <TextField
                            label=""
                            variant='standard'
                            //disabled 
                            fullWidth
                            sx={{ mb: 1 }}
                            { ...register('ticketId', {
                                required: 'Este campo es requerido',
                                validate: (val) => val.trim().includes(' ') ? 'No puede tener espacios en blanco':undefined
                            })}
                            error={ !!errors.ticketId }
                            helperText={ errors.ticketId?.message }
                        />
                        

                        
                        <TextField
                            label="Resumen"
                            variant='outlined'
                            //disabled={ticket._id?false:true}
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('summary', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.summary }
                            helperText={ errors.summary?.message }
                        />

                        <TextField
                            label="Detalle"
                            variant='outlined'
                            //disabled={ticket._id?false:true}
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('detail', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.detail }
                            helperText={ errors.detail?.message }
                        />
                        
                        <TextField
                            label="Usuario"
                            variant='standard'
                            //disabled
                            fullWidth 
                            value={session?.user?.name || ''}
                            sx={{ mb: 1 }}
                            { ...register('user', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.user }
                            helperText={ errors.user?.message }
                        />

                        <Divider sx={{ my: 1 }} />



                    </Grid>

                    {/* Tags e imagenes */}


                    <Grid item xs={12} sm={ 6 }>
                        <TextField
                            label="Assignado a"
                            variant='outlined'
                            //disabled={ticket._id?false:true}
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('assignedTo', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.user }
                            helperText={ errors.user?.message }
                        />

                        <Divider sx={{ my: 2  }}/>
                        
                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb:1}}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={ <UploadOutlined /> }
                                sx={{ mb: 3 }}
                                onClick={ () => fileInputRef.current?.click() }
                            >
                                Cargar imagen
                            </Button>
                            <input 
                                ref={ fileInputRef }
                                type="file"
                                multiple
                                accept='image/png, image/gif, image/jpeg'
                                style={{ display: 'none' }}
                                onChange={ onFilesSelected }
                            />



                            <Grid container spacing={2}>{
                                getValues('images').map( img => (
                                    <Grid item xs={4} sm={3} key={img}>
                                        <Card>
                                            <CardMedia 
                                                component='img'
                                                className='fadeIn'
                                                image={ img }
                                                alt={ img }
                                            />
                                            <CardActions>
                                                <Button 
                                                    fullWidth 
                                                    color="error"
                                                    onClick={()=> onDeleteImage(img)}
                                                    >
                                                Borrar
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>
                        
                        <TextField
                            id="filled-select-currency"
                            select
                            label="Sector"
                            defaultValue=""
                            variant="filled"
                            sx={{ width: '250px' }}
                            >
                            {validLocations.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                            ))}
                        </TextField>
        <Autocomplete
        options={serialNumber.map((option) => option.serial)} // Pasar las opciones serialNumber
        value={selectedSerial}
        onChange={(event, newValue) => setSelectedSerial(newValue || '')} // Manejar el cambio de valor
        renderInput={(params) => (
          <TextField {...params} label="Codificacion equipo." variant="standard" />
        )}
      />



                    </Grid>
                    

                </Grid>

                


            </form>)}
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
    const { ticketId = ''} = query;
    
    let ticket: ITicket | null;

    if ( ticketId === 'new' ) {
        // crear un producto
        const tempTicket = JSON.parse( JSON.stringify( new Ticket() ) );
        delete tempTicket._id;

        ticket = tempTicket;

    } else {
        ticket = await dbTickets.getTicketByTicketId(ticketId.toString());
    }

    if ( !ticketId ) {
        return {
            redirect: {
                destination: '/admin/tickets',
                permanent: false,
            }
        }
    }
    

    return {
        props: {
            ticket
        }
    }
}


export default TicketAdminPage
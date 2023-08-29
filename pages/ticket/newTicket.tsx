import { ChangeEvent, FC, useEffect, useRef, useState, useContext } from 'react';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

import { Box, Button, Typography, Stack, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';


import { AdminLayout } from '../../components/layouts'
import { ITicket } from '../../interfaces';
import { dbTickets } from '../../database';
import { tesloApi } from '../../api';
import { Ticket } from '../../models';
import { AuthContext } from '../../context';


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
    const userName = session?.user?.name;

    const { register, handleSubmit, formState:{ errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: {
            ...ticket,
            user: session?.user?.name || '',
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
            user: session?.user?.name || '', // Puedes establecer el usuario automáticamente o dejarlo en blanco
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

    console.log(session)
    return (

        
        <AdminLayout 
            title={'Ticket'} 
            subTitle={`Nuevo ticket `}
            icon={ <DriveFileRenameOutline /> }
        >            
            <form onSubmit={ handleSubmit( onSubmit ) }>

                    <Stack
                        direction="row"
                        justifyContent="space-evenly"
                        alignItems="center"
                        spacing={2}
                    >
                    {/* Data */}
                    <Grid item xs={12} sm={ 6 }>

                        <TextField
                            label="ID"
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

                        <Divider sx={{ my: 3  }}/>

                        <TextField
                            label="Solicitante"
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
                        
                        </Grid>
                        <Grid item xs={12} sm={ 6 }>


                        


                        <Divider sx={{ my: 3  }}/>

                        <TextField
                            label="Detalle"
                            variant='outlined'
                            //disabled={ticket._id?false:true}
                            fullWidth 
                            multiline
                            rows={4}
                            maxRows={6}
                            sx={{ mb: 1 }}
                            { ...register('detail', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.detail }
                            helperText={ errors.detail?.message }
                        />
                        
                        <Divider sx={{ my: 3  }}/>


                    {/* Tags e imagenes */}

                        <Divider sx={{ my: 3  }}/>
                        
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
          <TextField {...params} label="ID del equipo" variant="standard" />
        )}
      />



                    </Grid>
                    

                </Stack>

                
                <Box display='flex' justifyContent='center' sx={{ mb: 1 }}>
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

            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
    const { ticketId = ''} = query;
    
    let ticket: ITicket | null;

        const tempTicket = JSON.parse( JSON.stringify( new Ticket() ) );
        delete tempTicket._id;

        ticket = tempTicket;
    

    return {
        props: {
            ticket
        }
    }
}


export default TicketAdminPage
import { ChangeEvent, FC, useEffect, useRef, useState, useContext } from 'react';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';

import { AdminLayout } from '../../../components/layouts'
import { ITicket } from '../../../interfaces';
import { dbTickets } from '../../../database';
import { tesloApi } from '../../../api';
import { Ticket } from '../../../models';
import { AuthContext } from '../../../context';

const validLocation = ['QUIROFANO','NEONATOLOGIA','UTI','ENFERMERIA','CONSULTORIOS']

interface IComment{
    user : string;
    commentary: string;
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
    //equip     : string;
   // diagnostic     : string;
    comment      : IComment[];


}




interface Props {
    ticket: ITicket;
}

const TicketAdminPage:FC<Props> = ({ ticket }) => {

    const router = useRouter();


    const { user, isLoggedIn, logout } = useContext(  AuthContext );

    const { data, error } = useSWR<ITicket[]>('/api/admin/tickets');  
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [ newTagValue, setNewTagValue ] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const incrementalId = data?.length;
    const userName = user?.name;

    const { register, handleSubmit, formState:{ errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: ticket
    })


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
                            label="Summary/Resumen"
                            variant={ticket._id?'outlined':'standard'}
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
                            variant={ticket._id?'outlined':'standard'}
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
                            value={user?.name}
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

                    <FormControl sx={{ mb: 1 }}>
                        
                            <FormLabel>Location</FormLabel>
                            
                            <RadioGroup
                                row
                                value={ getValues('location') }
                                onChange={ ({ target })=> setValue('location', target.value, { shouldValidate: true }) }
                            >
                                {
                                    validLocation.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                    <Grid item xs={12} sm={ 6 }>
                        <TextField
                            label="Assignado a"
                            variant={ticket._id?'outlined':'standard'}
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



                            <Grid container spacing={2}>
                                {
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

                    </Grid>

                </Grid>

                


            </form>
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
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { db } from '../../../database';
import { Link,Box,MenuItem, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined, AddOutlined} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import { AdminLayout } from '../../../components/layouts'
import { IDosimeter } from '../../../interfaces';
import { dbDosimeters } from '../../../database';
import { tesloApi } from '../../../api';
import { Dosimeter } from '../../../models';


const validLocation = ['HEMODINAMIA','IMAGENES']
const validHeadquarter = ['CASTELAR','RAMOS MEJIA']
const validCriticalType = ['CRITICO','NO CRITICO']

const currencies = [
    {
      value: 'RADIOLOGIA',
      label: 'Radiologia',
    },
    {
      value: 'HEMODINAMIA',
      label: 'Hemodinamia',
    },
    {
      value: 'MAMOGRAFIA',
      label: 'Mamografia',
    },
    {
      value: 'TOMOGRAFIA',
      label: 'Tomografia',
    },
  ];

interface FormData {
    _id?        : string;
    //id          : Number;
    month       : Number;
    year        : Number;
    headquarter : string;   
    service     : string;
    document    : string;
    location    : string;
}


interface Props {
    dosimeter: IDosimeter;
}

const DosimeterAdminPage:FC<Props> = ({ dosimeter }) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; 


    const { register, handleSubmit, formState:{ errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: {
            ...dosimeter,
            year: currentYear,  // Autollenar el campo "year" con el año actual
            month: currentMonth,
        },
    });

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null)
    //const [ newTagValue, setNewTagValue ] = useState('');
    const [isSaving, setIsSaving] = useState(false);


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
                setValue('document', data.message , { shouldValidate: true });
            }


        } catch (error) {
            console.log({ error });
        }
    }

    const onDeleteImage = ( ) =>{
        setValue('document', '', { shouldValidate: true });
    }



    const onSubmit = async( form: FormData ) => {
        
        //if ( form.images.length < 2 ) return alert('Mínimo 2 imagenes');    //modificar?
        setIsSaving(true);      
        try {
            const { data } = await tesloApi({
                url: '/admin/dosimeters',
                method: 'POST',  // si tenemos un _id, entonces actualizar, si no crear
                data: form
            });

            //console.log({data});
            if ( !form._id ) {
                router.replace(`/admin/dosimeters`);
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
            title={'Dosimetro'} 
            subTitle={'Agregar dosimetro'}
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
                            label="Año"
                            type='number'
                            //disabled
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('year', {
                                required: 'Este campo es requerido',
                                minLength: { value: 1, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.year }

                        />
                    <Divider sx={{ my: 1 }} />
                        <TextField
                            label="Mes"
                            type='number'
                            //disabled
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('month', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.month }
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Sede</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('headquarter') }
                                onChange={ ({ target })=> setValue('headquarter', target.value, { shouldValidate: true }) }
                            >
                                {
                                    validHeadquarter.map( option => (
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
                        <Divider sx={{ my: 1 }} />
                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Servicio</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('service') }
                                onChange={ ({ target })=> setValue('service', target.value, { shouldValidate: true }) }
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
                        <Divider sx={{ my: 1 }} />
                        <TextField
                            label="Sector"
                    
                            //variant="filled"
                            fullWidth 
                            multiline
                            select
                            SelectProps={{
                                native: true,
                            }}
                            sx={{ mb: 1 }}
                            { ...register('location', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.month }
                        >
          {currencies.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          </TextField>
                       
                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={ 6 }>
                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb:1}}>Documento</FormLabel>
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
                                //accept='image/png, image/gif, image/jpeg'
                                style={{ display: 'none' }}
                                onChange={ onFilesSelected }
                            />
                            
                            <Chip 
                                label="Es necesario cargar 1 documento"
                                color='error'
                                variant='outlined'
                                sx={{ display: getValues('document').length < 1 ? 'flex': 'none' }}
                            />
                            
                            <Grid container spacing={2}>
                                {
                                    getValues('document') && (
                                        <Grid item xs={4} sm={3}>
                                            <Card>
                                            
                                                <CardActions>
                                                    <Button 
                                                        fullWidth 
                                                        color="error"
                                                        onClick={()=> onDeleteImage()}
                                                    >
                                                        Borrar
                                                    </Button>
                                                    
                                                </CardActions>
                                                <a
                                                    href={getValues('document')}
                                                    target="_blank" // Abre el enlace en una nueva pestaña
                                                    rel="noopener noreferrer" // Recomendado para la seguridad
                                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                                    >
                                                <Button fullWidth color="secondary">
                                                    Ver
                                                </Button>
                                                </a>
                                            </Card>
                                        </Grid>
                                    )
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
    

    // Crear un dosímetro nuevo
    const tempDosimeter: IDosimeter = {
        //_id: '', // Dejar vacío para que se genere automáticamente en la creación
        month: 1, // Valores predeterminados para un nuevo dosímetro
        year: 2023,
        headquarter: '',
        service: '',
        document: '',
        location: '',
    };

    
    return {
        props: {
            dosimeter: tempDosimeter
        }
    }
}


export default DosimeterAdminPage
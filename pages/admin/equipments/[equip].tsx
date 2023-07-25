import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { db } from '../../../database';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';

import { AdminLayout } from '../../../components/layouts'
import { IEquipment } from '../../../interfaces';
import { dbEquipments } from '../../../database';
import { tesloApi } from '../../../api';
import { Equipment } from '../../../models';


const validLocation = ['QUIROFANO','ENDOSCOPIA','HEMODINAMIA','ENFERMERIA','NEONATOLOGIA','CONSULTORIOS']
const validHeadquarter = ['CASTELAR','RAMOS MEJIA']
const validCriticalType = ['CRITICO','NO CRITICO']


interface FormData {
    _id?: string;
    equip: string;
    equipmentId: string;
    model: string;
    brand: string;
    sector: string;
    locations: string;
    headquarter: string;
    images: string[];
    ecri: string;
    serialNumber: string;
    criticalType: string;
}


interface Props {
    equipment: IEquipment;
}

const EquipmentAdminPage:FC<Props> = ({ equipment }) => {

        
    
    
  //  const incrementalId =  data?.length 

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null)
    //const [ newTagValue, setNewTagValue ] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, formState:{ errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: equipment
    })

/*
    useEffect(() => {
      const subscription = watch(( value, { name, type } ) => {
          if ( name === 'equip' ) {
              const newEquip = value.equip?.trim()
                    .replaceAll(' ', '_')
                    .replaceAll("'", '')
                    .toLocaleLowerCase() || '';

               setValue('equip', newEquip);
          }
      });
      return () => subscription.unsubscribe();
    }, [watch, setValue])
    

    //revisar cambios
    const onChangeLocation = ( location: string ) => {
        const currentLocations = getValues('locations');
        if ( currentLocations.includes( location ) ) {
            return setValue('locations', currentLocations.filter( l => l !== location ), { shouldValidate: true } );
        }

        setValue('locations', [ ...currentLocations, location ], { shouldValidate: true });

    }
*/
/*
    const onNewTag = () => {
        const newTag = newTagValue.trim().toLocaleLowerCase();
        setNewTagValue('');
        const currentTags = getValues('tags');

        if ( currentTags.includes(newTag) ) {
            return;
        }

        currentTags.push(newTag);
    }
*/
/*
    const onDeleteTag = ( tag: string ) => {
        const updatedTags = getValues('tags').filter( t => t !== tag );
        setValue('tags', updatedTags, { shouldValidate: true });
    }
*/
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
        
        //if ( form.images.length < 2 ) return alert('Mínimo 2 imagenes');    //modificar?
        setIsSaving(true);                                                  

        try {
            const { data } = await tesloApi({
                url: '/admin/equipments',
                method: form._id ? 'PUT': 'POST',  // si tenemos un _id, entonces actualizar, si no crear
                data: form
            });

            console.log({data});
            if ( !form._id ) {
                router.replace(`/admin/equipments/${ form.equip }`);
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
            title={'Equipo'} 
            subTitle={equipment._id?'Editar':`Equipo nuevo`}
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
                            label="ID"
                            type='string'
                            disabled

                            //variant="filled"
                            
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('equip', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.equipmentId }
                            helperText={ errors.equipmentId?.message }
                        />

                        <TextField
                            label="Equipo"
                            //variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('equipmentId', {
                                required: 'Este campo es requerido',
                                minLength: { value: 1, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.equip }
                            helperText={ errors.equip?.message }
                        />

                        <TextField
                            label="Serie"
                            type='number'
                            //variant="filled"
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('serialNumber', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.serialNumber }
                            helperText={ errors.serialNumber?.message }
                        />
                        


                        <TextField
                            label="Modelo"
                            //variant="filled"
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('model', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.model }
                            helperText={ errors.model?.message }
                        />

                        <TextField
                            label="Marca"
                            //variant="filled"
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('brand', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.brand }
                            helperText={ errors.brand?.message }
                        />

                        <TextField
                            label="ECRI"
                            //variant="filled"
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('ecri', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.brand }
                            helperText={ errors.brand?.message }
                        />

                        <TextField
                            label="Sector"
                            //variant="filled"
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('sector', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.sector }
                            helperText={ errors.sector?.message }
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Criticidad</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('criticalType') }
                                onChange={ ({ target })=> setValue('criticalType', target.value, { shouldValidate: true }) }
                            >
                                {
                                    validCriticalType.map( option => (
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

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Sede</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('locations') }
                                onChange={ ({ target })=> setValue('locations', target.value, { shouldValidate: true }) }
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

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={ 6 }>

                        
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

                            
                            <Chip 
                                label="Es necesario al 2 imagenes"
                                color='error'
                                variant='outlined'
                                sx={{ display: getValues('images').length < 0 ? 'flex': 'none' }}
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
    
    const { equip = ''} = query;
    
    let equipment: IEquipment | null;

   // const { data, error } = useSWR<IEquipment[]>('/api/admin/equipments');  

    if ( equip === 'new' ) {
        // crear un producto\
        
        const tempEquipment = JSON.parse( JSON.stringify( new Equipment() ) );
        delete tempEquipment._id;
        //tempEquipment.images = ['img1.jpg','img2.jpg'];  
        //tempEquipment.equip = data!.length
        
        equipment = tempEquipment;
        await db.connect();
        equipment.equip = (await Equipment.count() + 1).toString()
        await db.disconnect();

    } else {
        equipment = await dbEquipments.getEquipmentByEquip(equip.toString());
    }

    if ( !equipment ) {
        return {
            redirect: {
                destination: '/admin/equipments',
                permanent: false,
            }
        }
    }
    

    return {
        props: {
            equipment
        }
    }
}


export default EquipmentAdminPage
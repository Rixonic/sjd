import NextLink from 'next/link';
import React, {useContext, HTMLAttributes, HTMLProps , useState, useEffect} from 'react'
import { Box, Typography, Stack, Grid} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AdminLayout } from '../components/layouts'
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';




const EquipmentsPage = () =>  {  


  return (

    <AdminLayout 
        title={''} 
        subTitle={''}

    >
      <Stack    direction="row"
  justifyContent="space-evenly"
  alignItems="center"
  spacing={3}
  sx={{ minHeight: '50vh' }}
  > 
      <Card 
      sx={{ width: 400  , height:320, boxShadow: 2}}
      >

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Equipamiento Medico
        </Typography>
        <AccessibleForwardIcon style={{ fontSize: 150 }} />
        <Typography variant="body2" color="text.secondary">
            Acceso al inventario del equipamiento medico 
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent:"space-evenly"}}>
        <Button variant="outlined" href="/equipamiento" color="primary" size="large" >Ir a</Button>
      </CardActions>
    </Card>
    
    <Card sx={{ width: 400 , height:320}}>

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Dosimetros
        </Typography>
        <AccessibleForwardIcon style={{ fontSize: 150 }} />
        <Typography variant="body2" color="text.secondary">
          Acceso al registro de oximetria mensual
        </Typography>
      </CardContent>
      

        <CardActions sx={{ justifyContent:"space-evenly"}} >
        <Button variant="outlined" href="/dosimetros" color="primary"  size="large">Ir a</Button>
        </CardActions> 

        
      
    </Card>
    
    </Stack>
        
        
        
    </AdminLayout>


  )
}


export default EquipmentsPage;
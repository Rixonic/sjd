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
      sx={{ width: 400  , height:320, boxShadow: 3, display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent:'space-evenly'}}
      >

      <CardContent
      sx={{ display: 'flex', flexDirection: 'column', alignItems:'center'}}>
        <Typography gutterBottom variant="h5"  >
          Equipamiento Medico
        </Typography>
        <CardMedia
        component="img"
        sx={{ width: 100 , marginBottom: 3, marginTop:1}}
        image="https://res.cloudinary.com/dlwkur7zi/image/upload/w9l9sefnvzozeltl2c4g.png"
        title="resonador"
      />
        <Typography variant="body2" color="text.secondary">
            Acceso al inventario del equipamiento medico 
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent:"space-evenly"}}>
        <Button variant="outlined" href="/equipamiento" color="primary" size="large" >Ir a</Button>
      </CardActions>
    </Card>
    
    <Card sx={{ width: 400  , height:320, boxShadow: 3, display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent:'space-evenly'}}>

      <CardContent 
      sx={{ display: 'flex', flexDirection: 'column', alignItems:'center'}}>
        <Typography gutterBottom variant="h5" component="div">
          Dosimetros
        </Typography>
        <CardMedia
        component="img"
        sx={{  width: 120, marginBottom: 3, marginTop:1}}
        image="https://res.cloudinary.com/dlwkur7zi/image/upload/v1692286436/uq2elsqqm3xrn6hp1gyg.png"
        title="green iguana"
      />
        <Typography variant="body2" color="text.secondary">
          Acceso al informe mensual de dosimetria
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

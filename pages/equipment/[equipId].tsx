import React from 'react'
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';    //Queda
import { useRouter } from 'next/router';       
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';                                         //Queda
import { Box, Button, Chip, Grid, Typography, Divider } from '@mui/material';                    //Queda
import { ShopLayout } from '../../components/layouts';                                  //Queda
import { ItemSlideshow } from '../../components/item';
import { TheTable } from '../../components/table';
import { dbEquipments, dbTickets } from '../../database';                                            //Se modifica?
import { IEquipment, ITicket } from '../../interfaces';                       //Se modifica
import { format } from 'date-fns';
interface Props {
  equipment: IEquipment
  tickets: ITicket[]
}

import { ColumnDef } from '@tanstack/react-table';

const cols:ColumnDef<ITicket>[]=[
  {
    accessorKey: 'ticketId',
    header: () => 'ID',
    footer: props => props.column.id,
    meta: {
      align: 'center'
    },
    
  },
  {
    accessorKey: 'createdAt',
    header: () => 'Creado el',
    cell: ({ row }) => {
      return (          
          format(new Date(row.original.createdAt), 'dd/MM/yyyy')
      );
    },
    meta: {
      align: 'center'
    },
    footer: props => props.column.id,
  },
  {
    accessorKey: 'user',
    header: () => 'Solicitante',
    footer: props => props.column.id,
  },
  {
    accessorKey: 'summary',
    header: () => 'Descripcion',
    footer: props => props.column.id,
  },
  {
    accessorKey: 'status',
    header: () => 'Descripcion',
    cell: ({ row }) => {
      return (
        <Chip label={row.original.status} color="warning" variant="filled" />
      );
    },
    meta: {
      align: 'center'
    },
    footer: props => props.column.id,
  },
  {
    accessorKey: 'location',
    header: () => 'Servicio',
    meta: {
      align: 'center'
    },
    footer: props => props.column.id,
  },
 ]


const EquipmentPage:NextPage<Props> = ({ equipment, tickets }) => {

  const router = useRouter();
  console.log(tickets);
  return (
    <ShopLayout title={ equipment.equip } pageDescription={ equipment.equipId }>
    
      <Grid container spacing={3}>

      <Typography variant='h1' component='h1'>{ 'Equipo' }</Typography>

        <Grid item xs={ 12 } sm={ 5 }>
          <Box display='flex' flexDirection='column' >

            {/* titulos */}
            <Typography variant='subtitle2' component='h2'>{ `Equipo` }</Typography>
            <Typography variant='h1' component='h1'>{ equipment.equip}</Typography>
            <Divider />
            <Typography variant='subtitle2' component='h2'>{ `Marca` }</Typography>
            <Typography variant='h1' component='h1'>{ equipment.brand }</Typography>
            <Divider />
            <Typography variant='subtitle2' component='h2'>{ `Modelo` }</Typography>
            <Typography variant='h1' component='h1'>{ equipment.model }</Typography>
            <Divider />
            <Typography variant='subtitle2' component='h2'>{ `Serie` }</Typography>
            <Typography variant='h1' component='h1'>{ equipment.serialNumber }</Typography>
            <Divider />
            <Typography variant='subtitle2' component='h2'>{ `Ubicacion` }</Typography>
            <Typography variant='h1' component='h1'>{ equipment.location }</Typography>



          </Box>
        </Grid>


            <Grid item xs={12} sm={ 7 }>
            {equipment.images && equipment.images.length > 0 ? (
  <ItemSlideshow images={equipment.images} />
) : (
  <Typography variant='subtitle2' component='h2'>No hay imagenes asociadas</Typography>
)}

          </Grid>


          <Grid item xs={12}>
    <Typography variant="h2">Tickets Asociados</Typography>

  </Grid>
  <Grid item xs={12} sx={{ height:650, width: '100%' }}>

     <TheTable data={tickets} columns={cols} />

            </Grid>

      </Grid>

    </ShopLayout>
  )
}


export const getStaticPaths: GetStaticPaths = async (ctx) => {
  
  const equipmentEquips = await dbEquipments.getAllEquipmentEquipId();
  //equipmentEquips.push({equipId:'1A'})
  //console.log(equipmentEquips)

  return {
    paths: equipmentEquips.map( ({ equipId }) => ({  
      params: {
        equipId                                   
      }
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  
  const { equipId  = '' } = params as { equipId : string }; 
  const equipment = await dbEquipments.getEquipmentByEquipId( equipId );

  //const equipment = await dbEquipments.getEquipmentBySubEquipId( equipId );

  if ( !equipment  ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const tickets = await dbTickets.getTicketsByEquipmentId(equipment.equipId);

  return {
    props: {
      equipment,
      tickets,
    },
    revalidate: 60 * 60 * 24
  }
}


export default EquipmentPage
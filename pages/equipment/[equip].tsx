import { useState, useContext, useEffect } from 'react';
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';    //Queda
import { useRouter } from 'next/router';       
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';                                         //Queda
import { Box, Button, Chip, Grid, Typography, Divider } from '@mui/material';                    //Queda
import { ShopLayout } from '../../components/layouts';                                  //Queda

import { dbEquipments, dbTickets } from '../../database';                                            //Se modifica?
import { IEquipment } from '../../interfaces';                       //Se modifica
import { AspectRatio } from '@mui/icons-material';

interface Props {
  equipment: IEquipment
}



const EquipmentPage:NextPage<Props> = ({ equipment }) => {

  const [tickets, setTickets] = useState([]);
  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const fetchedTickets = await dbTickets.getTicketsByEquipmentId(equipment.equipmentId);
        setTickets(fetchedTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, [equipment.equip]);
  

  const router = useRouter();
  console.log(tickets);
  return (
    <ShopLayout title={ equipment.equipmentId } pageDescription={ equipment.equipmentId }>
    
      <Grid container spacing={3}>

      <Typography variant='h1' component='h1'>{ 'Equipo' }</Typography>

        <Grid item xs={ 12 } sm={ 5 }>
          <Box display='flex' flexDirection='column' >

            {/* titulos */}
            <Typography variant='subtitle2' component='h2'>{ `Equipo` }</Typography>
            <Typography variant='h1' component='h1'>{ equipment.equipmentId}</Typography>
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
              <Typography variant='subtitle2'>Imagenes</Typography>
                        {/*<ItemSlideshow 
                            images={ equipment.images }
                        />*/}

          </Grid>


          <Grid item xs={12}>
    <Typography variant="h2">Tickets Asociados</Typography>
    {tickets.map((ticket) => (
      <div key={ticket.ticketId}>
        <Typography variant="body1">
          Ticket ID: {ticket.ticketId} - Creada en: {ticket.createdAt}
        </Typography>
        <a href={`/admin/tickets/${ticket.ticketId}`} target="_blank" rel="noreferrer">
          Editar ticket
        </a>
        
      </div>
    ))}
  </Grid>


      </Grid>

    </ShopLayout>
  )
}


// getServerSideProps 
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
//* No usar esto.... SSR
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  
//   const { slug = '' } = params as { slug: string };
//   const product = await dbProducts.getProductBySlug( slug );

  // if ( !product ) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false
  //     }
  //   }
  // }

//   return {
//     props: {
//       product
//     }
//   }
// }


// getStaticPaths....
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes





export const getStaticPaths: GetStaticPaths = async (ctx) => {
  
  const equipmentEquips = await dbEquipments.getAllEquipmentEquip();

  
  return {
    paths: equipmentEquips.map( ({ equip }) => ({   //equip=>equipmentId
      params: {
        equip                                       //equip=>equipmentId
      }
    })),
    fallback: 'blocking'
  }
}

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  
  const { equip = '' } = params as { equip: string }; 
  const equipment = await dbEquipments.getEquipmentByEquip( equip );

  if ( !equipment ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      equipment
    },
    revalidate: 60 * 60 * 24
  }
}



export default EquipmentPage
import { useState, useContext } from 'react';
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { Box, Button, Chip, Grid, Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
//import { ItemSlideshow } from '../../components/item';
import { ItemCounter } from '../../components/ui/ItemCounter';

import { dbTickets } from '../../database';
import { ITicket } from '../../interfaces';



interface Props {
  ticket: ITicket
}


const TicketPage:NextPage<Props> = ({ ticket }) => {

  const router = useRouter();
  /*
  const { addProductToCart } = useContext( CartContext )

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: ticket._id,
    image: ticket.images[0],
    price: ticket.price,
    size: undefined,
    slug: ticket.ticketId,
    title: ticket.title,
    gender: ticket.gender,
    quantity: 1,
  })

  const selectedSize = ( size: ISize ) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      size
    }));
  }

  const onUpdateQuantity = ( quantity: number ) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity
    }));
  }


  const onAddProduct = () => {

    if ( !tempCartProduct.size ) { return; }

    addProductToCart(tempCartProduct);
    router.push('/cart');
  }
*/

  return (
    <ShopLayout title={ ticket.ticketId } pageDescription={ ticket.summary }>
    
      <Grid container spacing={3}>

        

        <Grid item xs={ 12 } sm={ 5 }>
          <Box display='flex' flexDirection='column'>

            {/* titulos */}
            <Typography variant='h1' component='h1'>{ ticket.ticketId }</Typography>
            <Typography variant='subtitle1' component='h2'>{ `$${ticket.summary}` }</Typography>


            {/* Descripción */}
            <Box sx={{ mt:3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{ ticket.detail }</Typography>
            </Box>

          </Box>
        </Grid>

        <Grid item xs={12} sm={ 7 }>
          {/*<ItemSlideshow 
            images={ ticket.images }
  />*/}
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
  
  const productTicketIds = await dbTickets.getAllTicketTicketId();

  
  return {
    paths: productTicketIds.map( ({ ticketId }) => ({
      params: {
        ticketId
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
  
  const { ticketId = '' } = params as { ticketId: string };
  const ticket = await dbTickets.getTicketByTicketId( ticketId );

  if ( !ticket ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      ticket
    },
    revalidate: 60 * 60 * 24
  }
}



export default TicketPage
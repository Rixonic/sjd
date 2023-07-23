import { useState, useContext } from 'react';
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';    //Queda
import { useRouter } from 'next/router';                                                //Queda

import { Box, Button, Chip, Grid, Typography } from '@mui/material';                    //Queda

import { CartContext } from '../../context/cart/CartContext';                           //Queda?

import { ShopLayout } from '../../components/layouts';                                  //Queda
import { ProductSlideshow, SizeSelector } from '../../components/products';             //Queda?
import { ItemCounter } from '../../components/ui/ItemCounter';                          //Queda?

import { dbEquipments } from '../../database';                                            //Se modifica?
import { IEquipment, ICartProduct, ISize } from '../../interfaces';                       //Se modifica



interface Props {
  equipment: IEquipment
}


const EquipmentPage:NextPage<Props> = ({ equipment }) => {

  const router = useRouter();
  /*
  const { addProductToCart } = useContext( CartContext )

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
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
    <ShopLayout title={ equipment.equipmentId } pageDescription={ equipment.equipmentId }>
    
      <Grid container spacing={3}>

      <Typography variant='h1' component='h1'>{ 'Equipo' }</Typography>

        <Grid item xs={ 12 } sm={ 5 }>
          <Box display='flex' flexDirection='column'>

            {/* titulos */}
            <Typography variant='h1' component='h1'>{ equipment.equip }</Typography>
            <Typography variant='subtitle1' component='h2'>{ `$${equipment.brand}` }</Typography>

            




            {/* Descripción */}
            <Box sx={{ mt:3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{ equipment.model }</Typography>
            </Box>

          </Box>
        </Grid>

        <Grid item xs={12} sm={ 7 }>
          <ProductSlideshow 
            images={ equipment.images }
          />
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
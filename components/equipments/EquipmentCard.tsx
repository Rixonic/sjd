import { FC, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { Grid, Card, CardActionArea, CardMedia, Box, Typography, Link, Chip } from '@mui/material'

import { IEquipment } from '../../interfaces'

interface Props {
    equipment: IEquipment;
}

export const EquipmentCard: FC<Props> = ({ equipment }) => {

    const [isHovered, setIsHovered] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const equipmentImage = useMemo(() => {
        return isHovered
          ? equipment.images[1]
          : equipment.images[0];

    }, [isHovered, equipment.images])

    return (
      <Grid item 
            xs={6} 
            sm={ 4 }
            onMouseEnter={ () => setIsHovered(true) } 
            onMouseLeave={ () => setIsHovered(false) } 
      >
          <Card>
              <NextLink href={`/equipment/${ equipment.equip }`} passHref prefetch={ false }>
                <Link>

                    <CardActionArea>

                        <CardMedia 
                            component='img'
                            className='fadeIn'
                            image={ equipmentImage }
                            alt={ equipment.equip }
                            onLoad={ () => setIsImageLoaded(true) }
                        />

                    </CardActionArea>
                </Link>
              </NextLink>
              
          </Card>

          <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
              <Typography fontWeight={700}>{ equipment.equip }</Typography>
              <Typography fontWeight={500}>{ `$${equipment.equipmentId}` }</Typography>
          </Box>
      </Grid>
    )
}

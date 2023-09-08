import { FC } from 'react';
import { format } from 'date-fns';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CardActions from '@mui/material/CardActions';
import 'react-slideshow-image/dist/styles.css';
import styles from './ItemSlideshow.module.css';

interface Props {
    data: {
        name : string;
        temperature: string;
        createdAt : Date;
    }[]
    ; 
}

export const temperatureDisplay: FC<Props> = ({ data }) => {
      
  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={2}
    >

    

    </Stack>
  )
}

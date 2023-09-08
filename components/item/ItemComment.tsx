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
    comments: {
        user : string;
        comment: string;
        createdAt : Date;
    }[]
    ; 
}

export const ItemComment: FC<Props> = ({ comments }) => {

    function stringToColor(string: string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
        return color;
      }
    
      function stringAvatar(name: string) {
        return {
          sx: {
            bgcolor: stringToColor(name),
          },
          children: name.split(' ').map(word => word[0]).join(''),
        };
      }

      
  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      spacing={2}
    >

        {
            comments.map( comentario =>  {
                return (
<Card sx={{ maxWidth: 345 }} key={format(new Date(comentario.createdAt), 'dd/MM/yyyy HH:mm:ss')} >
      <CardHeader
        avatar={
        <Avatar {...stringAvatar(comentario.user)} />
        }

        title={comentario.user}
        subheader={ format(new Date(comentario.createdAt), 'dd/MM/yyyy HH:mm') }
      />
<Divider variant="middle" />
<CardActions>
<Typography variant="body2" color="text.secondary">
{comentario.comment}
        </Typography>
</CardActions>

   

      </Card>
                )

            })
        }

    </Stack>
  )
}

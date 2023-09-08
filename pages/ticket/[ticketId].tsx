import { useState, useContext } from 'react';
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Box, Button,Stack, Chip, Grid, Typography, Divider, Container, TextField} from '@mui/material';
import { format } from 'date-fns';
import { ShopLayout } from '../../components/layouts';
import { ItemSlideshow } from '../../components/item';
import { ItemComment } from '../../components/item';
import { ItemCounter } from '../../components/ui/ItemCounter';
import Avatar from '@mui/material/Avatar';
import { dbTickets, dbUsers } from '../../database';
import { ITicket, IUser } from '../../interfaces';
import Paper from '@mui/material/Paper';
import CardActions from '@mui/material/CardActions';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

const sideSeparation = 5;
const mainSeparation = 2;

import { UiContext, AuthContext } from '../../context';
import { Margin } from '@mui/icons-material';
interface Props {
  ticket: ITicket,
}

const TicketPage:NextPage<Props> = ({ ticket }) => {
  const { user, isLoggedIn, logout } = useContext(  AuthContext );
  console.log(user)

  const [isSaving, setIsSaving] = useState(false);

  const [comments, setComments] = useState(ticket.comments || []);
  const [newComment, setNewComment] = useState('');

const addComment = async () => {
  if (newComment.trim() === '') {
    return;
  }
  
  try {
    setIsSaving(true);
    const response = await fetch('/api/admin/tickets', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: ticket._id, // Assuming ticket._id is the ID of the current ticket
        comments: [
          {
            user: user.name, // Replace with actual user ID
            comment: newComment,
            createdAt: new Date(),
          },
          ...comments, // Keep the existing comments
        ],
      }),
    });

    if (response.ok) {
      // Comment successfully added to the server
      const updatedTicket = await response.json();
      setComments(updatedTicket.comments);
      setNewComment('');
    } else {
      // Handle error
      console.error('Error adding comment');
    }
  } catch (error) {
    console.error('Error adding comment', error);
  } finally {
    setIsSaving(false);
  }
};

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

  function stringAvatar(name: string, size:number) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: size, 
        height: size,
        fontSize: size/2,
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  return (
    <ShopLayout title={ ticket.ticketId } pageDescription={ ticket.summary }>
      <Grid container >
        <Grid item xs={ 12 } sm={ 8 }>
          <Box display='flex' flexDirection='column' gap={1}>
            {/* titulos */}
            <Box display='flex' flexDirection='row' gap={1}>
              <Typography variant='subtitle1' component='h2'>{ `Ticket Nro:` }</Typography>
              <Typography variant='h1' component='h1' >{ ticket.ticketId }</Typography>
            </Box>
            {/* Descripción */}
            <Box sx={{ mt:3 }}>
              <Typography variant='subtitle2'>Problema:</Typography>
              <Typography variant='body2' paddingLeft={mainSeparation}>{ ticket.summary }</Typography>
            </Box>
        
            <Box sx={{ mt:3 }}>
              <Typography variant='subtitle2'>Descripción:</Typography>
              <Typography variant='body1' paddingLeft={mainSeparation}>{ ticket.detail }</Typography>
            </Box>
            {ticket.images && ticket.images.length > 0 ? (
              <ItemSlideshow images={ticket.images} />
            ) : (
              <Typography variant='subtitle2' component='h2'>No hay imagenes asociadas</Typography>
            )}
          </Box>
          {/* Comentarios */}
          <Box sx={{ mt: 3 }}>
            <Grid item xs={12} sm={12}>
              <Box display='flex' flexDirection='column' gap={2}>
                <Typography variant='h1' >Comentarios</Typography>
                <Stack
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  spacing={1}
                >
                  {comments.map((comment) => (
                    <Card sx={{ maxWidth: 545 , width: 400 } }  key={format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm:ss')} >
                      <CardHeader
                        avatar={<Avatar {...stringAvatar(comment.user,35)} />}
                        title={comment.user}
                        subheader={ format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm') }
                      />
                      <Divider variant="middle" />
                      <CardActions>
                        <Typography variant="body2" color="text.secondary">{comment.comment}</Typography>
                      </CardActions>
                    </Card>
                  ))}
                </Stack>
                <Divider variant="middle" />
                <Box display='flex' flexDirection='row' alignItems={'center'} gap={2}>
                  <TextField
                    label="Agregar comentario"
                    multiline
                    rows={2}
                    fullWidth
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={addComment}>Agregar Comentario</Button>
                </Box>
              </Box>
            </Grid> 
          </Box>
        </Grid>
        {/*Sector lateral*/}
        <Box width={400} >
          <Paper elevation={6}>
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={6}
              paddingBottom={3}
              paddingTop={3}
              paddingLeft={4}
            >
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography variant='subtitle2' component='h2'>Estado:</Typography>
                <Typography variant='h1' component='h1' paddingLeft={sideSeparation}>{ ticket.status }</Typography>
              </Box>
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography variant='subtitle2' component='h2'>Prioridad</Typography>
                <Typography variant='h1' component='h1' paddingLeft={sideSeparation}>Alta/Media/Baja</Typography>
              </Box>
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography variant='subtitle2' component='h2'>Creado el:</Typography>
                <Typography variant='h1' component='h1' paddingLeft={sideSeparation}>{ format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm') }</Typography>
              </Box>
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography variant='subtitle2' component='h2'>Finalizado el:</Typography>
                <Typography variant='h1' component='h1' paddingLeft={sideSeparation}>{ ticket.finishAt ? format(new Date(ticket.finishAt), 'dd/MM/yyyy HH:mm') : '-' }</Typography>
              </Box>
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography variant='subtitle2' component='h2'>Reportado por:</Typography>
                <Box display='flex' flexDirection='row' alignItems={'center'} gap={1}  paddingLeft={sideSeparation}>
                  <Avatar {...stringAvatar(ticket.user,50)}  />
                  <Typography variant='h1' component='h1'>{ ticket.user }</Typography>
                </Box>
              </Box>
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography variant='subtitle2' component='h2'>Assignado a:</Typography>
                {ticket.assignedTo ? (<Box display='flex' flexDirection='row' alignItems={'center'} gap={1} paddingLeft={sideSeparation}>
                  <Avatar {...stringAvatar(ticket.assignedTo,50)} />
                  <Typography variant='h1' component='h1'>{ ticket.assignedTo }</Typography>
                </Box>):(<Typography variant='h1' component='h1' paddingLeft={sideSeparation}>-</Typography>)}
              </Box>
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography variant='subtitle2' component='h2'>Equipo asociado</Typography>
                <Typography variant='h1' component='h1' paddingLeft={sideSeparation}>{ ticket.equipId }</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Grid>
    </ShopLayout>
  )
}


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
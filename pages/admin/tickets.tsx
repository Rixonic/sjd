import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { Chip, Grid, Box, Button, CardMedia, Link } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';

import { AdminLayout } from '../../components/layouts'
import { ITicket, IUser } from '../../interfaces';


const columns:GridColDef[] = [
    { field: 'id', headerName: 'Ticket ID', width: 250 },
/*    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre Completo', width: 300 },
    { field: 'total', headerName: 'Monto total', width: 300 },
    {
        field: 'isPaid',
        headerName: 'Pagada',
        renderCell: ({ row }: GridValueGetterParams) => {
            return row.isPaid
                ? ( <Chip variant='outlined' label="Pagada" color="success" /> )
                : ( <Chip variant='outlined' label="Pendiente" color="error" /> )
        }
    },
    { field: 'noProducts', headerName: 'No.Productos', align: 'center', width: 150 },
    */
    {
        field: 'check',
        headerName: 'Ver Ticket',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a href={ `/tickets/${ row.ticketId }` } target="_blank" rel="noreferrer" >
                    Ver orden
                </a>
            )
        }
    },
    { field: 'createdAt', headerName: 'Creada en', width: 300 },

];




const TicketsPage = () => {

    const { data, error } = useSWR<ITicket[]>('/api/admin/tickets');

    if ( !data && !error ) return (<></>);
    
    const rows = data?.map( ticket => ({   //
        id    : ticket._id,
        /*
        email : (ticket.user as IUser).email,
        name  : (ticket.user as IUser).name,
        total : ticket.total,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,*/
        createdAt: ticket.createdAt,
    }));


  return (
    <AdminLayout 
        title={'Tickets'} 
        subTitle={'Historial'}
        icon={ <ConfirmationNumberOutlined /> }
    >
        <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
            <Button
                startIcon={ <AddOutlined /> }
                color="secondary"
                href="/admin/tickets/new"
            >
                Crear ticket
            </Button>
        </Box>
         <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width: '100%' }}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />

            </Grid>
        </Grid>
        
    </AdminLayout>
  )
}

export default TicketsPage
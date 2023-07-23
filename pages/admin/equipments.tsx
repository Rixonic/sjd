import NextLink from 'next/link';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, CardMedia, Grid, Link } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams ,GridActionsCellItem,} from '@mui/x-data-grid';
import useSWR from 'swr';

import { AdminLayout } from '../../components/layouts'
import { IEquipment  } from '../../interfaces';


const columns:GridColDef[] = [    
    { field: 'equip', headerName: 'ID'  ,width: 75},
    { field: 'equipmentId', headerName: 'Equipo',width: 300},
    { field: 'brand', headerName: 'Marca',width: 150},
    { field: 'model', headerName: 'Modelo',width: 150 },
    { field: 'serialNumber', headerName: 'Serie',width: 150 },
    { field: 'location', headerName: 'Ubicacion',width: 150 },
    { field: 'headquarter', headerName: 'Sede' },
    { 
        field: 'actions',
        type: 'actions',
        headerName: 'Acciones',
        renderCell: ({ row }: GridValueGetterParams ) => [
          <GridActionsCellItem
            key={row._id}
            icon={<EditIcon/>}
            label="Editar"
            href = {`/admin/equipments/${ row.equip }`}
            
          />,
          <GridActionsCellItem
            key={row._id}
            icon={<VisibilityIcon/>}
            label="Visualizar"
            href={`/equipment/${ row.equip }`} 
          />,
        ],
    },
];
 


const EquipmentsPage = () => {

    const { data, error } = useSWR<IEquipment[]>('/api/admin/equipments');

    if ( !data && !error ) return (<></>);
    
    const rows = data!.map( equipment => ({
        id: equipment._id,
        equipmentId: equipment.equipmentId,
        equip: equipment.equip,
        brand: equipment.brand,
        model: equipment.model,
        serialNumber: equipment.serialNumber,
        location: equipment.locations,
        headquarter: equipment.headquarter,
    }));


  return (
    <AdminLayout 
        title={`Equipamiento (${ data?.length })`} 
        subTitle={'Listado de equipamiento'}
        icon={ <CategoryOutlined /> }
    >
        <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
            <Button
                startIcon={ <AddOutlined /> }
                color="secondary"
                href="/admin/equipments/new"
            >
                Agregar equipo
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

export default EquipmentsPage;
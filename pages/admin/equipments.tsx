import NextLink from 'next/link';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Button, CardMedia, Grid, Link, Accordion, AccordionSummary, AccordionDetails, Typography, MenuItem, Select } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams ,GridActionsCellItem,} from '@mui/x-data-grid';
import useSWR from 'swr';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';

import React, { useMemo } from 'react';

import { AdminLayout } from '../../components/layouts'
import { IEquipment  } from '../../interfaces';


export type Person = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  subRows?: Person[]; //Each person can have sub rows of more people
};

export const data = [
  {
    firstName: 'Dylan',
    lastName: 'Murray',
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
    subRows: [
      {
        firstName: 'Ervin',
        lastName: 'Reinger',
        address: '566 Brakus Inlet',
        city: 'South Linda',
        state: 'West Virginia',
        subRows: [
          {
            firstName: 'Jordane',
            lastName: 'Homenick',
            address: '1234 Brakus Inlet',
            city: 'South Linda',
            state: 'West Virginia',
          },
        ],
      },
      {
        firstName: 'Brittany',
        lastName: 'McCullough',
        address: '722 Emie Stream',
        city: 'Lincoln',
        state: 'Nebraska',
      },
    ],
  },
  {
    firstName: 'Raquel',
    lastName: 'Kohler',
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
    subRows: [
      {
        firstName: 'Branson',
        lastName: 'Frami',
        address: '32188 Larkin Turnpike',
        city: 'Charleston',
        state: 'South Carolina',
      },
    ],
  },
];




const EquipmentsPage = () => {

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        header: 'First Name',
        accessorKey: 'firstName', //using accessorKey dot notation to access nested data
      },
      {
        header: 'Last Name',
        accessorFn: (originalRow) => originalRow.firstName, //alternative to accessorKey, using accessorFn
        id: 'lastName',
      },
      {
        header: 'city',
        accessorKey: 'city',
      },
    ],
    [],
  );

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
            <MaterialReactTable
              columns={columns}
              data={data}
              enableExpanding
              enableExpandAll //default

            />

            </Grid>
        </Grid>
        
    </AdminLayout>
  )
}

export default EquipmentsPage;
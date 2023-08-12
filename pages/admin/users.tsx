import { useState, useEffect } from 'react';
import { PeopleOutline } from '@mui/icons-material'
import useSWR from 'swr';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, Select, MenuItem } from '@mui/material';

import { AdminLayout } from '../../components/layouts'
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';




const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [ users, setUsers ] = useState<IUser[]>([]);


    useEffect(() => {
      if (data) {
          setUsers(data);
      }
    }, [data])
    

    if ( !data && !error ) return (<></>);

    const onRoleUpdated = async( userId: string, newRole: string ) => {

        const previosUsers = users.map( user => ({ ...user }));
        const updatedUsers = users.map( user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updatedUsers);

        try {
            
            await tesloApi.put('/admin/users', {  userId, role: newRole });

        } catch (error) {
            setUsers( previosUsers );
            console.log(error);
            alert('No se pudo actualizar el role del usuario');
        }

    }

    const onSectorUpdated = async( userId: string, newSector: string ) => {

        const previosUsers = users.map( user => ({ ...user }));
        const updatedUsers = users.map( user => ({
            ...user,
            sector: userId === user._id ? newSector : user.sector
        }));

        setUsers(updatedUsers);

        try {
            
            await tesloApi.put('/admin/users', {  userId, sector: newSector });

        } catch (error) {
            setUsers( previosUsers );
            console.log(error);
            alert('No se pudo actualizar el sector del usuario');
        }

    }


    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        { field: 'email', headerName: 'Usuario', width: 250 },
        {
            field: 'role', 
            headerName: 'Rol', 
            width: 300,
            renderCell: ({row}: GridValueGetterParams) => {
                return (
                    <Select
                        value={ row.role }
                        label="Rol"
                        onChange={ ({ target }) => onRoleUpdated( row.id, target.value ) }
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value='admin'> Admin </MenuItem>
                        <MenuItem value='supervisor'> Supervisor </MenuItem>
                        <MenuItem value='tecnico'> Tecnico </MenuItem>
                        <MenuItem value='servicio'> Servicio </MenuItem>
                        <MenuItem value='cliente'> Visitante </MenuItem>

                    </Select>
                )
            }
        },

    ];

    const excludedUserIds = ['64d38bb56782503e279bf36a', '64d38cdb6782503e279bf38b']; // Agrega aquí los IDs de los usuarios que deseas excluir

    const filteredUsers = users.filter(user => !excludedUserIds.includes(user._id));

    const rows = filteredUsers.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,

    }));


  return (
    <AdminLayout 
        title={'Usuarios'} 
        subTitle={'Mantenimiento de usuarios'}
        icon={ <PeopleOutline /> }
    >


        <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width: '100%' }}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }

                />

            </Grid>
        </Grid>


    </AdminLayout>
  )
}

export default UsersPage
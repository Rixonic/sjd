import { useContext } from 'react';
import NextLink from 'next/link';

import { AppBar, Box, Button, Stack, Toolbar, Typography, Divider, Link } from '@mui/material';


import { UiContext } from '../../context';

export const AdminNavbar = () => {

    const { toggleSideMenu } = useContext( UiContext );
    

    return (
        <AppBar position="fixed" >
            <Toolbar >
                    <Link display='flex' alignItems="baseline" href='/'>
                        <Typography variant='h6'>Ingenieria |</Typography>
                        <Typography sx={{ ml: 0.5 }}>HSJD</Typography>
                    </Link>  

                <Box flex={ 1 } />

                <Button onClick={ toggleSideMenu }>
                    Menú
                </Button>

            </Toolbar>
        </AppBar>
    )
}

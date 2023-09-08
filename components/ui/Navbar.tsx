import { useContext, useState } from 'react';

import {  Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';

import { UiContext } from '../../context';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';

import { drawerWidth } from '../constants';
interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }
  
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));


export const Navbar = () => {

    const { isMenuOpen, toggleSideMenu } = useContext( UiContext );
    //const { toggleSideMenu } = useContext( UiContext );

    return (
        <AppBar open={isMenuOpen}>
            <Toolbar>
            <Button onClick={ toggleSideMenu }>
                    Menú
                </Button>


                <Box flex={ 1 } />

                <Box flex={ 1 } />

                {/* Pantallas pequeñas */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={ toggleSideMenu }
                >
                    <SearchOutlined />
                </IconButton>



                <Link display='flex' alignItems="baseline" href='/'>
                        <Typography variant='h6'>Ingenieria |</Typography>
                        <Typography sx={{ ml: 0.5 }}>HSJD</Typography>
                    </Link>  


            </Toolbar>
        </AppBar>
    )
}

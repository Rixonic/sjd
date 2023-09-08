import { FC } from 'react';
import Head from 'next/head';
import { useContext, useState } from 'react';
import { Navbar, SideMenu } from '../ui';

import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import * as React from 'react';
import { UiContext, AuthContext } from '../../context';

import { drawerWidth } from '../constants';

interface Props {
    title: string;
    pageDescription: string;
    imageFullUrl?: string;
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: `${drawerWidth}px`,
    }),
  }));
  

export const ShopLayout:FC<Props> = ({ children, title, pageDescription, imageFullUrl }) => {
    const { isMenuOpen, toggleSideMenu } = useContext( UiContext );
  return (
    
    <>
        <Head>
            <title>{ title }</title>

            <meta name="description" content={ pageDescription } />
            
            
            <meta name="og:title" content={ title } />
            <meta name="og:description" content={ pageDescription } />

            {
                imageFullUrl && (
                    <meta name="og:image" content={ imageFullUrl } />
                )
            }

        </Head> 

        <nav>
            {<Navbar />}

        </nav>
        <SideMenu />
        <main style={{
            //margin: '80px auto',
            //maxWidth: '1440px',
            padding: '50px 0px 0px 30px'
        }}>
            
            <Box sx={{ display: 'flex' }}>
                <Main open={isMenuOpen}>
                {children}
                    
                </Main>
            </Box>
            
        </main>

        {/* Footer */}
        <footer>
            {/* TODO: mi custom footer */}
        </footer>

    </>
  )
}



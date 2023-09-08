import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { Navbar, SideMenu } from '../ui';
import Head from 'next/head';
import { drawerWidth } from '../constants';
import { styled, useTheme } from '@mui/material/styles';
import { useContext, useState } from 'react';
import { UiContext, AuthContext } from '../../context';


interface Props {
    title: string;
    subTitle: string;
    icon?: JSX.Element;
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

export const AdminLayout:FC<Props> = ({ children, title, subTitle, icon }) => {
    const { isMenuOpen, toggleSideMenu } = useContext( UiContext );
  return (
    <>
    <Head>
        <title>{ title }</title>
    </Head>
        

    <nav>
            {<Navbar />}

        </nav>
        <SideMenu />
        <main style={{
            //margin: '80px auto',
            //maxWidth: '1440px',
            padding: '50px 30px 0px 30px'
        }}>
            
            <Box sx={{ display: 'flex' }}>
                <Main open={isMenuOpen}>
                <Typography variant='h1' component='h1'>
                { icon }
                {' '} { title }
            </Typography>
            <Typography variant='h2' sx={{ mb: 1 }}>{ subTitle }</Typography>
                {children}
                    
                </Main>
            </Box>
            
        </main>


    </>
  )
}

/*

return (
    <>
    <Head>
        <title>{ title }</title>
    </Head>
        

        <nav>
            
            <SideMenu />
            
        </nav>

        
        <main style={{
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0px 30px'
        }}>
            <Box className='fadeIn'>
            
            

            <Box display="flex" flexDirection='column'>
            <AdminNavbar />
            {
                <Typography variant='h1' component='h1'>
                { icon }
                {' '} { title }
            </Typography>
            <Typography variant='h2' sx={{ mb: 1 }}>{ subTitle }</Typography>
    }


    </Box>

    <Box className='fadeIn'>
    
        { children }
    </Box>
    </Box>
</main>


</>
)

*/

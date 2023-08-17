import { useContext, useState } from 'react';

import { Box, Divider, Drawer, IconButton, Input, Stack, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { UiContext, AuthContext } from '../../context';
import { useRouter } from 'next/router';


export const SideMenu = () => {

    const router = useRouter();
    const { isMenuOpen, toggleSideMenu } = useContext( UiContext );
    const { user, isLoggedIn, logout } = useContext(  AuthContext );

    const [searchTerm, setSearchTerm] = useState('');

    const onSearchTerm = () => {
        if( searchTerm.trim().length === 0 ) return;
        navigateTo(`/search/${ searchTerm }`);
    }

    
    const navigateTo = ( url: string ) => {
        toggleSideMenu();
        router.push(url);
    }


  return (
    <Drawer
        open={ isMenuOpen }
        anchor='right'
        sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        onClose={ toggleSideMenu }
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>
            
            <List>
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={5}
            >
                <Typography>{user?.name}</Typography>
            </Stack>
            <Divider />
            <ListSubheader>Menu principal</ListSubheader>

                {
                    isLoggedIn && (
                        <>
                            <ListItem 
                                button
                                onClick={ () => navigateTo('/') }>
                                <ListItemIcon>
                                    <HomeIcon/>
                                </ListItemIcon>
                                <ListItemText primary={'Home'} />
                            </ListItem>     

                        </>
                    )
                }


                {
                    isLoggedIn 
                    ? (
                        <ListItem button onClick={ logout }>
                            <ListItemIcon>
                                <LoginOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Salir'} />
                        </ListItem>
                    )
                    : (
                        <ListItem 
                            button
                            onClick={ () => navigateTo(`/auth/login?p=${ router.asPath }`) }
                        >
                            <ListItemIcon>
                                <VpnKeyOutlined/>
                            </ListItemIcon>
                            <ListItemText primary={'Ingresar'} />
                        </ListItem>
                    )
                }

                {
                    
                        <>
                            <Divider />
                            <ListSubheader>Accesos</ListSubheader>
                            <ListItem 
                                button
                                onClick={ () => navigateTo('/equipamiento') }>
                                <ListItemIcon>
                                    <CategoryOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Equipos'} />
                            </ListItem>      

                            <ListItem 
                                button
                                onClick={ () => navigateTo('/dosimetros') }>
                                <ListItemIcon>
                                    <CategoryOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Dosimetros'} />
                            </ListItem>          

                        </>
                    
                }


                {/* Admin */}
                {
                   user?.role === 'admin' && (
                        <>
                            <Divider />
                            <ListSubheader>Gestion tecnica</ListSubheader>


                            <ListItem 
                                button
                                onClick={ () => navigateTo('/') }>
                                <ListItemIcon>
                                    <DashboardOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Dashboard'} />
                            </ListItem>

                            <ListItem 
                                button
                                onClick={ () => navigateTo('/admin/equipments') }>
                                <ListItemIcon>
                                    <CategoryOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Equipos'} />
                            </ListItem>      

                            <ListItem 
                                button
                                onClick={ () => navigateTo('/admin/dosimeters') }>
                                <ListItemIcon>
                                    <CategoryOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Dosimetros'} />
                            </ListItem>         

                            <ListItem 
                                button
                                onClick={ () => navigateTo('/admin/tickets') }>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Tickets'} />
                            </ListItem>

                            <ListItem 
                                button
                                onClick={ () => navigateTo('/admin/users') }>
                                <ListItemIcon>
                                    <AdminPanelSettings/>
                                </ListItemIcon>
                                <ListItemText primary={'Usuarios'} />
                            </ListItem>     

                
                        </>

                        
                   )
                    
                }
            </List>
        </Box>
    </Drawer>
  )
}
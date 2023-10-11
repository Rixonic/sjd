import { useContext, useState } from 'react';

import { Box, Divider, Drawer, Stack, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material"
import { AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, LoginOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import { UiContext, AuthContext } from '../../context';
import { useRouter } from 'next/router';
import { drawerWidth } from '../constants';

export const SideMenu = () => {

    const router = useRouter();
    const { isMenuOpen, toggleSideMenu } = useContext( UiContext );
    const { user, isLoggedIn, logout } = useContext(  AuthContext );
    
    const navigateTo = ( url: string ) => {
        toggleSideMenu();
        router.push(url);
    }


  return (
    <Drawer
    //variant="permanent"
    variant="persistent"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
    }}
    open={ isMenuOpen }

    >
        <Box sx={{ width: drawerWidth-1, paddingTop: 5 }}>
            
            <List>

                <Typography textAlign={'center'} marginBottom={1}>{user?.name}</Typography>

            <Divider variant="middle" />
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
                            <Divider variant="middle" />
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
                            <ListItem 
                                button
                                onClick={ () => navigateTo('/tickets') }>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Tickets'} />
                            </ListItem>   

                        </>
                    
                }


                {/* Admin */}
                {
                   user?.role === 'admin' && (
                        <>
                            <Divider variant="middle" />
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
                                onClick={ () => navigateTo('/equipamiento') }>
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
                {
                    user?.email == 'franco.cejas' && (<><Divider variant="middle" />
                    <ListSubheader>Testing</ListSubheader>
                    <ListItem 
                        button
                        onClick={ () => navigateTo('/admin/sensors') }>
                        <ListItemIcon>
                            <AdminPanelSettings/>
                        </ListItemIcon>
                        <ListItemText primary={'Sensores'} />
                    </ListItem>   </>)
                }
            </List>
        </Box>
    </Drawer>
  )
}
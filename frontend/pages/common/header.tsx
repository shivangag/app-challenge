import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import Link from "next/link"

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';

import MenuIcon from '@mui/icons-material/Menu';
import UserIcon from '@mui/icons-material/PeopleAlt';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useRouter } from 'next/router';
import { CssBaseline } from '@mui/material';

const drawerWidth = 240;

const Header: NextPage = (props: any) => {
    const Router = useRouter();
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [token, setToken] = useState<null | string>(null)

    useEffect(() => {
        setToken(localStorage.getItem('accessToken'))
    }, [])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            {token && <List className="list-sidebar-menu">
                {['Users', 'Restaurants'].map((text, index) => (
                    <>
                        <Link
                            href={{ pathname: text === 'Users' ? "/users" : "/restaurants" }}
                        >
                            <ListItem button key={text}>
                                <ListItemIcon>
                                    {index === 0 ? <UserIcon /> : <RestaurantIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        </Link>
                        {index === 0 && <Divider />}
                    </>
                ))}
            </List>}
            <Divider />
            {token && <List className="list-sidebar-menu actions-menu-items">
                {['Logout'].map((text, index) => (
                    <>
                        <Divider />
                        <ListItem button key={text} onClick={() => {
                            localStorage.setItem("accessToken", "")
                            setToken("")
                            Router.push("/login")
                        }}>
                            <ListItemIcon>
                                {index === 0 ? <UserIcon /> : <RestaurantIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    </>
                ))}
            </List>}
            {!token && <List className="list-sidebar-menu actions-menu-items">
                {['Login'].map((text, index) => (
                    <>
                        <Divider />
                        <Link
                            href={{ pathname: "/login" }}
                        >
                            <ListItem button key={text}>
                                <ListItemIcon>
                                    {index === 0 ? <UserIcon /> : <RestaurantIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        </Link>
                    </>
                ))}
            </List>}
        </div>
    );

    return (
        <div>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </div>
    )
}

export default Header
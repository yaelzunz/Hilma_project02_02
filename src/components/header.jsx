import { auth } from '../firebase/config'
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

// Assets
import { AiOutlineLogout, AiOutlineMenu } from 'react-icons/ai'
// Styles
import styles from '../styles/components/header.module.css'

import { useNavigate } from 'react-router-dom'


import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
// import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Logout, PersonAdd, Settings } from '@mui/icons-material'
import { Avatar, Divider, ListItemIcon } from '@mui/material'
import Tooltip from '@mui/material/Tooltip';
import Menu from './menu'
import { Button } from 'react-bootstrap'

import FavoriteIcon from '@mui/icons-material/Favorite';
import ExtensionIcon from '@mui/icons-material/Extension';



// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';





/**
 * Component renders the main app header.
 */
function Header({ setMenu }) {

  const { title } = useParams()
  const [isPressed, setIsPressed] = useState(false);

    const handleButtonClick = () => {
      setIsPressed(!isPressed);
    };

    const navigate = useNavigate()



    const searchHandler = e => {
        // e.preventDefault()
        if (e.key === 'Enter') {
            navigate(`/search?q=${e.target.value}`)
        }
    }


    const Search = styled('div')(({ theme }) => ({
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    }));
  
    const SearchIconWrapper = styled('div')(({ theme }) => ({
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }));
  
    const StyledInputBase = styled(InputBase)(({ theme }) => ({
      color: 'inherit',
      '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '20ch',
        },
      },
    }));
   
 


    
  



  return (

    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar >
        

          <Link to="/home">
                <img src="/imgs/logo.png" alt="Capish logo" />
            </Link>
            <Box sx={{ mr: 8 }} />


          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onKeyDown={searchHandler}

            />
          </Search>



          <Box sx={{ mr: 100 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
      


          <IconButton aria-label="add to favorites" title="משחק זיכרון" onClick={() => navigate(`/memoryGame`)}>
          <ExtensionIcon />
        </IconButton>
          </Box>
          <Box sx={{ mr: 4 }} />
          <IconButton aria-label="add to favorites" title="מועדפים">
          <FavoriteIcon />
        </IconButton>

        <Box sx={{ mr: 4 }} />

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
          >
          {/* <MenuIcon onClick={handleButtonClick}/>
          <Menu isPressed={isPressed} /> */}
          <MenuIcon onClick={() => setMenu(s => !s)}/>
          </IconButton>

          </Box>
          
        </Toolbar>
      </AppBar>

    </Box>
  );
}


//     return (
//         <header>
            // <Link to="/home">
            //     <img src="/imgs/logo.png" alt="Capish logo" />
            // </Link>
//             <nav className={styles['links']}></nav>
//             <section className={styles['r']}>
//                 <LogoutBtn />
//                 <button title="Menu" className={styles['menu-btn']} onClick={() => setMenu(s => !s)}>
//                     <AiOutlineMenu size={22} />
//                 </button>
//             </section>
//         </header>
//     )
// }

export default Header

// Helper components

export function LogoutBtn() {
    // States
    const [openDialog, setOpenDialog] = useState(true);

    // Handlers
    const handleClose = () => {
      setOpenDialog(false);
    };

    const logoutHandler = e => {
        e.stopPropagation()
        console.log('Logging out...')
        // Logout from firebase user
        auth.signOut()
        window.location.href = '/login'
    }

    return (
        <div className={styles['logout']} >
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        האם אתה בטוח רוצה לצאת?
        </DialogTitle>
        <DialogContent>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>לא </Button>
          <Button onClick={logoutHandler} autoFocus>
            כן
          </Button>
        </DialogActions>
      </Dialog>
        </div>
    )
}

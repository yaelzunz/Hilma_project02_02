import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Firebase
import { db } from '../firebase/config'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
// Icons
import { AiOutlineLogout, AiOutlineTeam } from 'react-icons/ai'
import { LiaUserSlashSolid } from 'react-icons/lia'
import { AiFillTag, AiFillEdit } from 'react-icons/ai'
// Styles
import styles from '../styles/components/menu.module.css'
import { Logout, PersonAdd, Settings } from '@mui/icons-material'
import { Alert, Avatar, Box, Dialog, DialogContent, DialogContentText, Divider, IconButton, ListItemIcon, MenuItem } from '@mui/material'
import Tooltip from '@mui/material/Tooltip';
import { Button } from 'react-bootstrap'
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { LogoutBtn } from './header'
import Drawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';


const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));



/**
 * Component renders the app main menu.
 */
export default function Menu({ setMenuStatus, setChangingInterests, setData, isPressed  }) {
    // States
    const navigate = useNavigate()
    const [user, loading, error] = useAuthState(auth)
    const [openMenu, setOpenMenu] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [clicked, setClicked] = useState(false);

    // Interests
    const [currentUser, setCurrentUser] = useState(null)
    const theme = useTheme();

    const handleDrawerClose = () => {
      setOpenMenu(false);
    };

    const handleClose = () => {
      setClicked(false)

    }

    const handleClickOpen = () => {
      setClicked(true)
    }
    const handleIsOpen = () => {
      setIsOpen(!isOpen)
    }


    // Handlers

    const handleDeleteUser = async () => {

        try {
            const user = auth.currentUser
            if (!user) return
            // Delete the user account
            const res = await user.delete()
            console.log('User account deleted successfully.')
            // Sign out and redirect to login page
            auth.signOut()
            window.location.href = '/login'
        } catch (error) {
            console.error('Error deleting user:', error.message)
        }
    }

    function onExitMenuHandler() {
        setTimeout(() => {
            setMenuStatus(false)
        }, 2000)
    }

    // Effects
    useEffect(() => {
        // Set up an authentication state observer
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user)
                console.log({ user })
            } else {
                setCurrentUser(null)
            }
        })

        // Cleanup the observer when the component unmounts
        return () => unsubscribe()
    }, [user])

    return (
        <Drawer
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  '& .MuiDrawer-paper': {
                    width: drawerWidth,
                  },
                }}
                variant="persistent"
                anchor="right"
                open={openMenu}
              >

      <DrawerHeader IconButton onClick={handleDrawerClose}>
          <IconButton>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>

        <List>
        <ListItemButton onClick={handleIsOpen}>
          <listItem disablePadding>
          <AiOutlineLogout size={24}/> יציאה
          {isOpen && <LogoutBtn />}
          </listItem>
        </ListItemButton>
        <Divider />

        <br />

        <ListItemButton onClick={handleClickOpen}>
           <listItem disablePadding>
           <LiaUserSlashSolid size={24} />מחק את המשתמש 
           </listItem>
        </ListItemButton>
        <br />

        <ListItemButton onClick={() => setChangingInterests(true)}>
           <listItem disablePadding>
           <AiFillTag size={24} />שינוי תחומי העיניין      
           </listItem>
        </ListItemButton>
        <br />


        <ListItemButton onClick={() => navigate('/restore-password')}>
           <listItem disablePadding>
           <AiFillEdit size={24} /> שינוי סיסמה      
           </listItem>
        </ListItemButton>
        <br />

        {currentUser && currentUser.email === 'yaelzu1995@gmail.com' && (
        <ListItemButton onClick={() => navigate('/manger')}>
           <listItem disablePadding>
           <AiOutlineTeam size={24} />  ניהול משתמשים   
           </listItem>
        </ListItemButton>
        )}
        <br />
        </List>

        <Divider />
        
        <Dialog
              open={clicked}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >

              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                ? האם אתה בטוח שאתה רוצה למחוק את המשתמש לצמיתות 
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>לא מסכים</Button>
                <Button onClick={handleDeleteUser} autoFocus>
                  מסכים
                </Button>
              </DialogActions>
            </Dialog>

        </Drawer>

    
        // <button className={styles['Menu']} onBlur={onExitMenuHandler} autoFocus>
        // <div className={styles['btns-list']}>

        // <LogoutBtn />
        // <br />

        //     <button className={styles['btn-delete-user']} onClick={handleClickOpen}>
        //         מחק את המשתמש לצמיתות
        //         <LiaUserSlashSolid size={24} />
            // </button>      
            // <Dialog
            //   open={clicked}
            //   onClose={handleClose}
            //   aria-labelledby="alert-dialog-title"
            //   aria-describedby="alert-dialog-description"
            // >

            //   <DialogContent>
            //     <DialogContentText id="alert-dialog-description">
            //     ? האם אתה בטוח שאתה רוצה למחוק את המשתמש לצמיתות 
            //     </DialogContentText>
            //   </DialogContent>
            //   <DialogActions>
            //     <Button onClick={handleClose}>לא מסכים</Button>
            //     <Button onClick={handleDeleteUser} autoFocus>
            //       מסכים
            //     </Button>
            //   </DialogActions>
            // </Dialog>


        //     <button className={styles['btn-change-interesets']} onClick={() => setChangingInterests(true)}>
        //         שינוי תחומי העיניין
        //         <AiFillTag size={24} />
        //     </button>
        //     <button className={styles['btn-change-pwd']} onClick={() => navigate('/restore-password')}>
        //         שינוי סיסמא
        //         <AiFillEdit size={24} />
        //     </button>

        //     {currentUser && currentUser.email === 'yaelzu1995@gmail.com' && (
        //         <button className={styles['btn-manage-users']} onClick={() => navigate('/manger')}>
        //             ניהול משתמשים
        //             <AiOutlineTeam size={24} />
        //         </button>
        //     )}
        // </div>
        // {/* interests floating modal */}
        // </button>

 



        
      
    )
}


// <button className={styles['Menu']} onBlur={onExitMenuHandler} autoFocus>
// <div className={styles['btns-list']}>
//     <button className={styles['btn-delete-user']} onClick={handleDeleteUser}>
//         מחק את המשתמש לצמיתות
//         <LiaUserSlashSolid size={24} />
//     </button>
//     <button className={styles['btn-change-interesets']} onClick={() => setChangingInterests(true)}>
//         שינוי תחומי העיניין
//         <AiFillTag size={24} />
//     </button>
//     <button className={styles['btn-change-pwd']} onClick={() => navigate('/restore-password')}>
//         שינוי סיסמא
//         <AiFillEdit size={24} />
//     </button>

//     {currentUser && currentUser.email === 'yaelzu1995@gmail.com' && (
//         <button className={styles['btn-manage-users']} onClick={() => navigate('/manger')}>
//             ניהול משתמשים
//             <AiOutlineTeam size={24} />
//         </button>
//     )}
// </div>
// {/* interests floating modal */}
// </button>










{/* <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>

        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment> */}





// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// // Firebase
// import { db } from '../firebase/config'
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '../firebase/config'
// import { updateDoc, doc, getDoc } from 'firebase/firestore'
// // Data
// import * as WordDifficulty from '../difficulty/WordDifficulty';
// // Assets
// import { LiaUserSlashSolid } from 'react-icons/lia'
// import { AiFillTag, AiFillEdit } from 'react-icons/ai'
// // Components
// import InterestsModal from './interests-modal';
// // Styles
// import styles from '../styles/components/menu.module.css'
// import { AiOutlineTeam } from "react-icons/ai";




// /**
//  * Component renders the app main menu.
//  */
// export default function Menu({ setMenuStatus }) {
  
//   // States
//   const navigate = useNavigate()
//   const [user, loading, error] = useAuthState(auth)
//   // Interests
//   const [changingInterests, setChangingInterests] = useState(false)
//   const [data, setData] = useState({
//     interests: [],
//     difficulty: 'easy'
//   })
//   const [currentUser, setCurrentUser] = useState(null);
//   const [clicked, setClicked] = useState(false);

  
//   // Handlers
//   const loadInterests = async () => {
//     // Determine if article is in favorite list
//     const userRef = doc(db, 'users', user?.uid)
//     const userDoc = await getDoc(userRef)
//     const userData = userDoc.data()
//     setData({
//       interests: userData.interests,
//       difficulty: userData.difficulty
//     })
//   }

//   const changeInterestsHandler = async data => {
//     // Function handles change of interests and difficulty
//     try {
//       // Update user interests
//       const userRef = doc(db, 'users', user?.uid)
//       await updateDoc(userRef, {
//         interests: data.interests,
//         difficulty: data.difficulty
//       })
//       setChangingInterests(false)
//     }
//     catch (error) {
//       console.log('Error updating user interests:', error.message);
//     }
//   }

//   const handleDeleteUser = async () => {
//     setClicked(true)
//     // Function handles user account deletion
//     // Confirm delete
//     const confirmDelete = window.confirm(
//       'Are you sure you want to delete your account forever? This action is irreversible.'
//     )

//     // If user canceled delete, return
//     if (!confirmDelete) return

//     try {
//       const user = auth.currentUser;
//       if (!user) return
//       // Delete the user account
//       const res = await user.delete()
//       console.log('User account deleted successfully.');
//       // Sign out and redirect to login page
//       auth.signOut()
//       window.location.href = '/login'; 
//     }
//     catch (error) {
//       console.error('Error deleting user:', error.message);
//     }
//   }

  

//   // Effects
//   useEffect(() => {
//     // On user load
//     console.log(user)
//     if (user) {
//         // Load data on initial page load.
//         loadInterests()
//     }

//      // Set up an authentication state observer
//      const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setCurrentUser(user);
//         console.log(user)
//       } else {
//         setCurrentUser(null);
//       }
//     });

//     // Cleanup the observer when the component unmounts
//     return () => unsubscribe();
// }, [user])


//   return (
//     <>
//       <div className={styles["Menu"]}>
//           <div className={styles["btns-list"]}>
//               <button onClick={handleDeleteUser}>
//                   מחק את המשתמש לצמיתות
//                   <LiaUserSlashSolid size={24} />
//               </button>
//               <button onClick={() => setChangingInterests(true)}>
//                   שינוי תחומי העיניין
//                   <AiFillTag size={24}/>
//               </button>
//               <button onClick={() => navigate('/restore-password')}>
//                   שינוי סיסמא
//                   <AiFillEdit size={24}/>
//               </button>

//               {currentUser && currentUser.email === 'yaelzu1995@gmail.com' && (
//                   <button onClick={() => navigate('/manger')}>
//                   ניהול משתמשים
//                   <AiOutlineTeam size={24}/>
//               </button>
//       )}
//           </div>
//           {/* interests floating modal */}
//       </div>
//       { changingInterests && <InterestsModal onSubmit={changeInterestsHandler} defaultData={data} /> }
//     </>
//   )
// }

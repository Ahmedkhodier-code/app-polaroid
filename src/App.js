import React, { useState, useEffect } from "react";
import './App.css';
import Post from './post.js';
import { db, auth } from './FireBase.js';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import Profile from './profile';
import 'react-slideshow-image/dist/styles.css'

//import firebase from 'firebase';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [userprof, setUserprof] = useState(null);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log("authUser", authUser);
        setUser(authUser);
        if (authUser.displayName) {
          setUserprof(authUser.displayName)
        } else {
          setUserprof(authUser.displayName)
          return authUser.updateProfile({
            displayName: username,

          });
        }
      } else {
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username]);
  useEffect(() => {
    if(true){}else{}
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })
        ));
    }
    
    
    )
  }, [username]);

  useEffect(() => {
    db.collection('profiles').where("username", "==", userprof).onSnapshot((snapshot) => {
      setProfile(
        snapshot.docs.map(doc => ({
          id: doc.id,
          profile: doc.data()
        })
        ));
    })
  }, [ userprof]);

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
    setOpen(false);
    db.collection("profiles").add({
      bio: 'empty',
      username: username,
      url: ''
    });
    console.log('new profile uploaded')


  }


  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)

      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  }


  return (
    <div className="app">


      <Modal
        open={open}
        onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img className="app__headerimage" alt="abc" src="https://firebasestorage.googleapis.com/v0/b/socialapp-react-862b7.appspot.com/o/images%2Fpolaroid-logo-black-and-white.png?alt=media&token=f5bd1378-2ee1-4630-9710-1a6ae369994d"></img>
            </center>
            <Input
              type='text'
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              
            />
            <Input
              type='email'
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>Sign Up</Button>

          </form>
        </div>

      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img className="app__headerimage" alt="abc" src="https://firebasestorage.googleapis.com/v0/b/socialapp-react-862b7.appspot.com/o/images%2Fpolaroid-logo-black-and-white.png?alt=media&token=f5bd1378-2ee1-4630-9710-1a6ae369994d"></img>
            </center>
            <Input
              type='email'
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>

          </form>
        </div>

      </Modal>
      <div className="app__header">

        <img className="app__headerimage" alt="abc" src="https://firebasestorage.googleapis.com/v0/b/socialapp-react-862b7.appspot.com/o/images%2Fpolaroid-logo-black-and-white.png?alt=media&token=f5bd1378-2ee1-4630-9710-1a6ae369994d"></img>
        {user?.displayName ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
            <Button className="" onClick={() => setOpenSignIn(true)}>Login</Button>
          </div>
        )}
      </div>

      <div className="app_search">
        <center>
      {user?.displayName ?
            (
              <div className="searchinp">
                <input  type="text" name="search" placeholder="Search..." onChange={(e) => setSearch(e.target.value)}></input>
                <div className="bsearch">
                <button  className="btn btn-primary" onClick={() => setOpen2(true)}> Search</button>
                <Button  className="butcancel"  onClick={() => setOpen2(false)}>  cancel </Button>
                </div>

              </div>
            ) : (
              <div>
              </div>
            )}
            </center>
            </div>
      <div className='app__posts'>

        <div className="app__postsLeft">
  
          {user?.displayName ?
          
            (
              posts.map(({ id, post }) => (

                <Post key={id}
                  postId={id}
                  user={user}
                  username={post.username}
                  caption={post.caption}
                  imgUrl={post.imgUrl}
                  profilepic={post.profilepic}
                   />
              ))
            ) : (
              <img alt="" src="" />
            )}
        </div>
        <div className="app_profile">
          {user?.displayName ?
            (<div>
              {
                
                profile.map(({ id, profile }) => (
                  <Profile key={id}
                    profileId={id}
                    user={user}
                    username={profile.username}
                    bio={profile.bio}
                    profilepic={profile.profilepic}
                    profimgurl={profile.profimgurl}
                  />
                ))
              }

            </div>
            ) : (
              <div className="logmess">
                <h2 className="h2">
                  Welcome to polaroid App.
              </h2>
                <h3 className="h3">
                  polaroid  helps you connect and share with the people in your life.
              </h3>
                <h2 className="h2">
                  Please Login or signup to connect and share Posts
                </h2>
              </div>

            )}
        </div>
      </div>

    </div>

  );
}
export default App;

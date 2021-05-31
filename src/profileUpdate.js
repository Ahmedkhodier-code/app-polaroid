import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import './App.css';
import { db, storage } from './FireBase.js';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import './ImageUpload.css';
import ImgUpload from './ImgUpload';

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


function Profile({profile, user }) {
    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [bio, setBio] = useState('');
    const [image, setImage] = useState(null);
    const [profimgurl , setProfimgurl]=useState('');

    //const [url, setUrl] = useState(" ");
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }
    const delprof = () => {
        db.collection('profiles').doc(profile).delete().catch((error)=>{
            console.log(error);
        })
    }

    const handleUpload = () => {
        console.log("old profile deleted");
        if(image){
        const uploadTask = storage.ref(`profilepics/${image.name}`).put(image);
        console.log("here2");
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("profilepics")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        setProfimgurl(url);
                        db.collection("profiles").add({
                            bio: bio,
                            profilepic: url,
                            username: user.displayName,
                        });
                        setProgress(0);
                        setBio('');
                        setImage(null);
                        setOpen(false);
                        delprof();
                    });
                    console.log("new profile uploaded")

            }

        )
    
    }else{alert("please choose a pic")}
}
    return (
        <div className="profile">
        <Modal
            open={open}
            onClose={() => setOpen(false)}>
            <div style={modalStyle} className={classes.paper}>
                <form className="app__signUp">
                    
                    <center>
                        <h2>
                            {bio}
                        </h2>
                    </center>
                    <progress className='ImageUpload__progress' value={progress} max="100" />
                    <input required type="text" placeholder="Update Bio ..." onChange={event => setBio(event.target.value)} />
                    <label>Upload Profile Picture</label>
                    <input type="file" onChange={handleChange} required/>
                    <Button onClick={handleUpload} variant='contained'> Update </Button>
                </form>
            </div>
            
        </Modal>
        <div className="homeprof">                      
              <button  type="button" className="btn btn-primary" onClick={() => setOpen(true)}>Update Profile</button>
        </div>
        <ImgUpload className="Img_Upload" username={user.displayName} profimgurl={profimgurl} />
        </div>

    );
}

export default Profile
import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { db, storage } from './FireBase.js';
import firebase from 'firebase';
import './ImageUpload.css';
import Webcam from "react-webcam";
import './webcamcom.css';


function ImgUpload({ username ,profimgurl}) {
    const [open, setOpen] = useState(null);
    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [image2, setImage2] = useState(null);
    
    const videoConstraints = {
        width: 350,
        height: 350,
        facingMode: "user"
    };
    const capture = React.useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        //-------------------------------------------------------------------------------------------
        const convertBase64ToFile = function (image) {
            const byteString = atob(image.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i += 1) {
              ia[i] = byteString.charCodeAt(i);
            }
            const newBlob = new Blob([ab], {
              type: 'image/png',
            });
            return newBlob;
          };
          setImage2( convertBase64ToFile(imageSrc));
        setImage(imageSrc);
        setImage2(imageSrc);
        setImgSrc(imageSrc);
        console.log(image2);
    }, [webcamRef, setImage, setImgSrc,image2]);
    const WebcamCapture = () => {
        return (

            <center>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    videoConstraints={videoConstraints}
                // encodingType={this.camera.EncodingType.PNG}


                />
                {imgSrc && (
                    <div>
                        <strong>Done</strong>
                        <h4>Preview:</h4>
                        <img
                            alt=""
                            src={image}
                        />
                    </div>
                )
                }
            </center>
        )
    };


    //const [url, setUrl] = useState(" ");
    const [progress, setProgress] = useState(0);
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }
    const handleUpload = () => {
        console.log("image", image);
        console.log("here 1");
        if(image){

        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        console.log("here 2");
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
                console.log("here 3");
                alert(error.message);
            },
            () => {
                console.log("here 4");
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imgUrl: url,
                            username: username,
                            profilepic: profimgurl

                        });
                        console.log("here 5");
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                    });
            }
        )
            }else{alert("please choose a pic")}
    }
    return (
        <div className='ImageUpload'>
            <progress className='ImageUpload__progress' value={progress} max="100" />
            <input type="text" placeholder="Enter a Caption" onChange={event => setCaption(event.target.value)} />
            <div className="getimg">
                <input className="fileimg" type="file" onChange={handleChange} />
                {/*-------------------------------------------------------------------------------------------------------------*/}
            </div>
            <div >
                <button onClick={() => setOpen(true)} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Take from Cam
            </button>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Take a pic</h5>
                                <button onClick={() => setOpen(false)} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {open ? (
                                    <WebcamCapture />

                                ) : (
                                    <div>camera off</div>
                                )}
                            </div>
                            <div className="modal-footer">

                                <button onClick={() => setOpen(false)} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                {imgSrc ? (
                                    <div>
                                        <button onClick={capture} type="button" className="btn btn-primary">Retake</button>
                                    </div>
                                ) : (
                                    <div>
                                        <button onClick={capture} type="button" className="btn btn-primary">snapshot</button>
                                    </div>
                                )
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            <Button onClick={handleUpload} variant='contained'  >
                Upload
            </Button>
        </div>
    )
}

export default ImgUpload

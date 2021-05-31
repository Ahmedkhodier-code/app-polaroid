import React, { useState, useEffect } from 'react';
import './post.css';
import Avatar from "@material-ui/core/Avatar";
import { db } from './FireBase.js';
import firebase from 'firebase';

function Post({ postId, user, username, caption, imgUrl, profilepic }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [count, setCount] = useState(0);

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "asc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })
        }
        return () => {
            unsubscribe();
        }
    }, [postId]);

    const postComment = (event) => {
        setCount(count + 1);
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    const delpost = () => {
        db.collection('posts').doc(postId).delete().catch((error) => {
            console.log(error);
        })
    }

    return (

        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" src={profilepic} alt={username} />
                <h3>{username}</h3>
                <div className="db">
                {user.displayName === username ? (<div >
                    <button className="btn btn-primary" onClick={() => delpost()}> Delete</button>
                </div>
                ) : (<div></div>)
                }
            </div>
            </div>
            <img className="post__image" alt="abc" src={imgUrl}></img>
            <h4 className="post__text"><strong>{username} : </strong> {caption}</h4>
            <div className="post__comments">
                {
                    comments.map((comment) => {

                        return <p key={count} className="commentstyle">

                            <strong>{comment.username}:</strong> {comment.text}
                        </p>
                    })
                }
            </div>
            {user && (

                <form className="post__commentsBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a comment.."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button

                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment} >Post
                    </button>

                </form>
            )}
        </div>
    )
}

export default Post;


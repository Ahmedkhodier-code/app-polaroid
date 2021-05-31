import React from 'react';
import './profile.css';
import Avatar from "@material-ui/core/Avatar";
import ProfileUpdate from './profileUpdate';

// import { db } from './FireBase.js';
// import firebase from 'firebase';

function Profile({profileId, user, username, bio, profilepic }) {
    console.log("profile1",profileId);
    return (

        <div className="profile">
            <div className="profile__header">
                <Avatar className="profile__header__avatar" src={profilepic} alt={username} />
                <h5>{username}</h5>
            </div>

            <img className="profile__header__image" alt="empty pic" src={profilepic}></img>
            <h4 className="profile__header__text"><strong>Bio : </strong> {bio}</h4>
            <ProfileUpdate profile={profileId} user={user} username={user.displayName}  />
        </div>
    )
}

export default Profile;


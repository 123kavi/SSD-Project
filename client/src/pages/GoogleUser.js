import React from "react";
import Google  from '../img/28-288899_free-icons-png-google-plus-logo-2017-clipart.png'
import FaceBook from '../img/download.png'
import { GoogleLogin } from 'react-google-login';

const GoogleUser =()=>{
     const google =()=>{
        window.open("http://localhost:5000/auth/google", "_self");
        
     }

    return(
        <div>
         <h1 className="logintitle">Choose The Login Method</h1>
        <div className="login">
            <div className="wrapper">
                <div className="left">
                    <div className="logiButton">
                    <img src={Google} alt="" className="Logo" onClick={google} />
                        google
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default GoogleUser
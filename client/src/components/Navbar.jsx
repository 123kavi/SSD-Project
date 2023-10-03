import  React from 'react'
import {Link} from 'react-router-dom'
import Card from './Welcome';


const NavBar =({user})=>{
  const logout = () => {
      window.open("http://localhost:5000/auth/logout", "_self");
    };
  return(
      <div className="navbar">
      <span className="logo">
      </span>
      {user ? (
        <ul className="list">
          {/* <li className="listItem">
            <img
              src={user.ProfilePic}
              alt=""
              className="avatar" 
            />
          </li> */}
         
   

        </ul>
      ) : (
        <Link className="link" to="login">
        </Link>
      )}
    </div>
  )
}

export default NavBar
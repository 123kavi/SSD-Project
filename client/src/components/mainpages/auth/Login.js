import React, { useState } from 'react';
import { Link ,useHistory} from 'react-router-dom';
import axios from 'axios';
import Header1 from '../../headers/Header1';
import {showErrMsg, showSuccessMsg} from '../utils/notification/Notification'
import DOMPurify from 'dompurify'; // Import DOMPurify
import {dispatchLogin} from '../../redux/actions/authAction'
import {useDispatch} from 'react-redux'
const initialState = {
  email: '',
  password: '',
  err: '',
  success: ''
}

function Login() {
  const [user, setUser] = useState(initialState)
    const dispatch = useDispatch()
    const history = useHistory()

    const {email, password, err, success} = user


  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({...user, [name]: DOMPurify.sanitize(value), err: '', success: ''})
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/user/login', {email, password})
      setUser({...user, err: '', success: res.data.msg})

      localStorage.setItem('firstLogin', true)

      dispatch(dispatchLogin())
      history.push("/home")
    }  catch (err) {
      err.response.data.msg && 
      setUser({...user, err: err.response.data.msg, success: ''})
  }
  };

  const handleLoginWithGoogle =()=>{
    window.open("http://localhost:5000/auth/google", "");
 }
  return (
    <><Header1 /><div className="login-page">

      <form onSubmit={loginSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          value={user.email}
          onChange={onChangeInput} />

        <input
          type="password"
          name="password"
          required
          autoComplete="on"
          placeholder="Password"
          value={user.password}
          onChange={onChangeInput} />

        <div className="row">
          <button type="submit">Login</button>
          
          <Link to="/register">Register</Link>
        </div>
        <Link to="/forgot_password">Forgot your password?</Link>

      </form>
     

<div class="google-btn">
  <div class="google-icon-wrapper">
    <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
  </div>      <button  class="btn-text" onClick={handleLoginWithGoogle}>Login with Google</button>

</div>
    </div>
    
    
    </>

  );
  
}

export default Login;

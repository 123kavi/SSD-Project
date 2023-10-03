import React,{useState,useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import {DataProvider} from './GlobalState'
import Header from './components/headers/Header'
import Header1 from './components/headers/Header'
import MainPages from './components/mainpages/Pages'
import NavBar from './components/Navbar';
function App() {
  const [User,setUser] =useState(null)
   useEffect(() => {
   const getUser = () => {
     fetch("http://localhost:5000/auth/login/sucess", {
       method: "GET",
       credentials: "include",
       headers: {
         Accept: "application/json",
         "Content-Type":"application/json",
         "Access-Control-Allow-Credentials": true,
       },
     })
       .then((response) => {
         console.log(response,"sfhejr")
         if (response.status === 201) return response.json();
         throw new Error("authentication has been failed!");
       })
       .then((resObject) => {
         console.log(resObject.data,"hum dsa")
         setUser(resObject.data);
       })
       .catch((err) => {
         console.log(err);
       });
   };
  getUser();
 }, []);
 console.log(User,"vikas")

 


  return (
    <DataProvider>
      <Router>
        <div className="App">
        <NavBar user={User}/>
       
          <MainPages />
        </div>
      </Router>
    </DataProvider>
  );
  }
export default App;

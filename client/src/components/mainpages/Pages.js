import React, { useState, useEffect, useContext } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import NavBar from "../Navbar";
import Products from "./products/Products";
import DetailProduct from "./detailProduct/DetailProduct";
import Login from "./auth/Login";
import Register from "./auth/Register";
import OrderHistory from "./history/OrderHistory";
import OrderDetails from "./history/OrderDetails";
import Cart from "./cart/Cart";
import NotFound from "./utils/not_found/NotFound";
import Categories from "./categories/Categories";
import CreateProduct from "./createProduct/CreateProduct";
import GoogleUser from "../../pages/GoogleUser";
import HomeProduct from "./products/HomeProduct";
import { GlobalState } from "../../GlobalState";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import ActivationEmail from "../mainpages/auth/ActivationEmail";
import ForgotPass from "../mainpages/auth/ForgotPassword";
import ResetPass from "../mainpages/auth/ResetPassword";
import Home from "../mainpages/home/Home";
import Profile from "../mainpages/profile/Profile";
import EditUser from "./profile/EditUser";

function Pages() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [User, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:5000/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 201) return response.json();
          throw new Error("Authentication has failed!");
        })
        .then((resObject) => {
          setUser(resObject.data);
          if (resObject.data) {
            history.push("/register");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, [history]);

  return (
    <section>
      {" "}
      <Switch>
        <Route path="/" exact component={HomeProduct} />
        <Route path="/home" exact component={Products} />
        <Route path="/detail/:id" exact component={DetailProduct} />
        <Route path="/login" component={Login} exact />
        <Route path="/register" component={Register} exact />

        <Route path="/google" component={GoogleUser} />
        <Route
          path="/category"
          exact
          component={isAdmin ? Categories : NotFound}
        />
        <Route
          path="/create_product"
          exact
          component={isAdmin ? CreateProduct : NotFound}
        />
        <Route
          path="/edit_product/:id"
          exact
          component={isAdmin ? CreateProduct : NotFound}
        />
        <Route path="/history" exact component={OrderHistory} />
        <Route path="/history/:id" exact component={OrderDetails} />
        <Route path="/cart" exact component={Cart} />

        <Route
          path="/forgot_password"
          component={isLogged ? NotFound : ForgotPass}
          exact
        />
        <Route
          path="/user/reset/:token"
          component={isLogged ? NotFound : ResetPass}
          exact
        />

        <Route
          path="/user/activate/:activation_token"
          component={ActivationEmail}
          exact
        />

        <Route path="/profile" component={Profile} exact />
        <Route path="/edit_user/:id" component={EditUser} exact />
      </Switch>{" "}
    </section>
  );
}

export default Pages;

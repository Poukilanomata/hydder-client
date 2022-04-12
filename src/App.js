import React, { useState } from 'react';

import Main from './components/main';
import Right from './components/utils/right';
import Header from './components/header';
import Account from './components/account';

import TermsAndConditions from './components/other/terms_and_conditions';
import PrivacyPolicy from './components/other/privacy-policy';

import params from './variables'

import { CookiesProvider } from "react-cookie";
import {isMobile} from 'react-device-detect';
import axios from 'axios';

import { connect } from 'react-redux';
import { changeStatus, initUser } from './app/auth';
import { get_user } from './utils/functions';

// login
import Login from './components/login';

import {
  BrowserRouter,
  Route,
  Routes,
  useParams,
  Navigate
} from "react-router-dom"


import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.withCredentials = true;

function App(props) {

  function Mainpage(props){
    document.title = "Hydder | Only the best";
    let [is_loading, set_loading] = useState(false);

    let { id } = useParams();

    if(!is_loading){
      set_loading(true);
      get_user()
    }
    return(
      <div id='main-page'>
        <Header/>
        <Main post_id={id}/>
        <ToastContainer />
        {!isMobile ? <Right/> : null}
      </div>
    )
  }

  function AccountPage(props){

    let { id } = useParams();
    let [is_loading, set_loading] = useState(false);

    if(!is_loading){
      set_loading(true);
      get_user()
    }
    return(
      <>
        <Header/>
        <Account id={id} />
        <ToastContainer />
      </>
    )
  }

  function LoginPage(props){
    document.title = "Welcome to Hydder";
    return(
      <>
        <Login />
        <ToastContainer />
      </>
    )
  }

  function Mainpost(props){
    document.title = "Hydder | Only the best";
    let { id } = useParams();
    let [is_loading, set_loading] = useState(false);

    if(!is_loading){
      set_loading(true);
      get_user()
    }

    if(!id) {
      return(
        <Navigate to='/'/>
      )
    }else {
      return(
        <div id='main-page'>
          <Header/>
          <Main post_id={id} shared={true}/>
          <Right />
          <ToastContainer />
          {!isMobile ? <Right/> : null}
        </div>
      )
    }
  }

  function General(props) {
    return(
      <>
        
      </>
    )
  }

  return (
    <>
      <CookiesProvider>
      <BrowserRouter>
      <Routes component={<General/>}>
        <Route path="/" element={<Mainpage/>} />
        <Route path="/:id" element={<Mainpage />} />
        <Route path="/post/:id" element={<Mainpost />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/account/:id" element={<AccountPage />} />
        <Route exact path="/terms_and_conditions" element={<TermsAndConditions />} />
        <Route exact path="/privacy_policy" element={<PrivacyPolicy />} />
      </Routes>
      </BrowserRouter>
      </CookiesProvider>
    </>
  );
}

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps, { changeStatus, initUser })(App);

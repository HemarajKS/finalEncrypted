import Login from '../../components/Login/login';
import SignUp from '../../components/signUp/signUp';
import './landingPage.css';
import { Routes, Route, Link } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const LandingPage = (child: any) => {
  const [displaySnackBar, setDisplaySnackBar] = useState(false);
  const [path, setPath] = useState(
    window.location.pathname === '/landing/login' || '/' ? 'login' : 'signup'
  );

  window.addEventListener('popstate', (e) => {
    // Nope, go back to your page
    window.history.go(1);
  });

  const signUpSuccess = () =>
    toast.success('SignUp Successful', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });

  window.addEventListener('popstate', (e) => {
    // Nope, go back to your page
    window.history.go(1);
  });

  useEffect(() => {
    setDisplaySnackBar(Boolean(sessionStorage.getItem('signUpSuccess')));
    sessionStorage.removeItem('signUpSuccess');
  }, []);

  setInterval(() => {
    setDisplaySnackBar(false);
  }, 2000);

  console.log('current', path);
  useEffect(() => {
    console.log(window.location.pathname);
  });

  if (displaySnackBar) {
    signUpSuccess();
  }

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="loginLogoContainer">
          <div className="loginLogo">
            <img
              src={require('../../assets/images/logo.png')}
              alt="Login Logo"
              className="imgOne"
            />
            <img
              src={require('../../assets/images/logo (3).png')}
              alt="Login Logo"
              className="imgTwo"
            />
          </div>
          <div className="loginLogoBody">
            Protect & Manage every password in your business
          </div>
          <div className="signInsignUpTab">
            <Link
              className={path === 'login' ? 'signInsignUpTabunderline' : ''}
              to="/landing/login"
              onClick={() => {
                setPath('login');
              }}
            >
              SIGN IN
            </Link>
            <Link
              className={path === 'signup' ? 'signInsignUpTabunderline' : ''}
              onClick={() => {
                setPath('signup');
              }}
              to="/landing/signUp"
            >
              SIGN UP
            </Link>
          </div>
        </div>
        <div className="loginForm">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
          </Routes>
          {child !== '{}' ? child.props : ''}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LandingPage;

import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import bcrypt from 'bcryptjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Login = () => {
  const navigate = useNavigate();
  const [togglePass, setTogglePass] = useState(false);
  const [mobileLength, setMobileLength] = useState('');
  const [mPinLength, setMPinLength] = useState('');

  const incorrectCredentials = () =>
    toast.warning('Please enter correct user name or Password', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });

  const togglePassword = () => {
    setTogglePass(!togglePass);
  };

  async function emptyUserhashFunc(user: any) {
    const salt = await bcrypt.genSalt(10);
    user.mPin = await bcrypt.hash(user.mPin, salt);
    localStorage.setItem(
      'user Data',
      JSON.stringify(localStorage.setItem('users', JSON.stringify([user])))
    );
  }

  async function comparePassord(mPin: any, hashedMPin: any, mobileNo: any) {
    const isMatch = await bcrypt.compare(mPin, hashedMPin);
    if (isMatch) {
      localStorage.setItem('auth', 'authenticated');
      navigate('/');
      localStorage.setItem('currentUser', mobileNo);
      window.location.reload();
    } else {
      incorrectCredentials();
    }
  }

  if (localStorage.getItem('users') === null) {
    const user = { mobileNo: '9945810342', mPin: '9945' };
    emptyUserhashFunc(user);
  }

  const loginHandler = (e: any) => {
    e.preventDefault();
    type usersType = { mobileNo: number; mPin: number };

    const mobileNo = e.target.mobileNo.value;
    const mPin = e.target.mPin.value;

    const userData = { mobileNo, mPin };
    console.log('userData', userData);

    const users: usersType[] = JSON.parse(
      localStorage.getItem('users') || '[]'
    );
    console.log('users', users);

    let verifyCredentials = [];

    if (JSON.stringify(userData.mobileNo).length - 2 === 10) {
      if (JSON.stringify(userData.mPin).length - 2 === 4) {
        for (let i = 0; i < users.length; i++) {
          if (userData.mobileNo === users[i].mobileNo) {
            comparePassord(userData.mPin, users[i].mPin, mobileNo);
            verifyCredentials = [];
          } else {
            verifyCredentials.push('noData');
          }
        }
      } else {
        setMPinLength('four');
      }
    } else {
      setMobileLength('ten');
    }

    if (verifyCredentials.includes('noData')) {
      incorrectCredentials();
    }
  };

  return (
    <div className="loginPage">
      <div className="loginFormTitle">SIGN IN TO YOUR ACCOUNT</div>
      <div className="loginFormBody">
        <form onSubmit={loginHandler}>
          <div className="inputContainer">
            <div>
              <input
                type="number"
                className="input"
                placeholder="Mobile Number"
                name="mobileNo"
                required
              />
              {mobileLength === 'ten' && (
                <div className="errorInput">
                  Mobile number should be of 10 digits
                </div>
              )}
            </div>

            <div className="loginPW">
              <input
                type={togglePass ? 'number' : 'password'}
                className="input"
                placeholder="MPin"
                name="mPin"
                required
              />
              <img
                src={require('../../assets/icons/eye_on.png')}
                alt="Password Eye"
                className="eyeIcon"
                onClick={togglePassword}
              />
              {mPinLength === 'four' && (
                <div className="errorInput">Mpin should be of 4 digits</div>
              )}
            </div>
          </div>
          <div className="forgotPassword">
            <div>Forgot your password?</div>
          </div>
          <div className="signInButton">
            <button>SIGN IN</button>
          </div>
        </form>
      </div>
      <div className="signUpLink">
        <div>
          {' '}
          Don’t have a Account? <Link to="/landing/signUp"> SIGNUP</Link>
        </div>
      </div>
      <div className="fingerPrintContainer">
        <div className="fingerPrintLogo">
          <img
            src={require('../../assets/icons/fingerprint icon.png')}
            alt="fingerPrint"
          />
        </div>
        <div className="fingerPrintBody">
          <div className="or">OR</div>
          <div className="fingerPrintText">Use your fingerprint to login</div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;

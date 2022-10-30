import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import bcrypt from 'bcryptjs';

const Login = () => {
  const navigate = useNavigate();
  const [togglePass, setTogglePass] = useState(false);

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
      alert('Please enter correct userName or Password');
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

    for (let i = 0; i < users.length; i++) {
      if (userData.mobileNo === users[i].mobileNo) {
        comparePassord(userData.mPin, users[i].mPin, mobileNo);
      }
    }
  };

  return (
    <div className="loginPage">
      <div className="loginFormTitle">SIGN IN TO YOUR ACCOUNT</div>
      <div className="loginFormBody">
        <form onSubmit={loginHandler}>
          <div className="inputContainer">
            <input
              type="text"
              className="input"
              placeholder="Mobile Number"
              name="mobileNo"
              required
            />
            <div className="loginPW">
              <input
                type={togglePass ? 'text' : 'password'}
                className="input"
                placeholder="MPin"
                name="mPin"
                minLength={4}
                maxLength={4}
                required
              />
              <img
                src={require('../../assets/icons/eye_on.png')}
                alt="Password Eye"
                className="eyeIcon"
                onClick={togglePassword}
              />
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
    </div>
  );
};

export default Login;

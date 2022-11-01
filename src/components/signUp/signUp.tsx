import '../../components/Login/login.css';
import '../../components/signUp/signUp.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const SignUp = () => {
  const [match, setMatch] = useState('');
  const [mPinLength, setMPinLength] = useState('');
  const [mobileLength, setMobileLength] = useState('');

  const userExists = () =>
    toast.error('User already exists', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });

  async function emptyUserhashFunc(user: any) {
    const salt = await bcrypt.genSalt(10);
    user.mPin = await bcrypt.hash(user.mPin, salt);
    localStorage.setItem(
      'user Data',
      JSON.stringify(localStorage.setItem('users', JSON.stringify([user])))
    );
  }

  async function hashFunc(previousData: any, userData: any) {
    localStorage.setItem(JSON.stringify(userData.mobileNo), '[]');

    const salt = await bcrypt.genSalt(10);
    userData.mPin = await bcrypt.hash(userData.mPin, salt);
    previousData.push(userData);
    console.log('pre', previousData);
    localStorage.setItem('users', JSON.stringify(previousData));
    sessionStorage.setItem('signUpSuccess', 'true');
    navigate('/landing/login');
    window.location.reload();
  }

  type usersType = { mobileNo: number; mPin: number };
  const [togglePass, setTogglePass] = useState(false);
  const navigate = useNavigate();

  if (localStorage.getItem('users') === null) {
    const user = { mobileNo: '9945810342', mPin: '9945' };
    emptyUserhashFunc(user);
  }

  const togglePassword = () => {
    setTogglePass(!togglePass);
  };

  const signUpHandler = (e: any) => {
    e.preventDefault();

    const mobileNo: number = e.target.mobileNo.value;
    const newMPin: number = e.target.newMPin.value;
    const confirmMpin: number = e.target.confirmMPin.value;

    const userData = { mobileNo, mPin: newMPin };

    const previousData: usersType[] = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    console.log('userData', previousData);

    if (JSON.stringify(mobileNo).length - 2 === 10) {
      if (previousData.length > 0 && mobileNo) {
        const mappedUser = previousData.map((user) => {
          if (user.mobileNo === mobileNo) {
            return 'user';
          }
          return 'no user';
        });

        if (JSON.stringify(newMPin).length - 2 === 4) {
          if (newMPin === confirmMpin) {
            if (mappedUser.includes('user')) {
              userExists();
            } else if (mappedUser.includes('no user')) {
              hashFunc(previousData, userData);
            }
          } else {
            // alert('mPin does not match');
            setMatch('false');
          }
        } else {
          // alert('mPin should be 4 digits');
          setMPinLength('four');
        }
      } else if ((previousData.length = 0 && mobileNo)) {
      }
    } else {
      setMobileLength('ten');
    }
  };

  return (
    <div className="loginPage">
      <div className="signUpFormTitle">SIGN UP</div>
      <div className="loginFormBody">
        <form onSubmit={signUpHandler}>
          <div className="inputContainer">
            <div>
              <input
                type="number"
                className="input"
                placeholder="Enter Mobile Number"
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
                type="number"
                className="input"
                placeholder="Enter 4 Digit MPin"
                name="newMPin"
                required
              />
              {mPinLength === 'four' && (
                <div className="errorInput">Mpin should be of 4 digits</div>
              )}
            </div>
            <div className="loginPW">
              <input
                type={togglePass ? 'number' : 'password'}
                className="input"
                placeholder="MPin"
                name="confirmMPin"
                required
              />
              <img
                src={require('../../assets/icons/eye_on.png')}
                alt="Password Eye"
                className="eyeIcon"
                onClick={togglePassword}
              />
              {match === 'false' && (
                <div className="errorInput">Mpins Does not match</div>
              )}
            </div>
          </div>

          <div className="signUnButton">
            <button>SIGN UP</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;

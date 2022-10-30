import '../../components/Login/login.css';
import '../../components/signUp/signUp.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
const SignUp = () => {
  const [mobileRegex, setMobileRegex] = useState(true);
  const [mpinRegex, setMpinRegex] = useState(true);
  const [mpinMatch, setMpinMatch] = useState(true);

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
  const mobileRegexExp =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  const mPinRegexExp = /^\d{4}$/;
  const regexValidate = (mobileNo: any, newMPin: any, confirmMPin: any) => {
    if (mobileRegexExp.test(mobileNo) === true) {
      setMobileRegex(true);
    } else {
      setMobileRegex(false);
    }
    if (mPinRegexExp.test(newMPin) === true) {
      setMpinRegex(true);
    } else {
      setMpinRegex(false);
    }
    if (newMPin === confirmMPin) {
      setMpinMatch(true);
    } else {
      setMpinMatch(false);
    }
  };
  const signUpHandler = (e: any) => {
    e.preventDefault();

    const mobileNo: any = e.target.mobileNo.value;
    const newMPin: any = e.target.newMPin.value;
    const confirmMpin: any = e.target.confirmMPin.value;

    regexValidate(mobileNo, newMPin, confirmMpin);

    const userData = { mobileNo, mPin: newMPin };

    const previousData: usersType[] = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    console.log('userData', previousData);

    if (previousData.length > 0 && mobileNo) {
      if (mobileRegex && mpinRegex && mpinMatch) {
        const mappedUser = previousData.map((user) => {
          if (user.mobileNo === mobileNo) {
            return 'user';
          }
          return 'no user';
        });

        if (newMPin === confirmMpin) {
          if (mappedUser.includes('user')) {
            alert('user already exist');
          } else if (mappedUser.includes('no user')) {
            hashFunc(previousData, userData);
          }
        } else {
          setMpinMatch(false);
          // alert('mPin does not match');
        }
      }
    } else if ((previousData.length = 0 && mobileNo)) {
    }
  };
  console.log(mobileRegex, mpinRegex, mpinMatch);
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
                minLength={10}
                maxLength={10}
              />
              {!mobileRegex && <div>Enter valid mobile number</div>}
            </div>
            <div className="loginPW">
              <input
                type="text"
                className="input"
                placeholder="Enter 4 Digit MPin"
                minLength={4}
                maxLength={4}
                name="newMPin"
              />
              {!mpinRegex && <div>Enter valid mPin</div>}
            </div>
            <div className="loginPW">
              <input
                type={togglePass ? 'text' : 'password'}
                className="input"
                placeholder="MPin"
                minLength={4}
                maxLength={4}
                name="confirmMPin"
              />
              <img
                src={require('../../assets/icons/eye_on.png')}
                alt="Password Eye"
                className="eyeIcon"
                onClick={togglePassword}
              />
              {!mpinMatch && <div>Passwords does not match</div>}
            </div>
          </div>

          <div className="signUnButton">
            <button>SIGN UP</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

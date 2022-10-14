import { useState } from 'react'
import './App.css';
import { Auth } from 'aws-amplify';

Auth.configure({
  authenticationFlowType: 'CUSTOM_AUTH'
});

function App() {
  const [username,set_username] = useState('');
  const [confirmCode, set_confirmCode] = useState('')
  const [cognitoUser, set_cognitoUser] = useState({})
  const [OTP,set_OTP] = useState('')

  const [userState,set_userState] = useState('signUp')

  const newUser = async () => {
    try {
      const res = await Auth.signUp(username,username);
      console.log(res);
      set_userState('confirmSignUp')
    } catch(e){
      console.error(e);
    }
  }

  const confirmNewUser = async () => {
    try {
      const res = await Auth.confirmSignUp(username,confirmCode);
      console.log(res);
      set_userState('signIn')
    } catch(e){
      console.error(e)
    }
  }

  const login = async () => {
    try {
      const res = await Auth.signIn(username,username);
      console.log(res);
      set_cognitoUser(res);
      set_userState('OTP')
    } catch(e) {
      console.error(e)
    }
  }

  const OTPlogin = async () => {
    try {
      const res = await Auth.sendCustomChallengeAnswer(cognitoUser,OTP);
      console.log(res);
      set_userState('signedIn')
    } catch(e){
      console.error(e)
    }
  }

  const current = async () => {
    try {
      const res = await Auth.currentAuthenticatedUser();
      console.log('Current user:',res);
    } catch(e){
      console.log(e);
    }
  }

  return (
    <div className="App">
        <h1>Amplify with OTP</h1>
      {
        userState === 'signUp' && (
          <div>
            <h2>Sign Up</h2>
            <input type="text" placeholder="username" onChange={(e) => set_username(e.target.value)}/><br />
            <button onClick={newUser}>Sign Up</button>
            <p onClick={() => set_userState('signIn')}>Sign In Instead</p>
          </div>
        )
      }
      {
        userState === 'confirmSignUp' && (
          <div>
            <h2>Confirm Sign Up</h2>
            <input type="text" placeholder="username" onChange={(e) => set_username(e.target.value)}/><br />
            <input type="text" name="confirmCode" onChange={(e) => set_confirmCode(e.target.value) } /><br />
            <button onClick={confirmNewUser}>Confirm</button>
          </div>
        )
      }
      {
        userState === 'signIn' && (
          <div>
            <h2>Sign In</h2>
            <input type="text" placeholder="username" onChange={(e) => set_username(e.target.value)} /><br />
            <button onClick={current}>Current</button>
            <button onClick={login}>Log In</button>
          </div>
        )
      }
      {
        userState === 'OTP' && (
          <div>
            <h2>One Time Password</h2>
            <input type="text" onChange={e => set_OTP(e.target.value)} />
            <button onClick={OTPlogin}>MFA</button>
          </div>
        )
      }
      {
        userState === "signedIn" && (
          <div>
            <h2>Welcome!</h2>
            <button onClick={current}>Current</button>
            <button onClick={() => {
              Auth.signOut();
              set_userState('signIn')
            }}>SignOut</button>
          </div>
        )
      }
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom';

const Login = ({ login })=> {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async(ev) => {
    ev.preventDefault();
    await login({ username, password });
  }
  return (
    <form onSubmit={ submit }>
      <input value={ username } placeholder='username' onChange={ ev=> setUsername(ev.target.value)}/>
      <input value={ password} placeholder='password' onChange={ ev=> setPassword(ev.target.value)}/>
      <button disabled={ !username || !password }>Login</button>
    </form>
  );
}

function App() {
  const [auth, setAuth] = useState({});

  useEffect(()=> {
    attemptLoginWithToken();
  }, []);

  const attemptLoginWithToken = async()=> {
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await fetch(`/api/auth/me`, {
        headers: {
          authorization: token
        }
      });
      const json = await response.json();
      if(response.ok){
        setAuth(json);
      }
      else {
        window.localStorage.removeItem('token');
      }
    }
  };

  const login = async(credentials)=> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();
    if(response.ok){
      window.localStorage.setItem('token', json.token);
      attemptLoginWithToken();
    }
    else {
      throw json;
    }
  };

  const logout = ()=> {
    window.localStorage.removeItem('token');
    setAuth({});
  };

  return (
    <>
      {
        !auth.id ? <>
          <Login login={ login }/>
          </>
        : <button onClick={ logout }>Logout { auth.username }</button>
      }
      {
        !!auth.id && (
          <nav>
            <Link to='/'>Home</Link>
            <Link to='/faq'>FAQ</Link>
          </nav>
        )
      }
      {
        !!auth.id && (
          <Routes>
            <Route path='/' element={<h1>Home</h1>} />
            <Route path='/faq' element={<h1>FAQ</h1>} />
          </Routes>
        )
      }
    </>
  )
}

export default App

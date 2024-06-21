import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = () => {
    const payload = { email, password };
    axios.post('https://dealday.onrender.com/login', payload)
      .then((e) => {
        if (e.data.status === "success") {
          navigate(`/dashbord/${e.data.id}`);
        } else if (e.data.status === "fail") {
          alert("Wrong password");
        } else if (e.data.status === "noUser") {
          alert("Invalid Email");
        }
      });
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='max-w-lg w-full bg-white p-8 rounded-lg shadow-lg'>
        <h1 className='text-center font-bold text-2xl mb-6'>Login Form</h1>
        <div className='space-y-4'>
          <input
            className='w-full bg-yellow-200 border-2 border-violet-400 text-black p-2 rounded placeholder-black'
            placeholder='Email'
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className='w-full bg-yellow-200 border-2 border-violet-400 text-black p-2 rounded placeholder-black'
            placeholder='Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className='w-full bg-red-300 text-white rounded-lg p-2'
            onClick={login}
          >
            LOGIN
          </button>
          <p className='text-center'>
            Don't have an account?{' '}
            <Button variant='outlined'>
              <Link to='/register'>Sign Up</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

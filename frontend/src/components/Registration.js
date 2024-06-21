import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const Registration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnfPassword, setCnfPassword] = useState('');
  const navigate = useNavigate();

  const submitForm = () => {
    const payload = {
      name, email, password
    };
    if (!name || !email || !password || !cnfPassword) {
      alert("To register, fill all the fields!");
    } else {
      if (password === cnfPassword) {
        axios.post('https://dealday.onrender.com/register', payload)
          .then((e) => {
            alert(e.data);
            navigate("/");
          })
          .catch((e) => {
            alert("Problem in sending data to the backend!");
          });
      } else {
        alert("Both passwords should match!");
      }
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-neutral-300'>
      <div className='max-w-lg w-full bg-white p-8 rounded-lg shadow-lg'>
        <h1 className='text-center font-bold text-2xl mb-6'>Admin Registration Form</h1>
        <div className='space-y-4'>
          <input
            className='w-full bg-white border-2 border-violet-400 text-black p-2 rounded placeholder-black'
            placeholder='Enter Full Name'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className='w-full bg-white border-2 border-violet-400 text-black p-2 rounded placeholder-black'
            placeholder='Enter Email'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className='w-full bg-white border-2 border-violet-400 text-black p-2 rounded placeholder-black'
            placeholder='Enter Password'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className='w-full bg-white border-2 border-violet-400 text-black p-2 rounded placeholder-black'
            placeholder='Retype Password'
            type="password"
            value={cnfPassword}
            onChange={(e) => setCnfPassword(e.target.value)}
            required
          />
          <button
            className='w-full bg-red-300 text-white rounded-lg p-2'
            onClick={submitForm}
          >
            Register Me
          </button>
          <p className='text-center'>
            Already have an account?{' '}
            <Button variant="outlined">
              <Link to='/'>Sign In</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;

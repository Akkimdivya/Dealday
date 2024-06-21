import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';

const DashBord = () => {
  const [name, setName] = useState("");
  const { ID } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:4001/user/${ID}`)
      .then((response) => {
        setName(response.data.name);
      })
      .catch(() => {
        console.log("Unable to fetch data");
      });
  }, [ID]);

  return (
    <div>
      <nav className='bg-gray-300 p-4'>
        <ul className='flex gap-4 justify-center'>
          <li><Link to='/'>Home</Link></li>
          <li><Button variant="text"><Link to='/create-employee'>Create Employee</Link></Button></li>
          <li><Button variant="text"><Link to="/employee-list">Employee List</Link></Button></li>
          <li className='text-red-500'>{name}</li>
          <li><Button variant="text"><Link to='/logout'>Logout</Link></Button></li>
        </ul>
      </nav>
      <h1 className='text-center text-2xl mt-6'>Dashboard</h1>
      <p className='text-center mt-2'>Welcome to the admin panel</p>
    </div>
  );
};

export default DashBord;

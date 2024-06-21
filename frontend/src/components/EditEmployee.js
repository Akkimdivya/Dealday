import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');
  const [courses, setCourses] = useState([]);
  const [image, setImage] = useState(null);
  const [prevImage, setPrevImage] = useState(null);

  const { ID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://dealday.onrender.com/employee-list/${ID}`)
      .then((res) => {
        const data = res.data;
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setDesignation(data.designation);
        setGender(data.gender);
        setCourses(data.course);
        setPrevImage(data.image);
      })
      .catch(() => {
        console.log("Error fetching employee data");
      });
  }, [ID]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCourses([...courses, value]);
    } else {
      setCourses(courses.filter(course => course !== value));
    }
  };

  const formHandle = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('designation', designation);
    formData.append('gender', gender);
    formData.append('course', courses);
    formData.append('image', image ? image : prevImage);

    axios.put(`https://dealday.onrender.com/employee-list/${ID}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        alert(res.data);
        navigate("/employee-list");
      })
      .catch(() => {
        console.log("Error updating employee data");
      });
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-5 border rounded-lg shadow-lg">
      <h1 className="text-center font-bold text-2xl mb-6">Update Employee Data</h1>
      <form onSubmit={formHandle} className="flex flex-col space-y-4">
        <input 
          className="p-2 border rounded" 
          placeholder="Enter Full Name" 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          className="p-2 border rounded" 
          placeholder="Enter Email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          className="p-2 border rounded" 
          placeholder="Enter Phone Number" 
          type="tel" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
        />

        <div>
          <label htmlFor="designation" className="block mb-2">Designation</label>
          <select 
            id="designation" 
            value={designation} 
            onChange={(e) => setDesignation(e.target.value)} 
            className="block w-full p-2 border rounded"
          >
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Gender</label>
          <label className="mr-4">
            <input 
              type="radio" 
              value="Male" 
              checked={gender === 'Male'} 
              onChange={(e) => setGender(e.target.value)} 
            />
            Male
          </label>
          <label>
            <input 
              type="radio" 
              value="Female" 
              checked={gender === 'Female'} 
              onChange={(e) => setGender(e.target.value)} 
            />
            Female
          </label>
        </div>

        <div>
          <label className="block mb-2">Courses</label>
          <label className="block">
            <input 
              type="checkbox" 
              value="MCA" 
              checked={courses.includes('MCA')} 
              onChange={handleCheckboxChange} 
            />
            MCA
          </label>
          <label className="block">
            <input 
              type="checkbox" 
              value="BCA" 
              checked={courses.includes('BCA')} 
              onChange={handleCheckboxChange} 
            />
            BCA
          </label>
          <label className="block">
            <input 
              type="checkbox" 
              value="BSC" 
              checked={courses.includes('BSC')} 
              onChange={handleCheckboxChange} 
            />
            BSC
          </label>
        </div>

        <div>
          <label className="block mb-2">Upload your photo</label>
          {prevImage && (
            <div className="mb-2">
              <img src={prevImage} alt="Previous" className="w-32 h-32 object-cover"/>
            </div>
          )}
          <input 
            type="file" 
            onChange={(e) => setImage(e.target.files[0])} 
          />
        </div>

        <button 
          type="submit" 
          className="p-2 bg-blue-600 text-white rounded"
        >
          Update Changes
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;

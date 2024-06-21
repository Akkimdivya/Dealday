import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateEmployee = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [designation, setDesignation] = useState('');
    const [gender, setGender] = useState('');
    const [course, setCourse] = useState([]);
    const [image, setImage] = useState(null);

    const formHandle = (e) => {
        e.preventDefault();
        if (!name || !email || !phone || !designation || !gender || !course.length || !image) {
            alert('To create an employee, fill all the fields!');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('designation', designation);
        formData.append('gender', gender);
        formData.append('course', course);
        formData.append('image', image);

        axios.post('https://dealday.onrender.com/employees', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                alert(response.data.message);
                navigate('/employee-list');
            })
            .catch(() => { console.log('Cannot register'); });
    };

    const handleCourseChange = (e) => {
        const courseValue = e.target.value;
        const isChecked = e.target.checked;
        if (isChecked) {
            setCourse([...course, courseValue]);
        } else {
            setCourse(course.filter(item => item !== courseValue));
        }
    };

    return (
        <div className='max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg'>
            <h1 className='text-center font-bold text-2xl mb-6'>Create Employee</h1>
            <form onSubmit={formHandle} className='space-y-4'>
                <input className='w-full p-2 border border-gray-300 rounded' placeholder='Enter Full Name' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                <input className='w-full p-2 border border-gray-300 rounded' placeholder='Enter Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className='w-full p-2 border border-gray-300 rounded' placeholder='Enter Phone Number' type='text' value={phone} onChange={(e) => setPhone(e.target.value)} />

                <div>
                    <label className='block mb-1'>Designation</label>
                    <select onChange={(e) => setDesignation(e.target.value)} className='w-full p-2 border border-gray-300 rounded'>
                        <option value=''>Select Designation</option>
                        <option value='HR'>HR</option>
                        <option value='Manager'>Manager</option>
                        <option value='Sales'>Sales</option>
                    </select>
                </div>

                <div>
                    <label className='block mb-1'>Gender</label>
                    <div className='flex gap-4'>
                        <label>
                            <input type='radio' name='gender' value='Male' onChange={() => setGender('Male')} />
                            Male
                        </label>
                        <label>
                            <input type='radio' name='gender' value='Female' onChange={() => setGender('Female')} />
                            Female
                        </label>
                    </div>
                </div>

                <div>
                    <label className='block mb-1'>Course</label>
                    <div className='flex gap-4'>
                        <label>
                            <input type='checkbox' value='MCA' checked={course.includes('MCA')} onChange={handleCourseChange} />
                            MCA
                        </label>
                        <label>
                            <input type='checkbox' value='BCA' checked={course.includes('BCA')} onChange={handleCourseChange} />
                            BCA
                        </label>
                        <label>
                            <input type='checkbox' value='BSC' checked={course.includes('BSC')} onChange={handleCourseChange} />
                            BSC
                        </label>
                    </div>
                </div>

                <div>
                    <label className='block mb-1'>Upload your photo</label>
                    <input type='file' accept='image/jpeg, image/png' onChange={(e) => setImage(e.target.files[0])} />
                </div>

                <button className='w-full py-2 bg-blue-500 text-white font-bold rounded' type='submit'>Register Me</button>
            </form>
        </div>
    );
};

export default CreateEmployee;

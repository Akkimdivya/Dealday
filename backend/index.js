const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken'); // For JWT token handling

const registeredUsers = require('./models/registeredUsers');
const modelEmployeeRegister = require('./models/modelEmployeeRegister');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect('mongodb+srv://divyaakkim3:dhVV9ruWmN5FFyDy@dealsdray.bnzuw49.mongodb.net/')
  .then(() => console.log('DB Connection established'))
  .catch((err) => console.log(err));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, './images'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Serve static files from the 'Images' directory
app.use('/Images', express.static(path.join(__dirname, 'Images')));

app.post("/register", (req, res) => {
  registeredUsers.findOne({ email: req.body.email })
      .then((user) => {
          if (user !== null) {
              res.json("email already registered..")
          }
          else {
              let dataForDB = new registeredUsers(req.body)
              dataForDB.save()
                  .then((data) => { res.json("input stored in DB successfully..."); })
                  .catch((error) => (res.json("data can not be saved , problem at saving time....")))
          }
      })
      .catch(() => {
          res.json("registration problem...")
      })


})


// User login endpoint
app.post("/login", (req, res) => {
  registeredUsers.findOne({ email: req.body.email})
      .then((user) => {
          if (user.cnfPassword == req.body.password) {
              res.json({ "status": "success", "id": user._id});
          }
          else {
              res.json({ "status": "fail"})
          }
      })
      .catch(() => { res.json({ "status": "noUser"}) })

})

// Endpoint to respond with user data for the dashboard
app.get('/user/:ID', async (req, res) => {
  try {
    const user = await registeredUsers.findById(req.params.ID);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});

// Storing create employee form data
app.post('/employees', upload.single('image'), async (req, res) => {
  try {
    const { email } = req.body;
    const existingEmployee = await modelEmployeeRegister.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newEmployee = new modelEmployeeRegister({
      ...req.body,
      image: req.file.filename,
    });
    await newEmployee.save();

    res.status(201).json({ message: 'Employee registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Employee registration error', error });
  }
});

// Fetch employee list
app.get('/employee-list', async (req, res) => {
  try {
    const employees = await modelEmployeeRegister.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee list', error });
  }
});

// Fetch single employee data for editing
app.get('/employee-list/:ID', async (req, res) => {
  try {
    const employee = await modelEmployeeRegister.findById(req.params.ID);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee data', error });
  }
});

// Edit employee data
app.put('/employee-list/:ID', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      image: req.file ? req.file.filename : req.body.image,
    };
    const updatedEmployee = await modelEmployeeRegister.findByIdAndUpdate(
      req.params.ID,
      updateData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee data updated successfully', updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee data', error });
  }
});

// Delete employee
app.delete('/employee-list/:ID', async (req, res) => {
  try {
    const deletedEmployee = await modelEmployeeRegister.findByIdAndDelete(req.params.ID);

    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error });
  }
});

app.listen(4001, () => {
  console.log('Server listening at 4001....');
});

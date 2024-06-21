const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const registeredUsers = require("./models/registeredUsers");
const modelEmployeeRegister = require("./models/modelEmployeeRegister");
const { uploadToCloudinary } = require("./cloudinary");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(
    "mongodb+srv://divyaakkim3:dhVV9ruWmN5FFyDy@dealsdray.bnzuw49.mongodb.net/"
  )
  .then(() => console.log("DB Connection established"))
  .catch((err) => console.log(err));

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Registration form data handle
app.post("/register", (req, res) => {
  registeredUsers
    .findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res.json("email already registered..");
      } else {
        const dataForDB = new registeredUsers(req.body);
        dataForDB
          .save()
          .then(() => res.json("input stored in DB successfully..."))
          .catch(() => res.json("data cannot be saved, problem at saving time...."));
      }
    })
    .catch(() => res.json("registration problem..."));
});

// Handling Login Action
app.post("/login", (req, res) => {
  registeredUsers
    .findOne({ email: req.body.email })
    .then((user) => {
      if (user && user.cnfPassword === req.body.password) {
        res.json({ status: "success", id: user._id });
      } else {
        res.json({ status: "fail" });
      }
    })
    .catch(() => res.json({ status: "noUser" }));
});

// Respond data to the Dashboard component
app.get("/user/:ID", (req, res) => {
  const ID = req.params.ID;
  registeredUsers
    .findOne({ _id: ID })
    .then((user) => res.json(user.name))
    .catch(() => console.log("problem at param get users Express.."));
});

// Storing create employee form data
app.post("/employees", upload.single("image"), async (req, res) => {
  try {
    const existingUser = await modelEmployeeRegister.findOne({ email: req.body.email });
    if (existingUser) {
      return res.json("email already registered..");
    }

    let imageUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      imageUrl = result.secure_url;
    }

    const dataForDB = new modelEmployeeRegister({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      designation: req.body.designation,
      gender: req.body.gender,
      course: req.body.course,
      image: imageUrl,
    });

    await dataForDB.save();
    res.json("input stored in DB successfully...");
  } catch (error) {
    console.log("Error saving employee:", error);
    res.json("data cannot be saved, problem at saving time....");
  }
});

// Responding employee-list
app.get("/employee-list", (req, res) => {
  modelEmployeeRegister
    .find()
    .then((employees) => res.send(employees))
    .catch(() => res.send("Error fetching employee list"));
});

// Edit-employee send data
app.get("/employee-list/:ID", (req, res) => {
  const ID = req.params.ID;
  modelEmployeeRegister
    .findOne({ _id: ID })
    .then((employee) => res.send(employee))
    .catch(() => res.send("employee not found"));
});

// Edit-employee update values
app.put("/employee-list/:ID", upload.single("image"), async (req, res) => {
  const ID = req.params.ID;
  const updateData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    designation: req.body.designation,
    gender: req.body.gender,
    course: req.body.course,
  };

  try {
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      updateData.image = result.secure_url;
    } else {
      updateData.image = req.body.image;
    }

    await modelEmployeeRegister.updateOne({ _id: ID }, updateData);
    res.send("successfully updated data");
  } catch (error) {
    console.log("Error updating employee:", error);
    res.send("error at update API");
  }
});

// Delete employee
app.delete("/employee-list/:ID", (req, res) => {
  const ID = req.params.ID;
  modelEmployeeRegister
    .deleteOne({ _id: ID })
    .then(() => res.send("user deleted.."))
    .catch(() => res.send("problem at deletion.."));
});

app.listen(4001, () => {
  console.log("server listening at 4001....");
});


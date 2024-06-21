import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const EmployeeList = () => {
  const [infoFromDB, setinfoFromDB] = useState([]);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    axios
      .get("https://dealday.onrender.com/employee-list")
      .then((e) => {
        setinfoFromDB(e.data);
      })
      .catch((e) => {
        console.log("error from EmployeeList useEffect");
      });
    setReload(1);
  }, [reload]);

  const deleteUser = (e) => {
    axios.delete(`https://dealday.onrender.com/employee-list/${e}`);
    setReload(2);
  };

  return (
    <div className="w-full px-4">
      <p className="text-center text-xl font-semibold my-4">
        Total Count: {infoFromDB.length}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-400">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border border-gray-400">Unique Id</th>
              <th className="px-4 py-2 border border-gray-400">Image</th>
              <th className="px-4 py-2 border border-gray-400">Name</th>
              <th className="px-4 py-2 border border-gray-400">Email</th>
              <th className="px-4 py-2 border border-gray-400">Phone</th>
              <th className="px-4 py-2 border border-gray-400">Designation</th>
              <th className="px-4 py-2 border border-gray-400">Gender</th>
              <th className="px-4 py-2 border border-gray-400">Course</th>
              <th className="px-4 py-2 border border-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {infoFromDB.map((item, i) => (
              <tr key={item._id} className="border-t">
                <td className="px-4 py-2 border border-gray-400">{i + 1}</td>
                <td className="px-4 py-2 border border-gray-400">
                  <img
                    src={item.image}
                    alt="employee"
                    className="h-16 w-16 object-cover mx-auto"
                  />
                </td>
                <td className="px-4 py-2 border border-gray-400">
                  {item.name}
                </td>
                <td className="px-4 py-2 border border-gray-400">
                  {item.email}
                </td>
                <td className="px-4 py-2 border border-gray-400">
                  {item.phone}
                </td>
                <td className="px-4 py-2 border border-gray-400">
                  {item.designation}
                </td>
                <td className="px-4 py-2 border border-gray-400">
                  {item.gender}
                </td>
                <td className="px-4 py-2 border border-gray-400">
                  {item.course.join(", ")}
                </td>
                <td className="px-4 py-2 border border-gray-400">
                  <Link
                    to={`/edit-employee/${item._id}`}
                    className="mr-2 text-blue-500"
                  >
                    Edit
                  </Link>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteUser(item._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;

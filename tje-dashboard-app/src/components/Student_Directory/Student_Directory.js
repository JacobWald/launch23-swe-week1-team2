import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "./../../firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { LogoutButton } from "../HOME/HOME.js";

async function addNewStudent(studentName, studentAge, sClass, allClass) {
  let classInfo = [];

  for (let i = 0; i < sClass.length; i++) {
    const classCollectionRef = collection(db, "Classes");
    const classQuery = query(
      classCollectionRef,
      where("name", "==", sClass[i])
    );
    const classSnapshot = await getDocs(classQuery);

    if (classSnapshot.docs.length > 0) {
      const classRef = doc(db, "Classes", classSnapshot.docs[0].id);
      classInfo.push({ class: classRef, grade: -1 });
    } else {
      console.log("Class not found for:", sClass[i]);
    }
  }

  await addDoc(collection(db, "Students"), {
    name: studentName,
    age: studentAge,
    classesTaken: classInfo,
  });
}

async function removeStudent(allStudent, studentToRemove) {
  let delStudent = allStudent.filter(
    (student) => student.name === studentToRemove
  );

  await deleteDoc(doc(db, "Students", delStudent[0].id));
}

async function editStudent(allStudent, editName, editAge, studentChange) {
  try {
    let editS = allStudent.filter((student) => student.name === studentChange);

    await updateDoc(doc(db, "Students", editS[0].id), {
      name: editName,
      age: editAge,
    });
  } catch (err) {
    console.error(err);
  }
}

function GetClass(classes, id) {
  let className = "";

  classes
    .filter((cla) => cla.id === id)
    .map((filteredClass) => (className = filteredClass.name));

  return className.charAt(0).toUpperCase() + className.slice(1);
}

function Student_Directory() {
  const [studentList, setStudentList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [studentAdded, setStudentAdded] = useState(false);
  const [studentClass, setStudentClass] = useState([]);
  const [remStudent, setRemStudent] = useState("");
  const [studentRemoved, setStudentRemoved] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [studentToEdit, setStudentToEdit] = useState("");
  const [studentEdited, setStudentEdited] = useState(false);

  // Handle multiple select
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setStudentClass(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  useEffect(() => {
    const getClassList = async () => {
      const classRef = collection(db, "Classes");
      try {
        const classD = await getDocs(classRef);
        const filteredData = classD.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setClassList(filteredData);
      } catch (err) {
        console.log(err);
      }
    };

    getClassList();
  }, []);

  useEffect(() => {
    const getStudentList = async () => {
      const studentColRef = collection(db, "Students");
      try {
        const data = await getDocs(studentColRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(filteredData);
        setStudentList(filteredData);
      } catch (err) {
        console.log(err);
      }
    };
    getStudentList();
  }, [studentAdded, studentRemoved, studentEdited]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "grid",
          alignItems: "center",
          width: "100%",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        <div></div>
        <h1
          style={{
            margin: "auto",
            maxHeight: "60px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Student Directory
        </h1>
        <div style={{ marginLeft: "auto" }}>
          <LogoutButton
            variant="contained"
            onClick={handleLogout}
            style={{
              marginRight: "20px",
              marginLeft: "20px",
              marginTop: "15px",
            }}
          >
            Logout
          </LogoutButton>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Link to="/Home">
          <Button color="primary" variant="contained">
            Home
          </Button>
        </Link>
      </div>
      <header>
        <h2>Edit A Student</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            justifyContent: "center",
          }}
        >
          <div>
            <h4>Add New Student</h4>
            <div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <TextField
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  label="Student Name"
                  variant="outlined"
                  style={{ marginRight: "5px" }}
                />
                <TextField
                  value={studentAge}
                  onChange={(e) => setStudentAge(e.target.value)}
                  label="Student Age"
                  variant="outlined"
                />
              </div>
              <br></br>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Box
                  sx={{
                    width: 225,
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Classes
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-select-label"
                      id="demo-multiple-select"
                      multiple
                      value={studentClass}
                      label="Classes"
                      onChange={handleChange}
                    >
                      {classList.map((oneClass) => (
                        <MenuItem key={oneClass.id} value={oneClass.name}>
                          {" "}
                          {oneClass.name.charAt(0).toUpperCase() +
                            oneClass.name.slice(1)}{" "}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <br></br>
              <div>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (
                      studentName !== "" &&
                      studentAge !== "" &&
                      studentClass !== []
                    ) {
                      addNewStudent(
                        studentName,
                        studentAge,
                        studentClass,
                        classList
                      );
                      setStudentName("");
                      setStudentAge("");
                      setStudentClass([]);
                      setStudentAdded(!studentAdded);
                    }
                  }}
                >
                  Add New Student
                </Button>
              </div>
            </div>
          </div>
          <div>
            <h4>Remove A Student</h4>
            <div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Box
                  sx={{
                    width: 225,
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Students
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={remStudent}
                      label="student"
                      onChange={(e) => setRemStudent(e.target.value)}
                    >
                      {studentList.map((s) => (
                        <MenuItem key={s.id} value={s.name}>
                          {" "}
                          {s.name}{" "}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <br></br>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (remStudent !== "") {
                      removeStudent(studentList, remStudent);
                      setStudentRemoved(!studentRemoved);
                      setRemStudent("");
                    }
                  }}
                >
                  Delete Student
                </Button>
              </div>
            </div>
          </div>
          <div>
            <h4>Edit Student Information</h4>
            <div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Box
                  sx={{
                    width: 225,
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Students
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={studentToEdit}
                      label="student"
                      onChange={(e) => setStudentToEdit(e.target.value)}
                    >
                      {studentList.map((s) => (
                        <MenuItem key={s.id} value={s.name}>
                          {" "}
                          {s.name}{" "}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <br></br>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <TextField
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  label="New Student Name"
                  variant="outlined"
                  style={{ marginRight: "5px" }}
                />
                <TextField
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                  label="New Student Age"
                  variant="outlined"
                />
              </div>
              <br></br>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (newName !== "") {
                      editStudent(studentList, newName, newAge, studentToEdit);
                      setStudentEdited(!studentEdited);
                    }
                    setStudentToEdit("");
                    setNewName("");
                    setNewAge("");
                    setStudentEdited(!studentEdited);
                  }}
                >
                  Edit student information
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <br></br>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
          justifyContent: "center",
          paddingRight: "350px",
          paddingLeft: "350px",
        }}
      >
        {studentList.map((data) => (
          <div
            style={{
              textAlign: "center",
              paddingBottom: "100px",
              padding: "10px",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Card key={data.id} variant="outlined" sx={{ minWidth: 400 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  {data.name}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Age:</strong> {data.age}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, fontWeight: "bold" }}>
                  Classes Taken:
                </Typography>
                {data.classesTaken.map((c) => (
                  <Typography key={c.id} variant="body2" sx={{ ml: 2 }}>
                    {GetClass(classList, c.class.id)}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </Box>
    </div>
  );
}

export default Student_Directory;

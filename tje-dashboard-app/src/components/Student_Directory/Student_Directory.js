import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './../../firebase.js';
import { collection, getDocs, addDoc, query, where, doc } from 'firebase/firestore';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import Button from "@mui/material/Button";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ref } from "firebase/database";

async function addNewStudent(studentName, studentAge, sClass, allClass) {
  
  let classInfo = [];
  for (let i=0; i<sClass.length; i++){
    // const classCollectionRef = collection(db, "Classes");
    // const classQuery = query(classCollectionRef, where(GetClassId(allClass, sClass[i])));
    // const classSnapshot = await getDocs(classQuery);
    // let classRef = doc(db, "Classes", classSnapshot);
    let classRef = "unresolved"; 
    classInfo.push({class: classRef, grade: -1})
  }

  

  const docRef = await addDoc(collection(db, "Students"), {
    name: studentName,
    age: studentAge,
    classesTaken: classInfo
  });
}


function GetClass (classes, id) {
  let className = "";

  classes.filter(cla => cla.id  === id).map(filteredClass => (
    className = filteredClass.name
  ));


  return className;

}

function GetClassId(classes, className) {
  let classId = "";
  classes.filter(cla => cla.name  === className).map(filteredId => (
    //classRef = "Classes/" + filteredId.id
    classId = filteredId.id
  ));
  return classId;


}



function Student_Directory() {
  const studentColRef = collection(db, "Students");
  const classRef = collection(db, "Classes");
  const [studentList, setStudentList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState(0);
  const [studentAdded, setStudentAdded] = useState(false);
  const [studentClass, setStudentClass] = useState([]);

  // Handle multiple select
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setStudentClass(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  useEffect(() => {
    const getClassList = async () => {
      try {
        const classD = await getDocs(classRef);
        const filteredData = classD.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setClassList(filteredData);
        console.log(filteredData);
      } catch (err) {
        console.log(err);
      }
    };

    getClassList();
  }, []);

  useEffect(() => {
    const getStudentList = async () => {
      try {
        const data = await getDocs(studentColRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setStudentList(filteredData);
        console.log(filteredData);
      } catch (err) {
        console.log(err);
      }
    };
    getStudentList();
  }, [studentAdded]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Student Directory</h1>
      <Link to="/">Home</Link>
      <header>
        <br></br>
      <Button
          variant="outlined"
          onClick={() => {
            addNewStudent(studentName, studentAge, studentClass, classList);
            setStudentAdded(!studentAdded);
          }}
        >
          Add New Student 
        </Button>
        <br></br>
        <br></br>
      <TextField
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          label="Student Name"
          variant="outlined"
        />
        <TextField
          value={studentAge}
          onChange={(e) => setStudentAge(e.target.value)}
          label="Student age"
          variant="outlined"
        />
        <Box
            >
              <FormControl size = 'medium' >
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
                      {oneClass.name}{" "}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
        

      </header>
      <div>
        <br></br>
        <Box sx= {{ minWidth : 275}}>
          
        {studentList.map((data) => (
          <div key={data.id}>
            <Card variant = "outlined">
          <React.Fragment>
            <CardContent>
              <Typography sx={{ fontSize: 16 }} gutterBottom>
              {data.name}, Age: {data.age}
              </Typography>
              <br></br>
              <Typography  sx= {{ fontSize: 14}} >
              Classes Taken: 
              {data.classesTaken.map( (c) => (
                <div key = {c.id}>
                  {GetClass(classList, c.class.id)}
                </div>
              ))}
              </Typography>
          <br></br>
          </CardContent>
        </React.Fragment>
        </Card>
        <br></br>
        </div>
        ))}
        
        </Box>
      </div>
    </div>
  );
}

export default Student_Directory;
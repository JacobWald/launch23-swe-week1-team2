import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './../../firebase.js';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import Button from "@mui/material/Button";
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


async function addNewStudent(studentName, studentAge) {
  const docRef = await addDoc(collection(db, "Students"), {
    name: studentName,
    age: studentAge
    // must add the class and the grade also 
    // Maybe make class a dropdown menu attached to the class id
  });
}


function GetClass (classes, id) {
  let className = "";

  classes.filter(cla => cla.id  === id).map(filteredClass => (
    className = filteredClass.name
  ));


  return className;

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
            addNewStudent(studentName, studentAge);
            setStudentAdded(!studentAdded);
          }}
        >
          Add New Student: 
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
        <TextField
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
          label="Class"
          variant="outlined"
        />
        

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
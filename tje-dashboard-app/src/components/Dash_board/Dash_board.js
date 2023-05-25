import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebase.js";
import { getDocs, collection, addDoc, doc, deleteDoc, where, query } from "firebase/firestore";
import Button from "@mui/material/Button";
import { ButtonGroup, TextField } from "@mui/material";

function DASH_BOARD() {
  const [classList, setClassList] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [newTeacherName, setNewTeacherName] = useState("");
  const classCollectionRef = collection(db, "Classes");

  


  useEffect(() => {
    getClassList();
  }, []);

  const getClassList = async () => {
    try {
      const data = await getDocs(classCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setClassList(filteredData);
      // console.log(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddClass = async () => {
    try {
      const teacherCollectionRef = collection(db, "Teachers");
      const teacherQuery = query(teacherCollectionRef, where("name", "==", newTeacherName));
      const teacherSnapshot = await getDocs(teacherQuery);

      let teacherRef;
      if (newTeacherName == "" || newClassName == "") {
        
        console.log("input teacher/class name");

      
      }
      else {
      if (teacherSnapshot.empty) {
        teacherRef = await addDoc(teacherCollectionRef, {name: newTeacherName});
      } else {
        teacherRef = doc(db, "Teachers", teacherSnapshot.docs[0].id);
      }

      await addDoc(classCollectionRef, {name: newClassName, teacher: teacherRef});
    
      setNewClassName("");
      setNewTeacherName("");
      getClassList();
    }
    }catch (err){
      console.log(err);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await deleteDoc(doc(db,"Classes", classId));
      getClassList();
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div style={{ textAlign: "center" }}>
      <h1>Overall Dashboard</h1>
      <ButtonGroup variant="contained" aria-label="outlined button group">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button>Home</Button>
        </Link>
      </ButtonGroup>
      <br></br>
      <br></br>
      
      <TextField
        type="text"
        value={newClassName}
        onChange={(e) => setNewClassName(e.target.value)}
        placeholder="Enter new class name"
      /> {" "}
      <TextField
        value={newTeacherName}
        onChange={(e) => setNewTeacherName(e.target.value)}
        placeholder="Enter teacher's name"
      />

      <Button onClick={handleAddClass} variant="outlined" style = {{marginLeft:'10px', marginTop: '8px'}}>Add Class</Button>

      <br></br>
      <br></br>

      <div>
        {classList.map((target) => {
            return (
              <div key={target.id} style={{ marginRight:'100px',marginBottom:'10px'}}>
                <Link
                  to={
                    "/teacher_dashboard/" +
                    target.id +
                    "/class_page/" +
                    target.name
                  }
                  style = {{textDecoration: 'none'}}
                >
                  <Button variant = "outline" style = {{display: 'flex',margin: 'auto',marginTop: '8px'}}>{target.name}</Button>
                </Link>
                <Button onClick={() => handleDeleteClass(target.id)} variant="outlined" style = {{marginLeft: '200px',marginTop: '-57px'}}>Delete</Button>
              </div>
            );
        })}
      </div>
    </div>
  );
}

export default DASH_BOARD;



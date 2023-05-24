import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebase.js";
import { getDocs, collection, addDoc, doc, deleteDoc } from "firebase/firestore";
import Button from "@mui/material/Button";
import { ButtonGroup, TextField } from "@mui/material";

function DASH_BOARD() {
  const [classList, setClassList] = useState([]);
  const [newClassName, setNewClassName] = useState("");

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
      await addDoc(classCollectionRef, {name: newClassName});
      setNewClassName("");
      getClassList();
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
      />
      <Button onClick={handleAddClass} variant="outlined" style = {{marginLeft:'10px'}}>Add Class</Button>

      <br></br>
      <br></br>

      <div>
        {classList.map((target) => {
            return (
              <div key={target.id} style={{ marginBottom:'10px'}}>
                <Link
                  to={
                    "/teacher_dashboard/" +
                    target.id +
                    "/class_page/" +
                    target.name
                  }
                  style = {{textDecoration: 'none'}}
                >
                  <Button variant = "outline">{target.name}</Button>
                </Link>
                <Button onClick={() => handleDeleteClass(target.id)} variant="outlined">Delete</Button>
              </div>
            );
        })}
      </div>
    </div>
  );
}

export default DASH_BOARD;



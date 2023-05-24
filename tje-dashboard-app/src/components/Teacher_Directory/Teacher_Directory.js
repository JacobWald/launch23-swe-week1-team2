import { Link } from "react-router-dom";
import { useEffect, useState, useSyncExternalStore } from "react";
import { db } from "../../firebase.js";
import { getDocs, collection, addDoc } from "firebase/firestore";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function TEACHER_DIRECTORY() {
  const [teacherList, setTeacherList] = useState([]);

  const teacherCollectionRef = collection(db, "Teachers");

  const [newName, setNewName] = useState("");
  const [editedName, setEditedName] = useState("");
  const [teacherAdded, setTeacherAdded] = useState(false);

  useEffect(() => {
    const getTeacherList = async () => {
      try {
        const data = await getDocs(teacherCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTeacherList(filteredData);
        console.log(filteredData);
      } catch (err) {
        console.log(err);
      }
    };

    getTeacherList();
  }, [teacherAdded]);

  async function addNewTeacher(newName) {
    const docRef = await addDoc(collection(db, "Teachers"), {
      name: newName,
    });
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Teacher Directory</h1>
      <Link to="/">
        <Button variant="contained">Home</Button>
      </Link>
      <br></br>
      <br></br>
      <div>
        {teacherList.map((teacher) => (
          <div key={teacher.id}>
            <Link to={"/teacher_dashboard/" + teacher.id}>
              <Button variant="outlined">{teacher.name}</Button>
            </Link>
            <br></br>
            <br></br>
          </div>
        ))}
      </div>
      <footer>
        <TextField
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          label="Teacher Name"
          variant="outlined"
        />
        <Button
          variant="outlined"
          onClick={() => {
            addNewTeacher(newName);
            setTeacherAdded(!teacherAdded);
          }}
        >
          Add New Teacher
        </Button>
        <div>
          <h2>Edit Teacher Name</h2>
          <Select></Select>

          <TextField
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            label="Edited Name"
            variant="outlined"
          />
          <br></br>
        </div>
      </footer>
    </div>
  );
}

export default TEACHER_DIRECTORY;

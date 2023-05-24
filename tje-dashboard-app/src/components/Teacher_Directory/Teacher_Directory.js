import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebase.js";
import { getDocs, collection, addDoc, setDoc, doc } from "firebase/firestore";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function TEACHER_DIRECTORY() {
  const [teacherList, setTeacherList] = useState([]);

  const teacherCollectionRef = collection(db, "Teachers");
  const [prevName, setPrevName] = useState("");
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
  async function changeTeacherName(prevName, editedName) {
    try {
      let changedTeacher = teacherList.filter(
        (teacher) => teacher.name === prevName
      );
      setPrevName("");
      console.log(changedTeacher[0].id);
      const docRef = await setDoc(doc(db, "Teachers", changedTeacher[0].id), {
        name: editedName,
      });
      setEditedName("");
    } catch (err) {
      console.log(err);
    }
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: 225,
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Name to Change
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={prevName}
                  label="Previous Name"
                  onChange={(e) => setPrevName(e.target.value)}
                >
                  {teacherList.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.name}>
                      {" "}
                      {teacher.name}{" "}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
          <div>
            <TextField
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              label="Edited Name"
              variant="outlined"
            />
          </div>
          <Button
            variant="outlined"
            onClick={() => (
              changeTeacherName(prevName, editedName),
              setTeacherAdded(!teacherAdded)
            )}
          >
            Save Changes
          </Button>
          <br></br>
        </div>
      </footer>
    </div>
  );
}

export default TEACHER_DIRECTORY;

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebase.js";
import {
  getDocs,
  collection,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { LogoutButton } from "../HOME/HOME.js";

function TEACHER_DIRECTORY() {
  const [teacherList, setTeacherList] = useState([]);
  const [prevName, setPrevName] = useState("");
  const [newName, setNewName] = useState("");
  const [editedName, setEditedName] = useState("");
  const [change, setChange] = useState(false);
  const [classList, setClassList] = useState([]);
  const [teacherRemoved, setTeacherRemoved] = useState("");
  const [hasClass, setHasClass] = useState(false);
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
    const getTeacherList = async () => {
      const teacherCollectionRef = collection(db, "Teachers");
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
  }, [change]);

  async function addNewTeacher(newName) {
    setHasClass(false);
    await addDoc(collection(db, "Teachers"), {
      name: newName,
    });
    setNewName("");
  }
  async function changeTeacherName(prevName, editedName) {
    try {
      let changedTeacher = teacherList.filter(
        (teacher) => teacher.name === prevName
      );
      setPrevName("");
      await setDoc(doc(db, "Teachers", changedTeacher[0].id), {
        name: editedName,
      });
      setEditedName("");
      setChange(!change);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const getClassList = async () => {
      const classCollectionRef = collection(db, "Classes");
      try {
        const data = await getDocs(classCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setClassList(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    getClassList();
  }, []);

  async function deleteTeacher(teacherRemoved) {
    try {
      setHasClass(false);
      let changedTeacher = teacherList.filter(
        (teacher) => teacher.name === teacherRemoved
      );
      let teachersClass = classList.filter(
        (item) => item.teacher.id === changedTeacher[0].id
      );
      if (teachersClass.length === 0) {
        await deleteDoc(doc(db, "Teachers", changedTeacher[0].id));
        setTeacherRemoved("");
        setChange(!change);
      } else {
        setHasClass(true);
        setTeacherRemoved("");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      style={{ textAlign: "center", paddingBottom: "100px"}}>
      <div
          style={{
            display: "grid",
            alignItems: "center",
            width: "100%",
            gridTemplateColumns: "1fr 1fr 1fr",
          }}>
        <div></div>
        <h1 style={{
                margin: "auto",
                maxHeight: "60px",
              }} >Teacher Directory</h1>
        
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
      <div>
        <Link to="/Home">
          <Button variant="contained">Home</Button>
        </Link>
      </div>


      <header>
        <h2>Edit a Teacher </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            justifyContent: "center",
          }}
        >
          <div>
            <h4> Add a Teacher</h4>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <TextField
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                label="Teacher Name"
                variant="outlined"
                sx={{ width: 225 }}
              />
            </div>
            <br></br>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div>
                <Button
                  className="choices"
                  variant="contained"
                  onClick={() => {
                    addNewTeacher(newName);
                    setChange(!change);
                  }}
                >
                  Add New Teacher
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ marginTop: "0px" }}> Change Teacher Name</h4>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  width: 225,
                  // backgroundColor: "white"
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
            <br></br>
            <div>
              <TextField
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                label="Edited Name"
                variant="outlined"
                sx={{
                  width: 225,
                  // backgroundColor: "white"
                }}
              />
            </div>
            <br></br>
            <Button
              variant="contained"
              onClick={() => {
                changeTeacherName(prevName, editedName);
                setChange(!change);
              }}
            >
              Save Changes
            </Button>
            <h2>Current Teachers</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px",
              }}
            >
              {teacherList.map((teacher) => (
                <div key={teacher.id}>
                  <Link to={"/teacher_dashboard/" + teacher.id}>
                    <Button className="choices" variant="outlined">
                      {teacher.name}
                    </Button>
                  </Link>
                  <br />
                  <br />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4> Delete a Teacher </h4>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  width: 225,
                  // backgroundColor: "white"
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Teacher to Delete
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={teacherRemoved}
                    label="Teacher to delete"
                    onChange={(e) => setTeacherRemoved(e.target.value)}
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
            <br></br>
            <Button
              variant="contained"
              onClick={() => {
                deleteTeacher(teacherRemoved);
                setChange(!change);
              }}
            >
              Remove Teacher
            </Button>
            <br></br>
            {hasClass ? (
              <p>
                Please delete the class before deleting the assigned teacher.
              </p>
            ) : null}
          </div>
        </div>
      </header>
    </div>
  );
}

export default TEACHER_DIRECTORY;

import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebase.js";
import { getDocs, collection, getDoc, doc } from "firebase/firestore";
import Button from "@mui/material/Button";
import { ButtonGroup } from "@mui/material";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { LogoutButton } from "../HOME/HOME.js";

function TEACHER_DASHBOARD() {
  const [classList, setClassList] = useState([]);
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

  const { teacherID } = useParams();

  const [teacherData, setTeacherData] = useState();

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
        console.log(err);
      }
    };

    getClassList();
  }, []);

  useEffect(() => {
    const getTeacherData = async () => {
      const docRef = doc(db, "Teachers", teacherID);
      try {
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const data = {
            ...docSnapshot.data(),
            id: docSnapshot.id,
          };
          setTeacherData(data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getTeacherData();
  }, []);

  const teacherClasses = classList.filter(
    (targetClass) =>
      targetClass.teacher &&
      targetClass.teacher.id &&
      teacherID === targetClass.teacher.id
  );

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
        <h1 style={{
                margin: "auto",
                maxHeight: "60px",
                display:"flex", 
                justifyContent: "center"
              }}>Teacher Dashboard</h1>
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



      <ButtonGroup variant="contained" aria-label="outlined button group">
        <Link to="/Home" style={{ marginRight: "10px" }}>
          <Button>Home</Button>
        </Link>
        <Link onClick={() => navigate(-1)}>
          <Button>Teacher Directory</Button>
        </Link>
      </ButtonGroup>
      <h2>{teacherData ? teacherData.name + "'s Classes" : null}</h2>
      <div>
        {teacherClasses.length === 0 ? (
          <p>No Classes Being Taught</p>
        ) : (
          teacherClasses.map((targetClass) => (
            <div key={targetClass.id}>
              <Link
                to={
                  "/teacher_dashboard/" +
                  teacherID +
                  "/" +
                  targetClass.id +
                  "/class_page/" +
                  targetClass.name
                }
              >
                <Button variant="outlined">{targetClass.name}</Button>
              </Link>
              <br />
              <br />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TEACHER_DASHBOARD;

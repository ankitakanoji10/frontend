import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate, useParams } from 'react-router-dom';
import disang_logo from './Images/disang_logo.svg';
import NavBar from './NavBar';
const EditCoursePage = () => {
    const params = useParams();
    const navigate = useNavigate();
  const [courseInfo, setCourseInfo] = useState({
    name: '',
    description: '',
    comments: '',
    rating: '0',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseInfo();
  }, []);

  const fetchCourseInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/course/single-course/${params.cid}`);
      const data = response.data;

      if (data.success) {
        const { course } = data;
        setCourseInfo({
          name: course.name || '',
          description: course.description || '',
          comments: course.comments || '',
          rating: course.rating || '0',
        });
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching course information');
    } finally {
      setLoading(false);
    }
  };
  // const handleInputChange = (e, index) => {
  //   const { name, value } = e.target;
  //   if (name === "comments") {
  //     const updatedComments = [...courseInfo.comments];
  //     updatedComments[index] = value;
  //     setCourseInfo({
  //       ...courseInfo,
  //       comments: updatedComments,
  //     });
  //   } else {
  //     setCourseInfo({
  //       ...courseInfo,
  //       [name]: value,
  //     });
  //   }
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };
  // const handleDeleteComment = (index) => {
  //   const updatedComments = [...courseInfo.comments];
  //   updatedComments.splice(index, 1);
  //   setCourseInfo({
  //     ...courseInfo,
  //     comments: updatedComments,
  //   });
  // };

  const handleEditCourse = async () => {
    try {
        const response = await axios.put(`http://localhost:8000/course/${params.cid}/edit-course`,  courseInfo , {
          withCredentials:true,
      });
      const data = response.data;

      if (data.success) {
          console.log('Course updated successfully');
          navigate(`/single-course/${params.cid}`);
        // Redirect or perform additional actions upon successful update
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error editing course');
    }
  };

  return (
    <div className="bg-[#232323] w-screen" style={{minHeight:'100vh'}}>
      <div className='header flex' style={{ marginBottom: '3.3vw' }}>
          <img src={disang_logo} style={{ width: '4.2vw', height: '4.2vw', marginRight: '1.58vw' }} />
        <img src={disang_logo} style={{ width: '4.2vw', height: '4.2vw' }} />
        <NavBar></NavBar>
      </div>
      <div className='box' style={{ flexDirection: "row", display: "flex" }}>
      <div className='head' style={{ flexDirection: "column", display: "flex" }}>
        <h1 className='headin'style={{fontSize: '7em', marginRight:"3rem", color:"#8598FF",marginLeft:"17rem",fontWeight:"900"}}>Edit</h1>
        <h1 className='headin'style={{fontSize: '7em', marginBottom: '2em', marginRight:"3rem", color:"#8598FF",marginLeft:"17rem",fontWeight:"900"}}>Course</h1>
        </div>
        <div className='right-partition' style={{ flex: 2 }}>
          <form>
            <label></label>
            <div className='flex' style={{ fontSize: '2.11vw', boxShadow: ' 0 0.26vw 0.26vw 0 #8598FF', width: '47.75vw', marginBottom: '3vw', padding: '0.26vw 0px 0.26vw 1vw' }}><span style={{ fontWeight: '700', marginRight: '3.2vw', color:"white" }}>Name</span><p style={{ fontSize: '1.6vw', textAlign: 'center', paddingTop: '0.45vw' }}>
          <input type="text"
            name="name"
            value={courseInfo.name}
            onChange={handleInputChange} required disabled="true" style={{border:"none", background:"none", color:"white"}} /></p></div>
           
          <div className='flex' style={{ fontSize: '2.11vw', boxShadow: ' 0 0.26vw 0.26vw 0 #8598FF', width: '47.75vw', marginBottom: '3vw', padding: '0.26vw 0px 0.26vw 1vw', height:'19vw'}}><span style={{ fontWeight: '700', marginRight: '3.2vw', color: "white" }}>Description</span><p style={{ fontSize: '1.6vw', textAlign: 'center', paddingTop: '0.45vw' }}>
          <textarea type="text"
           name="description"
           value={courseInfo.description}
                onChange={handleInputChange}
                style={{ border: "none", background: "none", color: "white", width: "30rem", height: "100%" }} /></p></div>
          
            <div className='flex' style={{ fontSize: '2.11vw', boxShadow: ' 0 0.26vw 0.26vw 0 #8598FF', width: '47.75vw', marginBottom: '3vw', padding: '0.26vw 0px 0.26vw 1vw', height: '10vw' }}><span style={{ fontWeight: '700', marginRight: '3.2vw', color: "white" }}>Comment</span><p style={{ fontSize: '1.6vw', textAlign: 'center', paddingTop: '0.45vw' }}>
          <textarea type="text"
           name="comments"
           value={courseInfo.comments}
           onChange={handleInputChange}
                style={{ border: "none", background: "none", color: "white", width: "30rem", height: "100%" }} /></p></div>
            <button type="button" onClick={handleEditCourse} style={{
              backgroundColor: "#fff", // Replace with the actual background color from your image
              color: "#8598FF", // Replace with the actual text color from your image
              border: "none",
            borderRadius: "10px",
            justifyContent: "center",
            marginLeft: "2rem",
            width:"10rem",
            height:"3rem",// Adjust as needed to match your image
              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
              marginLeft:"20rem"
            }}>
            Save Changes
          </button>
          </form>
        </div>
      </div>
      {/* <h1>Edit Course</h1> */}
      {/* {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>} */}
      
        {/* <form>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={courseInfo.name}
            onChange={handleInputChange}
          />
          <label>Description:</label>
          <textarea
            name="description"
            value={courseInfo.description}
            onChange={handleInputChange}
          />
          <label>Comments:</label>
          <textarea
            name="comments"
            value={courseInfo.comments}
            onChange={handleInputChange}
          />
          <label>Rating:</label>
          <input
            type="number"
            min="1"
            max="5"
            name="rating"
            value={courseInfo.rating}
            onChange={handleInputChange}
          />
          <button type="button" onClick={handleEditCourse}>
            Save Changes
          </button>
        </form>
       */}
    </div>
  );
};

export default EditCoursePage;

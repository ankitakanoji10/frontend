// CreateCoursePage.jsx
import React, { useState } from 'react';
import ReactStars from "react-rating-stars-component";

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import disang_logo from './Images/disang_logo.svg';
import NavBar from './NavBar';

const CreateCoursePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    comments: '',
    rating: '0',
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/course/create-course', formData, {
        withCredentials: true,
      });

      const data = response.data;

      if (data.success) {
        // Handle success, e.g., redirect to the created course page
        console.log('Course created successfully:', data.course);
        navigate(`/profile-page`)
      } else {
        // Handle error
        console.error('Error creating course:', data.message);
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };
  const ratingChanged = (newRating) => {
    console.log(newRating);
  };

  return (
    <div className='bg-[#232323] flex flex-col text-white p-8' style={{ minHeight: '100vh' }}>
      
        <div className='header flex' style={{ marginBottom: '3.3vw' }}>
          <img src={disang_logo} style={{ width: '4.2vw', height: '4.2vw', marginRight: '1.58vw' }} />
        <img src={disang_logo} style={{ width: '4.2vw', height: '4.2vw' }} />
        <NavBar></NavBar>
      </div>
        <div className='box' style={{flexDirection:"row", display:"flex"}}>
        <div className='head' style={{ flexDirection: "column", display: "flex" }}>
        <h1 className='headin'style={{fontSize: '7em', marginRight:"3rem", color:"#8598FF",marginLeft:"17rem",fontWeight:"900"}}>Create</h1>
        <h1 className='headin'style={{fontSize: '7em', marginBottom: '2em', marginRight:"3rem", color:"#8598FF",marginLeft:"17rem",fontWeight:"900"}}>Course</h1>
       </div>
      <div className='right-partition' style={{ flex: 2 }}>
      {/* <h1>Create Course</h1> */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name"></label>
        <div className='flex' style={{ fontSize: '2.11vw', boxShadow: ' 0 0.26vw 0.26vw 0 #8598FF', width: '47.75vw', marginBottom: '3vw', padding: '0.26vw 0px 0.26vw 1vw' }}><span style={{ fontWeight: '700', marginRight: '3.2vw' }}>Name</span><p style={{ fontSize: '1.6vw', textAlign: 'center', paddingTop: '0.45vw' }}>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={{border:"none", background:"none"}} /></p></div>
        

        <label htmlFor="description"></label>
        <div className='flex' style={{ fontSize: '2.11vw', boxShadow: ' 0 0.26vw 0.26vw 0 #8598FF', width: '47.75vw', marginBottom: '3vw', padding: '0.26vw 0px 0.26vw 1vw' }}><span style={{ fontWeight: '700', marginRight: '3.2vw' }}>Description</span><p style={{ fontSize: '1.6vw', textAlign: 'center', paddingTop: '0.45vw' }}>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} style={{border:"none", background:"none"}}/></p></div>
        
        

        <label htmlFor="comments"></label>
        <div className='flex' style={{ fontSize: '2.11vw', boxShadow: ' 0 0.26vw 0.26vw 0 #8598FF', width: '47.75vw', marginBottom: '3vw', padding: '0.26vw 0px 0.26vw 1vw' }}><span style={{ fontWeight: '700', marginRight: '3.2vw' }}>Comment</span><p style={{ fontSize: '1.6vw', textAlign: 'center', paddingTop: '0.45vw' }}>
        <input type="text" id="comments" name="comments" value={formData.comments} onChange={handleChange} style={{border:"none", background:"none"}}/></p></div>
        

        {/* <label htmlFor="rating">Rating:</label>
        <input type="number" id="rating" name="rating" value={formData.rating} onChange={handleChange} /> */}
        
        <ReactStars
          count={5}
          onChange={ratingChanged}
          value = {formData.rating}
          size={78}
          activeColor="#ffd700"
          style={{marginBottom:"10px"}}
        />
      
      
        <button type="submit" style={buttonStyle}>Create Course</button>
        </form>
        </div>
        </div>
    </div>
  );
};
const buttonStyle = {
  backgroundColor: '#8598FF', // The blue shade from the Confirm button
  border: 'none',
  borderRadius: '20px', // Adjust for roundness
  color: 'white',
  padding: '10px 20px', // Adjust for size
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px', // Adjust for font size
  margin: '4px 2px',
  cursor: 'pointer',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Shadow effect
  fontWeight: 'bold', // If the font is bold
};

export default CreateCoursePage;

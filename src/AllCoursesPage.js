import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import disang_logo from './Images/disang_logo.svg';
import search from './Images/search.png'
import exclamation from './Images/exclamation.png'
import NavBar from './NavBar';
const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllCourses();
  }, []);
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
 

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://unisync-api.onrender.com/course/search-course/${keyword}`);
      setCourses(response.data);
      setKeyword('')
    } catch (error) {
      setError('Error searching for courses');
    }
  };

  const fetchAllCourses = async () => {
    try {
      const response = await axios.get('https://unisync-api.onrender.com/course/all-courses');
      const data = response.data;

      if (data.success) {
        setCourses(data.course);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching all courses');
    } finally {
      setLoading(false);
    }
  };
// Function to convert rating to stars
const renderStars = (rating) => {
  const stars = [];
  const roundedRating = Math.round(rating);
  for (let i = 0; i < 1; i++) {
    stars.push(<span key={i} className="text-yellow-400" style={{borderRadius:"50%"}}>&#9733;</span>);
  }
  return stars;
};
  return (
    <div className='bg-[#232323] flex flex-col text-white p-8' style={{ minHeight: '100vh' }}>
      {/* HEADER */}
      <div className='header flex'  style={{marginBottom:'3.3vw'}}>
            <img src={disang_logo} style={{width:'4.2vw', height:'4.2vw', marginRight:'1.58vw'}}/>
            <img src={disang_logo} style={{width:'4.2vw', height:'4.2vw'}}/>
            <NavBar></NavBar>
      </div>
      
      <div className="search-bar" style={{ display: "flex", alignItems: "center", marginLeft:"25rem"}}>
        <img src={search} style={{
          width: "1rem",
          marginBottom:"2rem"
          }} ></img>
        <input
          type="text"
          placeholder="Enter keyword to search courses"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            border: "none",
            borderBottom: "2px solid white",
            background: "none",
            color: "white",
            width: "60%",
            outline: "none",
            padding: "2px",
            marginLeft: "0.5rem",
            marginRight: "0.5rem",
            marginBottom:"2rem"
          }}
        />
        <button onClick={handleSearch} style={{ background: "none", border: "none", color: "white", cursor: "pointer",marginBottom:"2rem" }}>Search</button>
      </div>
        
        
    <div className="grid md:grid-cols-2 gap-6">
    {/* Repeat this block for each course */}
    {courses.length > 0 && courses.map(course => (
      <div key={course._id} className="bg-[#1C1B1F] rounded-lg p-4">
        <Link to={`/single-course/${course._id}`}><h2 className="text-white text-xl font-bold mb-2" style={{color:"#E6E1E5"}}>{course.name}</h2>
        <p className="text-base mb-4" style={{ color: "#E6E1E5" }}>{course.description}</p>
        <p className="text-base" style={{ color: "#E6E1E5" }}>{ course.rating}{renderStars(course.rating)}</p></Link>
        {/* Add more details as needed */}
      </div>
    ))} 
    {courses.length === 0 && <>
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight  sm:text-5xl">Course not found</h1>
          <p className="mt-6 text-base leading-7">Sorry, we couldn't find the course you're looking for.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </a>
            
          </div>
        </div>
      </main>
  </>}
  </div>
     
      
    </div>
  );
};

export default AllCoursesPage;

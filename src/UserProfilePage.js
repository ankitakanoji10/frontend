import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import disang_logo from './Images/disang_logo.svg';

import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import NavBar from './NavBar';


const UserProfilePage = ({ match }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
    const params = useParams();
    const fetchUserProfile = async () => {
        try {
        console.log(params.id)
        const response = await axios.get(`https://unisync-api.onrender.com/profile/${params.id}`);
        const data = response.data;

          if (data.success) {
            console.log(data.user);
          setUser(data.user);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error fetching user profile');
      } finally {
        setLoading(false);
      }
    };
    const fetchCourses= async () => {
        try {
        console.log(params.id)
        const response = await axios.get(`https://unisync-api.onrender.com/profile/${params.id}/all-courses`);
        const data = response.data;

        if (data.success) {
          setCourses(data.courses);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Error fetching user profile');
      } finally {
        setLoading(false);
      }
    };
    const fetchAllProjects = async () => {
        try {
          const response = await axios.get(`https://unisync-api.onrender.com/profile/${params.id}/all-projects`);
          const data = response.data;
    
          if (data.success) {
            setProjects(data.projects);
          } else {
            setError(data.message);
          }
        } catch (error) {
          setError('Error fetching user projects');
        }
      };
  useEffect(() => {
    

      fetchUserProfile();
      fetchCourses();
      fetchAllProjects();
  }, []);

  return (
    <div className='bg-[#232323] flex flex-col text-white p-8' style={{minHeight:'100vh'}}>
<div className='flex flex-col'>
    {/* HEADER */}
    <div className='header flex'  style={{marginBottom:'3.3vw'}}>
      <img src={disang_logo} style={{width:'4.2vw', height:'4.2vw', marginRight:'1.58vw'}}/>
          <img src={disang_logo} style={{ width: '4.2vw', height: '4.2vw' }} />
          <NavBar></NavBar>
      <div className='flex justify-center items-center text-3xl	text-center	w-full'>
      {user &&   <div className='flex justify-center items-center text-center ' style={{fontSize: '3.17vw',marginRight:'12vw'}}>{user.name}'s Profile</div>}
      </div>
    </div>
    {/* PROFILE PART */}
    {loading && <p>Loading...</p>}
    {error && <p>Error: {error}</p>}
    <div className='flex h-full items-center justify-center' style={{marginBottom:'3vw'}}>
      <div className='flex flex-col'>
      <div className='flex w-full flex-col bg-[#8598FF] cursor-pointer hover:opacity-80 justify-center items-center mr-20 'style={{width:'16.66vw', height:'21.14vw', borderRadius:'1vw'}}>
        <div style={{overflow: 'hidden', height:'100%', width:'100%'}}>
          <img src={`https://unisync-api.onrender.com/profile/${params.id}/get-photo`} alt={"user profile "} style={{height:'100%', objectFit: 'cover', borderRadius: '10px'}}/>
        </div>
        
      </div>
     
      </div>
      <div className='flex flex-col'>
        {user && (
          <div>
            <div className='flex' style={{fontSize:'2.11vw',boxShadow:' 0 0.26vw 0.26vw 0 #8598FF', width:'47.75vw', marginBottom:'3vw',padding:'0.26vw 0px 0.26vw 1vw'}}><span style={{fontWeight:'700', marginRight:'3.2vw' }}>Name</span><p style={{fontSize:'1.6vw', textAlign:'center', paddingTop:'0.45vw'}}> {user.name}</p></div>
            <div className='flex' style={{fontSize:'2.11vw',boxShadow:' 0 0.26vw 0.26vw 0 #8598FF', width:'47.75vw', marginBottom:'3vw',padding:'0.26vw 0px 0.26vw 1vw'}}><span style={{fontWeight:'700', marginRight:'3.3vw'}}>Email</span><p style={{fontSize:'1.6vw', textAlign:'center', paddingTop:'0.45vw'}}> {user.email}</p></div>
          { user.skills.length>0  && <div className='flex' style={{fontSize:'2.11vw',boxShadow:' 0 0.26vw 0.26vw 0 #8598FF', width:'47.75vw', marginBottom:'3vw',padding:'0.26vw 0px 0.26vw 1vw'}}><span style={{fontWeight:'700', marginRight:'3.3vw'}}>Skills</span><p style={{fontSize:'1.6vw', textAlign:'center', paddingTop:'0.45vw'}}> {user.skills}</p></div>}
          </div>)}
      </div>

    </div>
</div>
<div className='courses&projects flex flex-col'>
  {/* COURSES */}
  <div className='flex items-center justify-center'>
    
{user && (
        <div className='flex items-center justify-center h-full'>
        {courses.length > 0 ? (
          <div className='flex items-center justify-center h-full'>
          <div className='courses flex' style={{width: '70.2vw',height:'9.2vw', border:'2px white solid', borderRadius:'1vw', alignItems:'center', justifyContent:'center'}}>
          <Carousel
            showArrows={true}
            showThumbs={false}
            showStatus={false}
            showIndicators={true}
            infiniteLoop={true}
            useKeyboardArrows={true}
            autoPlay={false}
            stopOnHover={true}
            swipeable={true}
            dynamicHeight={true}
          >
            {courses.map((course, index) => (
              <div key={index} style={{ padding: 20, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                
                
                <Link to={`/single-course/${course._id}`} style={{ textDecoration: 'none', color: 'white', display:'flex', width:'60%', height:'100%' }}>
                <div className='flex w-1/3 h-full w-full justify-center items-center' style={{fontSize:'1.85vw', fontWeight:'700'}}>{course.name}</div>
                <div className='flex w-2/3 justify-center items-center h-full w-full' style={{fontSize:'1.4vw'}}>
                {course.description.split(' ').slice(0, 10).join(' ')}
                </div>
                </Link>
                
              </div>
            ))}
          </Carousel>
          </div>          

        </div>) : (
          <p></p>
        )}
       
      </div>)}
    </div>
  {/* PROJECTS */}
  <div className='flex items-center justify-center'>
    
    {user && (
                  <div className='flex items-center justify-center h-full'>
                  {projects.length > 0  ? (
                    <div className='flex items-center justify-center h-full'>
                    <div className='courses flex' style={{width: '70.2vw',height:'9.2vw', border:'2px white solid', borderRadius:'1vw', alignItems:'center', justifyContent:'center'}}>
                    <Carousel
                      showArrows={true}
                      showThumbs={false}
                      showStatus={false}
                      showIndicators={true}
                      infiniteLoop={true}
                      useKeyboardArrows={true}
                      autoPlay={false}
                      stopOnHover={true}
                      swipeable={true}
                      dynamicHeight={true}
                    >
                      {projects.map((projects, index) => (
                        <div key={index} style={{ padding: 20, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          
                          
                          <Link to={`/single-project/${projects._id}`} style={{ textDecoration: 'none', color: 'white', display:'flex', width:'60%', height:'100%' }}>
                          <div className='flex w-1/3 h-full w-full justify-center items-center' style={{fontSize:'1.85vw', fontWeight:'700'}}>{projects.name}</div>
                          <div className='flex w-2/3 justify-center items-center h-full w-full' style={{fontSize:'1.4vw'}}>
                          {projects.description.split(' ').slice(0, 15).join(' ')}
                          </div>
                          </Link>
                          
                        </div>
                      ))}
                    </Carousel>
                    </div>                    
    
                  </div>) : (
                    <p></p>
                    
                  )}
                 
                </div>)}
              </div>



</div>

  
  
</div> );
};

export default UserProfilePage;


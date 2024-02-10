import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import disang_logo from './Images/disang_logo.svg';
import edit from './Images/icon.svg';
import addCourses from './Images/Extended FAB.svg';
import addProjects from './Images/Extended FAB (2).svg';
import plus from './Images/Vector.svg'
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import delCourse from './Images/Extended FAB (1).svg';
import delProject from './Images/Extended FAB (3).svg';
import NavBar from './NavBar';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setNewSkill] = useState('');
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [newCourse, setNewCourse] = useState('');
  const [hasProfilePhoto, setHasProfilePhoto] = useState(false);
  const navigate = useNavigate();


  const handleDeletePhoto = async () => {
    try {
      const response = await axios.delete('http://unisync-api.onrender.com/profile/delete-photo', { 
        withCredentials: true 
      });
      console.log(response.data);
      setDeleteStatus(response.data);
      
      console.log(hasProfilePhoto)
      window.location.reload();
      setHasProfilePhoto(false);
    } catch (error) {
      console.error('Error deleting photo:', error);
      setDeleteStatus({
        success: false,
        message: 'Error deleting photo',
      });
    }
  };

  // useEffect(() => {
  //   const fetchProfilePhoto = async () => {
  //     try {
  //       const response = await axios.get('http://unisync-api.onrender.com/profile/profile-photo', { withCredentials: true });
  //       if (response.data && response.data.photoUrl) {
  //         setHasProfilePhoto(true);
  //       } else {
  //         setHasProfilePhoto(false);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch profile photo:', error);
  //       setHasProfilePhoto(false);
  //     }
  //   };

  //   fetchProfilePhoto();
  // }, []);

  const handleAddCourse = async () => {
    try {
      if (!newCourse) {
        console.error('Please enter a course name.');
        return;
      }

      const response = await axios.put(
        'http://unisync-api.onrender.com/profile/add-course',
        { course: newCourse },
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.data.success) {
        window.location.reload();
        setNewCourse(''); 
      }
      } catch (error) {
      // Handle errors, if any
      console.error('Error adding course:', error);
      if (error.response && error.response.status === 404) {
        
          console.error('Course not found. Redirect to create course page.');
          navigate(`/create-course`);
        

        // Redirect to create course page if needed
      } else if (error.response && error.response.status === 401) {
        console.error('Not logged in. Redirect to login page.');
        navigate(`/login`);
        
        // Redirect to login page or handle authentication as needed
      }
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log('Selected Photo:', file);
    setSelectedPhoto(file);

  };

  const handleAddPhoto = async () => {
    try {
      if (!selectedPhoto) {
      console.error('Please select a photo.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', selectedPhoto);
    for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }
      const response = await axios.put('http://unisync-api.onrender.com/profile/add-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      console.log(response.data);
      // Example: Log the response data
      window.location.reload();
      setHasProfilePhoto(true);
      console.log(hasProfilePhoto)
      // You can also perform additional actions based on the response
    } catch (error) {
      console.error('Error adding photo:', error);
    }
  };

  useEffect(() => {
  

      fetchUserProfile();
      fetchUserCourses();
      fetchUserProjects();
  }, []);
  const fetchUserProfile = async () => {
    try {
        const response = await axios.get('http://unisync-api.onrender.com/profile/setup-profile', {
          withCredentials:true,
      });
      const data = response.data;

      if (data.success) {
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

  const fetchUserPhoto = async () => {
    try {
        const response = await axios.get('http://unisync-api.onrender.com/profile/profile-photo', {
        withCredentials:true,
      });
      const data = response.data;

      if (data.status === 200 || data.status === 304) {
        
        setHasProfilePhoto(true);
        
        console.log("idhar wala"+hasProfilePhoto)
        setUser(data.user);
      } else if(data.status === 404) {
        setHasProfilePhoto(false);
      }
    } catch (error) {
      setError('Error fetching user profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCourses = async () => {
    try {
      const response = await axios.get('http://unisync-api.onrender.com/profile/profile-courses',  {
        withCredentials:true,
    });
      const data = response.data;

      if (data.success) {
        setCourses(data.courses);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Error fetching user courses');
    }
  };

  const fetchUserProjects = async (userId) => {
    try {
      const response = await axios.get('http://unisync-api.onrender.com/profile/profile-projects',  {
        withCredentials:true,
    });
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
    const handleAddSkill = async () => {
        try {
          const response = await axios.put('http://unisync-api.onrender.com/profile/add-skills', {
            skills,
          },{withCredentials:true});
    
          const data = response.data;
            console.log(response.data);
          if (data.success) {
            // Fetch the updated user profile after adding the skill
            setUser((prevUser) => ({
                ...prevUser,
                skills: [...prevUser.skills, skills],
              }));
            setNewSkill(''); // Clear the input field after adding the skill
          } else {
            setError(data.message);
          }
        } catch (error) {
          setError('Error adding skill');
        }
      };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await axios.delete(`http://unisync-api.onrender.com/project/${projectId}/delete-project`, {
        withCredentials:true
      });
      if (response.data.success) {
        // Filter out the deleted project and update state
        const updatedProjects = projects.filter(project => project._id !== projectId);
        setProjects(updatedProjects);
        alert('Project deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };
  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await axios.delete(`http://unisync-api.onrender.com/course/${courseId}/delete-course`, {
        withCredentials:true
      });
      if (response.data.success) {
        // Filter out the deleted project and update state
        const updatedCourses = courses.filter(course => course._id !== courseId);
        setCourses(updatedCourses);
        alert('Course deleted successfully');
        // window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error deleting course');
    }
  };

  return (
    <div className='screen bg-[#232323] flex flex-col text-white p-8'>
      <div className='flex flex-col'>
{/* HEADER */}
          <div className='header flex'  style={{marginBottom:'3.3vw'}}>
            <img src={disang_logo} style={{width:'4.2vw', height:'4.2vw', marginRight:'1.58vw'}}/>
          <img src={disang_logo} style={{ width: '4.2vw', height: '4.2vw' }} />
          <NavBar></NavBar>
            <div className='flex justify-center items-center text-3xl	text-center	w-full'>
              <div className='flex justify-center items-center text-center ' style={{fontSize: '3.17vw',marginRight:'12vw'}}>Profile Setup</div>
            </div>
          </div>
{/* Photo */}
          
          <div className='flex h-full items-center justify-center' style={{marginBottom:'3vw'}}>
            <div className='flex'>
              <div>
                <div className='flex w-full flex-col  cursor-pointer hover:opacity-80 justify-center items-center mr-20'
                          style={{width:'16.66vw', height:'21.14vw', borderRadius:'27px'}}>
                        

                          <div style={{overflow: 'hidden', height:'100%', width:'100%', zIndex:'50'}}><img
                              src={'http://unisync-api.onrender.com/profile/profile-photo'}
                              
                              alt={"user profile "}
                              style={{height:'100%', objectFit: 'cover', borderRadius: '10px'}}
                                />
                            </div>

                      </div>
                          <div className='flex'>
                <label htmlFor="fileInput" className="fileInputContainer" style={{
                  alignItems: 'center', justifyContent: 'center', margin: "1rem",
                }}>
                            Edit Photo
                  <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange}  />
                            
                          </label>
                          { selectedPhoto &&
                            <div className='flex flex-col h-full w-full justify-center items-center' id='addPhotoText' onClick={handleAddPhoto}>Confirm Photo </div>}
                          { (!deleteStatus) &&
                          <div>
                    <div onClick={handleDeletePhoto} className='flex justify-center cursor-pointer p-2' style=
                      {{
                        backgroundColor: 'white',
                      color: '#8598FF',
                      borderRadius: '16px',
                      margin: "0.5rem",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft:"2rem"
                      }}>Delete Photo<img style={{ marginLeft: '1vw' }} src={edit} /></div>

                            {deleteStatus && (
                              <div>
                                {deleteStatus.success ? (
                                  <p>{deleteStatus.message}</p>
                                ) : (
                                  <p style={{ color: 'red' }}>{deleteStatus.message}</p>
                                )}
                              </div>
                            )}      
                          </div>}
                          </div>
              </div>
            
{/* PROFILE PART */}
            <div className='flex flex-col'>
              {user && (
                <div>
{/* NAME */}
                  <div className='flex' style={{fontSize:'2.11vw',boxShadow:' 0 0.26vw 0.26vw 0 #8598FF', width:'47.75vw', marginBottom:'3vw',padding:'0.26vw 0px 0.26vw 1vw'}}><span style={{fontWeight:'700', marginRight:'3.2vw' }}>Name</span><p style={{fontSize:'1.6vw', textAlign:'center', paddingTop:'0.45vw'}}> {user.name}</p></div>
{/* EMAIL*/}
                  <div className='flex' style={{fontSize:'2.11vw',boxShadow:' 0 0.26vw 0.26vw 0 #8598FF', width:'47.75vw', marginBottom:'3vw',padding:'0.26vw 0px 0.26vw 1vw'}}><span style={{fontWeight:'700', marginRight:'3.3vw'}}>Email</span><p style={{fontSize:'1.6vw', textAlign:'center', paddingTop:'0.45vw'}}> {user.email}</p></div>
{/* SKILL*/}
                    <div className='flex' style={{fontSize:'2.11vw',boxShadow:' 0 0.26vw 0.26vw 0 #8598FF', width:'47.75vw',padding:'0.26vw 0.5vw 0.26vw 1vw', paddingTop:'0.45vw' }}>
                      <span style={{fontWeight:'700', marginRight:'3vw'}}>Skills</span>
                      <input
                        type="text"
                        placeholder="Add skills"
                        value={skills}
                        onChange={(e) => setNewSkill(e.target.value)}
                        style={{fontSize:'1.6vw', textAlign:'center',  marginLeft:'1vw', color:'grey',backgroundColor: '#232323' }}/>
                      {user.skills && (
                      <div>
                        <ul className='flex-col' style={{fontSize:'1.6vw', textAlign:'center', marginRight:'1vw'}}>
                        {user.skills.map((skill, index) => (
                          <li key={index}>{skill}
                            {index !== user.skills.length - 1 && <br />}
                          </li>
                        ))}
                      </ul>
                      </div>
                        )}
                      <div className='cursor-pointer'><span onClick={handleAddSkill} src={edit} style={{paddingTop:'1vw', marginLeft:'14vw', fontSize:'0.8vw', color:'grey'}}>ADD</span> </div>
                    </div>

                </div>)}
            </div>

          </div>
      </div>
{/* 2nd PART */}
      <div className='courses&projects flex flex-col'>
{/* COURSES */}
        <div className='flex items-center justify-center'>
          
            {user && (
              <div>
                <div className='flex'>
                  <input
                    type="text"
                    placeholder="Enter course name"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    style={{fontSize:'1.6vw', textAlign:'center',  marginLeft:'1vw', color:'grey',backgroundColor: '#232323' }}/><p src={addCourses} onClick={handleAddCourse} className=' flex cursor-pointer' style={{fontSize:'0.95vw', color:'grey', paddingTop:'0.5vw'}}>ADD COURSE</p>
                </div>
                
                <div className='flex items-center justify-center h-full'>
                <div className='flex items-center justify-center h-full'>
                <div className='courses flex' style={{width: '70.2vw',height:'9.2vw', border:'2px white solid', borderRadius:'1vw', alignItems:'center', justifyContent:'center'}}>
                {courses.length > 0 ? (
                  <div className='flex m-4'>
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
            style={{height:'12vw'}}
          >
                  {courses.map((course) => (
                      <div className='cursor-pointer flex' style={{margin:'1vw'}}>
                      <div className='flex w-1/3 flex-col' style={{height:"4rem"}}>
                      <p key={course._id} > <Link to={`/single-course/${course._id}`}>{course.name}</Link></p>
                      <button onClick={() => handleDeleteCourse(course._id)} style={{fontSize:'1vw', color:'grey'}}>REMOVE</button>
                      </div> 
                      <div className='flex w-2/3 justify-center items-center h-full w-full' style={{fontSize:'1vw'}}>
                        {course.description}
                </div>                      
                      </div>   
                  ))}
                  </Carousel>
                </div>) : (
                  <div style={{fontSize:'1.6vw', textAlign:'center',  marginLeft:'1vw', color:'grey',backgroundColor: '#232323' }}>
                    No Courses
                  </div>
                )}
                </div>
                  </div>
              
              </div>
            </div>)}
          </div>
{/* PROJECTS */}
        <div className='flex items-center justify-center'>
          
          {user && (
            <div>
                <div className='flex' style={{color:'grey', fontSize:'1.6vw'}}>
                  <Link to={`/create-project`}>Click here to ADD PROJECT</Link>
                </div>
                <div className='flex items-center justify-center h-full'>
                  <div className='flex items-center justify-center h-full'>
                      <div className='courses flex' style={{width: '70.2vw',height:'9.2vw', border:'2px white solid', borderRadius:'1vw', alignItems:'center', justifyContent:'center'}}>
                        {projects.length > 0 ? (
                          <div className='flex m-4'>
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
                                style={{height:'12vw'}}
                             >
                          {projects.map((project) => (
                             <div className='cursor-pointer flex' style={{margin:'1vw'}}>
                             <div className='flex w-1/3 flex-col' style={{height:"4rem"}}>
                            <p key={project._id}><Link to={`/single-project/${project._id}`}>{project.name}</Link></p>
                            <p onClick={() => handleDeleteProject(project._id)} style={{fontSize:'1vw', color:'grey'}}>Delete Project</p>
                            </div>
                            <div className='flex w-2/3 justify-center items-center h-full w-full' style={{fontSize:'1vw'}}>
                            {project.description}
                </div>  
                            </div>
                          ))}
                          </Carousel>
                          </div>
                         ) : (
                            <div style={{fontSize:'1.6vw', textAlign:'center',  marginLeft:'1vw', color:'grey',backgroundColor: '#232323' }}>
                            No Projects :/
                          </div>                         
                        )}
                      </div>
                  </div>
                </div>
            </div>
                      )}
                    </div> 
                </div>       
      </div>
      </div>
  );
};

export default ProfilePage;


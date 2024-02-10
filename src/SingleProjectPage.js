import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Player, ControlBar } from "video-react";
import "video-react/dist/video-react.css";
import ReactDOM from "react-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import ReactStars from "react-rating-stars-component";
import NavBar from "./NavBar";

const SingleProjectPage = ({ match }) => {
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [videos, setVideos] = useState([]);
  const [help, setHelp] = useState([]);
  const [newHelp, setNewHelp] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [contributors, setContributors] = useState([]);
  const [contributorsDetails, setContributorsDetails] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [isOwner, setIsOwner] = useState(false);
  
  const fetchOwner = async () => {
    try {
      const response = await axios.get(
        `https://unisync-api.onrender.com/project/${params.pid}/get-owner`,
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      if (data.success) {
        setIsOwner(true);
      }
    } catch (error) {
      setError("Error searching for users");
    }
  };
  const handleSearchUser = async () => {
    try {
      const response = await axios.get(
        `https://unisync-api.onrender.com/profile/search-user/${searchKeyword}`
      );
      console.log(response.data);
      setSearchResults(response.data);
    } catch (error) {
      setError("Error searching for users");
    }
  };
  const fetchVideos = async () => {
    try {
      const videosResponse = await axios.get(
        `https://unisync-api.onrender.com/project/${params.pid}/get-videos`
      );
      setVideos(videosResponse.data.videos);
    } catch (error) {
      setError("Error fetching project videos");
    }
  };
  const fetchCourseComments = async () => {
    try {
      const response = await axios.get(
        `https://unisync-api.onrender.com/project/${params.pid}/comments`
      );
      const data = response.data;

      if (data.success) {
        setComments(data.comment);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error fetching project comments");
    }
  };
  const fetchProjectRating = async () => {
    try {
      const response = await axios.get(
        `https://unisync-api.onrender.com/project/${params.pid}/rating`
      );
      const data = response.data;

      if (data.success) {
        setRating(data.rating);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error fetching project rating");
    }
  };
  const handleRatingSubmit = async () => {
    try {
      // Make a request to post a new rating
      const response = await axios.post(
        `https://unisync-api.onrender.com/project/${params.pid}/post-rating`,
        {
          userrating: userRating,
        },
        { withCredentials: true }
      );
      const data = response.data;

      if (data.success) {
        // Update the rating after successfully posting a new rating
        setRating(data.rating);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error posting rating");
    }
  };
  const handleCommentSubmit = async () => {
    try {
      // Make a request to post a new comment
      const response = await axios.put(
        `https://unisync-api.onrender.com/project/${params.pid}/post-comment`,
        {
          comment: newComment,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;

      if (data.success) {
        setComments(data.comments);
        setNewComment("");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error posting comment");
    }
  };
  const ratingChanged = (newRating) => {
    console.log(newRating);
    setUserRating(newRating);
  };
  const handleHelpSubmit = async () => {
    try {
      // Make a request to post a new comment
      const response = await axios.put(
        `https://unisync-api.onrender.com/project/${params.pid}/add-help`,
        {
          comment: newHelp,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;

      if (data.success) {
        // Update the comments after successfully posting a new comment
        console.log(response.data);
        var nhelp = {
          user: response.data.userFields,
          comment: data.addhelp.comment,
        };
        console.log(nhelp);
        setHelp((prevHelp) => [...prevHelp, nhelp]);
        // window.location.reload();
      } else {
        setError(data.message);
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
      setError("Error posting comment");
    }
  };
  const handleAddContributor = async () => {
    try {
      if (!selectedUser) {
        setError("Please select a user to add as a contributor");
        return;
      }

      const response = await axios.put(
        `https://unisync-api.onrender.com/project/${params.pid}/add-contributor`,
        selectedUser,
        {
          withCredentials: true,
        }
      );
      setContributors(response.data.updContributors);
      setSearchKeyword("");
      setSearchResults([]);
      setSelectedUser(null);
      setError("");
    } catch (error) {
      setError("Error adding contributor");
    }
  };
  useEffect(() => {
    // Fetch contributor details when contributors array changes
    const fetchContributorDetails = async () => {
      try {
        const contributorDetails = await Promise.all(
          contributors.map(async (contributorId) => {
            const response = await axios.get(
              `https://unisync-api.onrender.com/profile/${contributorId}`
            );
            return response.data.user; // Assuming you get the full user details from the profile endpoint
          })
        );

        // Update the state with contributor details
        setContributorsDetails(contributorDetails);
      } catch (error) {
        setError("Error fetching contributor details");
      }
    };

    // Check if contributors array is not empty
    if (contributors.length > 0) {
      fetchContributorDetails();
    }
  }, [contributors]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `https://unisync-api.onrender.com/project/${params.pid}`
        );
        setProject(response.data.project);
        const helpResponse = await axios.get(
          `https://unisync-api.onrender.com/project/${params.pid}/ask-for-help`
        );
        console.log(helpResponse.data);
        setHelp(helpResponse.data.help);
        const contriResponse = await axios.get(
          `https://unisync-api.onrender.com/project/${params.pid}/get-contributor`
        );
        console.log(contriResponse.data);
        setContributors(contriResponse.data.contributors);
      } catch (error) {
        setError(error.response.data.error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    fetchProjectRating();
    fetchVideos();
    fetchCourseComments();
    fetchOwner();
  }, []);

  const renderStars = () => {
    const stars = [];

    for (let i = 0; i < 1; i++) {
      stars.push(
        <span
          key={i}
          className="text-yellow-400"
          style={{ borderRadius: "50%" }}
        >
          &#9733;
        </span>
      );
    }
    return stars;
  };
  const deleteProject = async () => {
    try {
      // Assuming you have a function to get the current user details

      const response = await axios.delete(
        `https://unisync-api.onrender.com/project/${params.pid}/delete-project`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        navigate(`/profile-page`);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Error deleting project");
    }
  };

  return (
    <div className='bg-[#232323] flex flex-col text-white p-8' style={{ minHeight: '100vh' }}>
      <NavBar></NavBar>
      {project && (
        <div
          style={{
            paddingTop: "2.11vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            
          }}
        >
          <div className="col1 flex flex-col" style={{ marginRight: "1.05vw" }}>
            <div
              style={{
                height: "33.2vw",
                width: "33.2vw",
                border: "1px solid white",
              }}
              className="flex flex-col justify-center items-center"
            >
              <div
                style={{
                  color: "#fff",
                  fontSize: "2vw",
                  fontWeight: "700",
                  marginBottom: "1vw",
                  
                }}
              >
                Project Photos/Videos{" "}
              </div>
              <div
        style={{
          height: "12vw",
          width: "30vw",
          border: "2px dashed #cccccc",
          textAlign: "center",
          display: "flex", // Ensure flex properties are applied
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden", // Prevents content from overflowing
        }}
        className="flex flex-col w-full h-full items-center justify-center"
      >
        <img
          src={`https://unisync-api.onrender.com/project/${params.pid}/photo`}
          alt="Project"
          style={{
            maxWidth: "100%", // Adjusts width to not exceed the container's width
            maxHeight: "100%", // Adjusts height to not exceed the container's height
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      </div>

              <div
  style={{
    height: '15vw',
    width: '30vw',
    border: '2px dashed #cccccc',
    textAlign: 'center',
    display: 'flex', // Use flex to align children
    flexDirection: 'column', // Stack children vertically
    justifyContent: 'center', // Center children vertically
    alignItems: 'center', // Center children horizontally
    overflow: 'hidden', // Prevent content from spilling outside
  }}
  className='flex flex-col w-full h-full items-center justify-center'
>
  {videos.length > 0 && (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
   
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%', height: '100%', overflowY: 'auto' }}>
        {videos.map((video, index) => (
          <li key={index} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1vw' }}>
            <div style={{ width: '90%', height: 'auto' }}> {/* Adjust to fit within the container */}
              <Player autoPlay src={video} style={{ width: '100%', height: 'auto' }}>
                <ControlBar autoHide={false} />
              </Player>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

            </div>

            {/* CONTRIBUTORS */}
            
            {isOwner && (
              <div
                style={{
                  marginTop: "1.05vw",
                  height: "15vw",
                  width: "33.2vw",
                  border: "1px solid white",
                  
                }}
              >
                <div className="contributor-search">
                  <div className="flex w-full justify-center items-center"
                    style={{maxHeight : "15vw", overflow:"hidden", fontSize: "1.6vw", color:"rgb(133, 152, 255)", fontWeight: "700",padding:"1rem",margin:"1vh"}}><h2>Add Contributors</h2></div>
                  
                  <input
                    type="text"
                    placeholder="Search for users"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{ backgroundColor: "#232323",margin:"1rem", paddingLeft:"6rem"}}
                  />
                  <button onClick={handleSearchUser} style={{
                    backgroundColor: "#fff", // Replace with the actual background color from your image
                    color: "#8598FF", // Replace with the actual text color from your image
                    border: "none",
                  borderRadius: "10px",
                  justifyContent: "center",
                  marginLeft: "2rem",
                  width:"5rem",
                  height:"3rem",// Adjust as needed to match your image
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                  }}>Search</button>
                  <div
                style={{
                  maxHeight: "30vh", // Set a max-height for scrolling
                  overflowY: "auto", // Enables vertical scrolling
                  margin: "0 0", // Optional: Adds some space around the comments list
                  boxSizing: "content-box",
                }}
              >
                  {searchResults && searchResults.length > 0 && (
                    <div style={{height:"10vw",overflowY: "true",
                    maxHeight:"10vw"}}>
                      <h2 style={{fontWeight:"bold"}}>Search Results</h2>
                      <ul >
                        
                        {searchResults.map((user) => (
                          <div style={{padding:"0.5rem", backgroundColor:"#1E1E1E",margin:"0.5rem",borderRadius:"10%",overflowY:"true"}}>
                          <li key={user.userid}>
                            {user.name} 
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                handleAddContributor();
                              }}
                              style={{ backgroundColor: "#fff", // Replace with the actual background color from your image
                              color: "#8598FF", // Replace with the actual text color from your image
                              border: "none",
                            borderRadius: "10px",
                            justifyContent: "center",
                            marginLeft: "2rem",
                            width:"6rem",
                            height:"3rem",// Adjust as needed to match your image
                              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",}}
                            >
                              Add Contributor
                            </button>
                            </li>
                            </div>
                        ))}
                          
                      </ul>
                    </div>
                  )}
                     </div>
                </div>
              </div>
              )}
           
           {contributorsDetails && contributorsDetails.length > 0 && (
  <div
    style={{
      marginTop: "1.05vw",
      height: "20vw",
      width: "33.2vw",
      border: "1px solid white",
      overflow: "hidden", // Ensures that nothing overflows the container
    }}
  >
    <div className="flex w-full justify-center items-center"
        style={{ fontSize: "1.6vw", color:"rgb(133, 152, 255)", fontWeight: "700", padding:"1rem", margin:"1vh"}}>
      <h2>Contributors</h2>
    </div>
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
      dynamicHeight={false} // Consider setting to false to maintain a consistent height
      style={{ height: "100%" }} // Ensure the carousel fits the parent div
      // style={{ flexGrow: 1 }} // Allows the carousel to fill the container

    >
      {contributorsDetails.map((contributor, index) => (
        <div
          key={index}
          style={{
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // height: "100%", // Ensures the carousel item fits within the carousel height
          }}
        >
          <li style={{ listStyleType: "none" }}> {/* Removes bullet points */}
            <Link to={`/user/${contributor._id}`}>
              <img
                src={`https://unisync-api.onrender.com/profile/${contributor._id}/get-photo`}
                alt="Contributor"
                style={{
                  maxWidth: "10rem", // Use maxWidth and maxHeight to ensure image responsiveness
                  maxHeight: "20rem",
                //   maxWidth: "100%", // Ensures the image is not wider than the container
                // maxHeight: "100%", // Ensures the image is not taller than the container
                  objectFit: "scale-down",
                  borderRadius: "10px",
                }}
              />
            </Link>
          </li>
        </div>
      ))}
    </Carousel>
  </div>
)}

          </div>


          <div className="col2 flex flex-col" style={{ marginRight: "1.05vw" }}>
            {/* TITLE */}
            {project && (
              <div
                style={{
                  color: "#8598FF",
                  fontWeight: "700",
                  fontSize: "3.2vw",
                  backgroundColor: "#232323",
                  border: "none", // Example to remove border
                  outline: "none", // Example to remove outline
                  padding: "10px", // Adjust padding as needed
                  resize: "none", // Prevent textarea from being resized
                  width: "34vw",
                  height: "11.23vw",
                }}
              >
                {project.name}
              </div>
            )}
            {/* DESCRIPTION */}
            <div
              style={{
                marginTop: "1.05vw",
                height: "21.16vw",
                width: "33.2vw",
                border: "1px solid white",
                padding: "1vw",
              }}
            >
              <div
                className="flex w-full justify-center items-center"
                style={{
                  fontSize: "1.6vw",
                  color: "#8598FF",
                  fontWeight: "700",
                  paddingBottom: "1vw", 
                }}
              >
                {" "}
                <p>About Project</p>
              </div>
              <p style={{ fontSize: "1.05vw", margin: "0"  }}>{project.description}</p>
            </div>
            {/* LINKS */}
            <div
              style={{
                marginTop: "1.05vw",
                height: "7vw",
                width: "33.2vw",
                border: "1px solid white",
                padding: "1vw",
              }}
            >
              <div
                className="flex w-full justify-center items-center"
                style={{
                  fontSize: "1.6vw",
                  color: "#8598FF",
                  fontWeight: "700",
                  
                }}
              >
                {" "}
                <p>Links</p>
              </div>
              {project.links.join(", ")}
            </div>
            {/* TECHSTACKS */}
            <div
              style={{
                marginTop: "1.05vw",
                height: "7vw",
                width: "33.2vw",
                border: "1px solid white",
                padding: "1vw",
              }}
            >
              <div
                className="flex w-full justify-center items-center"
                style={{
                  fontSize: "1.6vw",
                  color: "#8598FF",
                  fontWeight: "700",
                  
                }}
              >
                {" "}
                <p>Techstacks</p>
              </div>
              <p>{project.techstacks.join(", ")}</p>
            </div>
          </div>
          <div className="col3 flex flex-col" style={{ height: "50vw" }}>
            {/* DELETE PROJECT/EDIT PROJECT */}
            {isOwner && (
              <div>
                <button onClick={deleteProject} style={{
                    
                    backgroundColor: "#fff", // Replace with the actual background color from your image
                      color: "#FF0000", // Replace with the actual text color from your image
                      border: "none",
                    borderRadius: "10px",
                    justifyContent: "center",
                    marginLeft: "2rem",
                    width:"5rem",
                    height:"3rem",// Adjust as needed to match your image
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)", // Adjust the color and spread as needed
                      marginBottom:"3rem"
                    }}>Delete</button>
                <Link to={`/edit-project/${params.pid}`}>
                  <button style={{
                    
                    backgroundColor: "#fff", // Replace with the actual background color from your image
                      color: "#8598FF", // Replace with the actual text color from your image
                      border: "none",
                    borderRadius: "10px",
                    justifyContent: "center",
                    marginLeft: "2rem",
                    width:"5rem",
                    height:"3rem",// Adjust as needed to match your image
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)", // Adjust the color and spread as needed
                    }}> Edit </button>
                </Link>
              </div>
            )}
            {/* RATING */}
            
            <div className="rating" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ReactStars
                count={5}
                onChange={ratingChanged}
                size={45}
                isHalf={true}
                activeColor="#ffd700"
                style={{ marginRight: "10px" }} // Adjust the margin as needed
              />
                {/* Vertical Line */}
            <div style={{
              height: "50px",
              width: "2px",
              backgroundColor: "#fff",
              margin: "5px 5px",
            }}></div>
              <button
                onClick={handleRatingSubmit}
                style={{
                  backgroundColor: "#fff",
                  color: "#8598FF",
                  border: "none",
                  borderRadius: "10px",
                  justifyContent: "center",
                  margin: "5px 5px", // Adjust based on your layout preference
                  width: "5rem",
                  height: "3rem",
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                }}
              >
                Submit Rating
              </button>
            </div>

              {/* Vertical Line */}
            <div style={{
              height: "50px",
              width: "2px",
              backgroundColor: "#fff",
              margin: "5px 5px",
            }}></div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {rating && (
                <p style={{ margin: 0 }}>
                  {rating.toFixed(2)}
                  {/* Assuming renderStars() correctly renders star icons based on the rating */}
                  {renderStars()}
                </p>
              )}
            </div>
          </div>


            {/* COMMENT */}
            <div
              style={{
                marginTop: "1.05vw",
                height: "25.4vw",
                width: "20vw",
                border: "1px solid white",
                padding: "1vw",
              }}
            >
              <div
                className="flex w-full justify-center items-center"
                style={{
                  fontSize: "1.6vw",
                  color: "#8598FF",
                  fontWeight: "700",
                }}
              >
                <p>Comments</p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Enter your comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ width: "40%", background: "none",marginLeft:"1rem" }}
                  
                  // Ensures the input doesn't overflow
                />
                <button onClick={handleCommentSubmit} style={{
                  backgroundColor: "#fff", // Replace with the actual background color from your image
                  color: "#8598FF", // Replace with the actual text color from your image
                  border: "none",
                borderRadius: "10px",
                justifyContent: "center",
                marginLeft: "2rem",
                width:"5rem",
                height:"2rem",// Adjust as needed to match your image
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                }}>Post </button>
              </div>
              <div
                style={{
                  maxHeight: "15vw", // Set a max-height for scrolling
                  overflowY: "auto", // Enables vertical scrolling
                  margin: "10px 0", // Optional: Adds some space around the comments list
                }}
              >
                {comments.length > 0 ? (
                  <ul>
                    {comments.map((comment, index) => (
                      <li
                        key={index}
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          background: "#1E1E1E",
                          padding: "0.5rem",
                          margin: "0.1rem",
                          marginLeft: "0.1rem",
                          marginRight:"0.1rem",   
                          borderRadius:"10%"
                        }}
                      >
                        {comment}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            </div>

            {/* help */}

            <div
  style={{
    marginTop: "1.05vw",
    height: "15vw",
    width: "20vw",
    border: "1px solid white",
    overflowY: "auto",
    maxHeight: "15vw",
    padding: "1vw",
  }}
>
  <div
    className="flex w-full justify-center items-center"
    style={{
      fontSize: "1.6vw",
      color: "#8598FF",
      fontWeight: "700",
    }}
  >
    <p>Help</p>
  </div>
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <input
        type="text"
        placeholder="Enter your help"
        value={newHelp}
        onChange={(e) => setNewHelp(e.target.value)}
        style={{ width: "60%", background: "#232323" }}
      />
      <button onClick={handleHelpSubmit} style={{
        backgroundColor: "#fff",
        color: "#8598FF",
        border: "none",
        borderRadius: "10px",
        justifyContent: "center",
        marginLeft: "2rem",
        width: "5rem",
        height: "3rem",
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
      }}>Post help</button>
    </div>
    {help && help.length > 0 && (
      <div style={{
        margin: "10px 0",
        padding: "2rem"
      }}>
        <div
          style={{
            maxHeight: "8vw",
            overflowY: "auto",
            margin: "10px 0",
          }}
        ></div>
        <ul style={{ listStyle: "none" }}>
          {help.map((help, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={`https://unisync-api.onrender.com/profile/${help.user._id}/get-photo`}
                alt="Project"
                style={{
                  width: "30px",
                  height: "30px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              {help.user.name}
              <br />
              {help.comment}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProjectPage;

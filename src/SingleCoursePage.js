// SingleCoursePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import disang_logo from "./Images/disang_logo.svg";
import ReactStars from "react-rating-stars-component";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import NavBar from "./NavBar";
const SingleCoursePage = ({ match }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);

  const params = useParams();
  const fetchCourseRating = async () => {
    try {
      const response = await axios.get(
        `https://unisync-api.onrender.com/course/${params.cid}/rating`
      );
      const data = response.data;

      if (data.success) {
        setRating(data.rating);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error fetching course rating");
    }
  };
  const fetchSingleCourse = async () => {
    try {
      const response = await axios.get(
        `https://unisync-api.onrender.com/course/single-course/${params.cid}`
      );
      const data = response.data;

      if (data.success) {
        setCourse(data.course);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error fetching single course");
    } finally {
      setLoading(false);
    }
  };
  const fetchCourseComments = async () => {
    try {
      const response = await axios.get(
        `https://unisync-api.onrender.com/course/${params.cid}/comments`
      );
      const data = response.data;

      if (data.success) {
        setComments(data.comment);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error fetching course comments");
    }
  };
  const handleCommentSubmit = async () => {
    try {
      // Make a request to post a new comment
      const response = await axios.post(
        `https://unisync-api.onrender.com/course/${params.cid}/post-comment`,
        {
          comment: newComment,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;

      if (data.success) {
        // Update the comments after successfully posting a new comment
        setComments(data.comments);
        setNewComment(""); // Clear the input field
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error posting comment");
    }
  };
  const handleRatingSubmit = async () => {
    try {
      // Make a request to post a new rating
      const response = await axios.post(
        `https://unisync-api.onrender.com/course/${params.cid}/post-rating`,
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
  const ratingChanged = (newRating) => {
    console.log(newRating);
    setUserRating(newRating);
  };

  useEffect(() => {
    fetchSingleCourse();
    fetchCourseRating();
    fetchCourseComments();
  }, []);
  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating);
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
  return (
    <div
      className="bg-[#232323] flex flex-col text-white p-8"
      style={{ minHeight: "100vh" }}
    >

      <div className="header flex" style={{ marginBottom: "3.3vw" }}>
        <img
          src={disang_logo}
          alt="logo"
          style={{ width: "4.2vw", height: "4.2vw", marginRight: "1.58vw" }}
        />
        <img
          src={disang_logo}
          alt="logo"
          style={{ width: "4.2vw", height: "4.2vw" }}

        />
        <NavBar></NavBar>
      </div>
      {course && (
        <div>
          <div className="text-5xl font-bold text-[#8598FF] mb-4 ">
            {course.name}
          </div>

          <div className="flex h-2/3 b-2 m-4">
            <div className="w-3/4 flex flex-col h-full mr-4">
              <div className="flex flex-col p-4 border-2 border-white h-4/5">
                <div className="mb-2 text-xl font-semibold text-[#8598FF]">
                  About the Course
                </div>
                <div className="text-gray-400 text-left">
                  {course.description}
                </div>
              </div>
              <div className="relative flex flex-row h-1/5 mt-4 items-center justify-start" style={{marginTop:"1rem"}}>
              {/* Rating Display */}
                <div className="text-white"
                style={{marginLeft:"3rem",marginRight:"3rem"}}>
                {rating && (
                  <p style={{fontSize:'3vw'}}>
                    {rating.toFixed(2)}
                    {renderStars(course.rating)}
                  </p>
                )}
              </div>

              {/* Rating Input */}
              <div className="text-white flex flex-row justify-start" style={{marginRight:"3rem"}}>
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={36}
                  activeColor="#ffd700"
                  style={{ marginBottom: "10px" }}
                />
                <button
                  onClick={handleRatingSubmit}
                  style={{
                    backgroundColor: "#fff",
                    color: "#8598FF",
                    border: "none",
                    borderRadius: "10px",
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                    padding: "3px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                    outline: "none",
                    width: "100px",
                    height: "50px",
                  }}
                >
                  Submit Rating
                </button>
              </div>

              {/* Edit Button */}
              <div className="flex ">
                <Link to={`/edit-course/${params.cid}`}>
                  <button
                    style={{
                      backgroundColor: "#fff",
                      color: "#8598FF",
                      border: "none",
                      borderRadius: "10px",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                      padding: "10px 20px",
                      fontSize: "16px",
                      cursor: "pointer",
                      outline: "none",
                      width: "83px",
                      height: "50px",
                    }}
                  >
                    Edit
                  </button>
                </Link>
              </div>
            </div>

            </div>
            <div className="h-full relative w-1/4 text-[#8598FF] border-2 border-white text-3xl p-4">
              <div className="mb-4">
                <h2 className="text-3xl text-[#8598FF]">Comments</h2>
              </div>
              <div className="mb-4 mt-4">
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="placeholder:text-xl placeholder: text-white rounded-md bg-[#232323] border-[1px] border-white"
                  style={{width:"60%"}}
                />
                 <button onClick={handleCommentSubmit} style={{
                      backgroundColor: "#fff", // Replace with the actual background color from your image
                      color: "#8598FF", // Replace with the actual text color from your image
                      border: "none",
                      borderRadius: "10px", // Adjust as needed to match your image
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)", // Adjust the color and spread as needed
                      padding: "5px 20px", // Adjust as needed based on your image
                      fontSize: "16px", // Adjust as needed based on your image
                      // Adjust if your button text is bold
                      cursor: "pointer",
                      outline: "none",
                      width: "70px", // Based on the width provided in your image
                      height: "46px",
                    margin:"1rem"
                    }}>Post</button>
              </div>
              <div className="space-y-4 h-2/3 overflow-y-auto">
                <div className="flex items-start space-x-4">
                  <div className="flex-1 text-white" >

                {comments.length > 0 && (
                  comments.map((comment, index) => (
                    <div key={index} style={{backgroundColor:"#1E1E1E", marginBottom:"0.5rem",padding:"0.5rem"}}>{comment}</div>
                    ))
                    )}
              </div>
             </div>
              
              </div>
            </div>
          </div>

          {/* <div style={{ position: "absolute", top: "10rem" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "0px" }}>
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={36}
                  activeColor="#ffd700"
                  style={{ marginBottom: "10px" }}
                />
                <button
                  onClick={handleRatingSubmit}
                  style={{
                    border: "none",
                    borderBottom: "2px solid white",
                    background: "none",
                    color: "white",
                    width: "100%",
                    outline: "none",
                    padding: "2px",
                  }}
                >
                  Submit Rating
                </button>
              </div>
              <hr
                style={{
                  width: "5rem",
                  border: "1px solid white",
                  transform: "rotate(90deg)",
                  margin: "0rem",
                }}
              />

             
              <div style={{}}>
                {rating && (
                  <p>
                    {rating}
                    {renderStars(course.rating)}
                  </p>
                )}
              </div>
              <hr
                style={{
                  
                  width: "5rem",
                  border: "1px solid white",
                  transform: "rotate(90deg)",
                }}
              />

              <div style={{}}>
                <Link to={`/edit-course/${params.cid}`}>
                  <button
                    style={{
                      backgroundColor: "#fff", // Replace with the actual background color from your image
                      color: "#8598FF", // Replace with the actual text color from your image
                      border: "none",
                      borderRadius: "10px", // Adjust as needed to match your image
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)", // Adjust the color and spread as needed
                      padding: "10px 20px", // Adjust as needed based on your image
                      fontSize: "16px", // Adjust as needed based on your image
                      // Adjust if your button text is bold
                      cursor: "pointer",
                      outline: "none",
                      width: "83px", // Based on the width provided in your image
                      height: "50px",
                    }}
                  >
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          </div> */}
          {/* <Carousel
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
            axis="vertical"
          >
            <div>
              <input
                type="text"
                placeholder="Enter your comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleCommentSubmit}>Post Comment</button>
              {comments.length > 0 && (
                <div>
                  <h2>Comments:</h2>
                  <ul>
                    {comments.map((comment, index) => (
                      <li key={index}>{comment}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Carousel> */}
        </div>
      )}
    </div>
  );
};

export default SingleCoursePage;

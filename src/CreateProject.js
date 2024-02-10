import axios from "axios";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import plus from "./Images/Vector.svg";
import "./CreateProject.css";
import ReactStars from "react-rating-stars-component";
import NavBar from "./NavBar";
const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    links: "",
    techstacks: "",
    comments: "",
    rating: "0",
    photo: null,
  });
  const [video, setVideo] = useState(null);
  const navigate = useNavigate();
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const onDropVideo = async (acceptedFiles) => {
    try {
      const videoFile = acceptedFiles[0];

      // Create a FormData object to send the file
      setVideo(videoFile);
    } catch (error) {
      console.error(error);
    }
  };
  const { getRootProps: getRootPropsVideo, getInputProps: getInputPropsVideo } =
    useDropzone({
      onDrop: onDropVideo,
      accept: "video/*",
      maxFiles: 1,
    });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      photo: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    for (const key in formData) {
      formDataObj.append(key, formData[key]);
    }

    try {
      const response = await fetch(
        "http://localhost:8000/project/create-project",
        {
          method: "POST",
          body: formDataObj,
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // Handle success, redirect, or update state as needed
        const projectId = result.project._id;
        const videoFormData = new FormData();
        videoFormData.append("video", video);
        const videoResponse = await axios.put(
          `http://localhost:8000/project/${projectId}/add-video`,
          videoFormData,
          {
            withCredentials: true,
          }
        );
        if (videoResponse.data.success) {
          const videoResult = videoResponse.data.videoUrl;
          console.log(videoResult);
          navigate("/profile-page");
          // Handle success, redirect, or update state as needed
        } else {
          const videoError = await videoResponse.json();
          if (videoResponse.status == 404) {
            navigate("/profile-page");
          }
          console.error(videoError);
          // Handle error
        }
      } else {
        const error = await response.json();
        console.error(error);
        navigate("/profile-page");
        // Handle error
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/profile-page");
      // Handle network error
    }
  };
  const [isRatingToggled, setRatingToggle] = useState(false);
  const [isHelpToggled, setHelpToggle] = useState(false);
  const [isCommentsToggled, setCommentsToggle] = useState(false);

  const toggleRating = () => {
    setRatingToggle(!isRatingToggled);
    if (!isRatingToggled) {
      // Code to run when toggle button is turned ON
      console.log("Toggle is ON");
    } else {
      // Code to run when toggle button is turned OFF
      console.log("Toggle is OFF");
    }
  };
  const toggleHelp = () => {
    setHelpToggle(!isHelpToggled);
    if (!isHelpToggled) {
      // Code to run when toggle button is turned ON
      console.log("Toggle is ON");
    } else {
      // Code to run when toggle button is turned OFF
      console.log("Toggle is OFF");
    }
  };
  const toggleComments = () => {
    setCommentsToggle(!isCommentsToggled);
    if (!isCommentsToggled) {
      // Code to run when toggle button is turned ON
      console.log("Toggle is ON");
    } else {
      // Code to run when toggle button is turned OFF
      console.log("Toggle is OFF");
    }
  };
  const ratingChanged = (newRating) => {
    console.log(newRating);
  };
  return (
    <div
      className="screen bg-[#232323] flex flex-col text-white p-8"
      style={{ paddingBottom: "0" }}
    >
       <NavBar></NavBar>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ padding: "2.11vw 7vw 7vw 7vw", display: "flex" }}>
          <div className="col1 flex flex-col" style={{ marginRight: "1.05vw" }}>
            <div
              style={{
                height: "33.2vw",
                width: "33.2vw",
                border: "1px solid white",
              }}
              className="flex justify-center items-center"
            >
              <label>
                <div
                  style={{
                    color: "#fff",
                    fontSize: "2vw",
                    fontWeight: "700",
                    marginBottom: "1vw",
                  }}
                >
                  Add Project Photos or Videos{" "}
                </div>
                <div
                  {...getRootPropsVideo()}
                  style={{
                    height: "25vw",
                    width: "30vw",
                    border: "2px dashed #cccccc",
                    textAlign: "center",
                  }}
                  className="flex flex-col w-full h-full items-center justify-center"
                >
                  <input {...getInputPropsVideo()} />
                  <p style={{ margin: "1vw" }}>
                    Drag 'n' drop a video file here, or click to select one
                  </p>
                  <input type="file" name="photo" onChange={handleFileChange} />
                </div>
                {uploadedVideoUrl && (
                  <p>
                    Video uploaded successfully. Video URL: {uploadedVideoUrl}
                  </p>
                )}

                {/* Add more input fields for other properties */}
              </label>
            </div>
            <div
              style={{
                marginTop: "1.05vw",
                height: "15vw",
                width: "33.2vw",
                border: "1px solid white",
              }}
            >
              <label>
                <textarea
                  type="text"
                  name="techstacks"
                  placeholder="Add Techstacks"
                  onFocus={(e) => e.target.select()}
                  onClick={(e) => e.target.select()}
                  onChange={handleChange}
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "1.5vw",
                    backgroundColor: "#232323",
                    border: "none", // Example to remove border
                    outline: "none", // Example to remove outline
                    padding: "10px", // Adjust padding as needed
                    resize: "none", // Prevent textarea from being resized
                    width: "30vw",
                  }}
                  className="description-placeholder"
                />
              </label>
            </div>
          </div>
          <div className="col2 flex flex-col">
            <div style={{ height: "11.24vw" }}>
              <label>
                <textarea
                  type="text"
                  name="name"
                  placeholder="ADD&#10;PROJECT NAME"
                  onFocus={(e) => e.target.select()}
                  onClick={(e) => e.target.select()}
                  onChange={handleChange}
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
                  className="customPlaceholder"
                />
              </label>
            </div>
            <div
              style={{
                marginTop: "1.05vw",
                height: "21.16vw",
                width: "33.2vw",
                border: "1px solid white",
              }}
            >
              <label>
                <textarea
                  type="text"
                  name="description"
                  placeholder="Add Description:"
                  onFocus={(e) => e.target.select()}
                  onClick={(e) => e.target.select()}
                  onChange={handleChange}
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "2vw",
                    backgroundColor: "#232323",
                    border: "none", // Example to remove border
                    outline: "none", // Example to remove outline
                    padding: "10px", // Adjust padding as needed
                    resize: "none", // Prevent textarea from being resized
                    width: "30vw",
                    height: "11.23vw",
                  }}
                  className="description-placeholder"
                />
              </label>
            </div>
            <div
              style={{
                marginTop: "1.05vw",
                height: "15vw",
                width: "33.2vw",
                border: "1px solid white",
              }}
            >
              <label>
                <textarea
                  type="text"
                  name="links"
                  placeholder="Add Links:"
                  onFocus={(e) => e.target.select()}
                  onClick={(e) => e.target.select()}
                  onChange={handleChange}
                  style={{
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "1.5vw",
                    backgroundColor: "#232323",
                    border: "none", // Example to remove border
                    outline: "none", // Example to remove outline
                    padding: "10px", // Adjust padding as needed
                    resize: "none", // Prevent textarea from being resized
                    width: "30vw",
                  }}
                  className="description-placeholder"
                />
              </label>
            </div>
          </div>
          <div className="col3 flex flex-col" style={{ height: "50vw" }}>
            <div className="rating"></div>
            <div
              style={{
                marginTop: "1.05vw",
                height: "25.4vw",
                width: "20vw",
                border: "1px solid white",
                padding: "10px",
                paddingLeft:"2rem"
              }}
            >
              <ReactStars
              count={5}
              onChange={ratingChanged}
              value={formData.rating}
              size={60}
              activeColor="#ffd700"
              style={{ marginBottom: "10px", padding:"10px"}}
              />
              <div className="comment" style={{
                marginTop: "1.05vw",
                height: "12.4vw",
                width: "15vw",
                border: "1px solid white",
                padding: "10px",
                paddingLeft: "2rem",
                backgroundColor:"none"
              }}>
                <label >
                
                  <textarea name="comments" onChange={handleChange}
                    placeholder="Comment"
                    style={{
                      color: "#fff",
                      fontWeight: "700",
                      fontSize: "1.5vw",
                      backgroundColor: "#232323",
                      border: "none", // Example to remove border
                      outline: "none", // Example to remove outline
                      padding: "10px", // Adjust padding as needed
                      resize: "none", // Prevent textarea from being resized
                      width: "10vw",
                    }}
                    className="comment-placeholder" />
              </label>
              </div>
              <div className="flex justify-center items-center mt-3 mr-5">

            <button type="submit">Create Project</button>
          </div>
            </div>
          
          </div>
          
        </div>
      </form>
    </div>
  );
};

export default CreateProject;

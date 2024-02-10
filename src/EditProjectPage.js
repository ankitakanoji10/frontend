import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "./NavBar";
const EditProjectPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    links: "",
    techstacks: "",
    comments: [],
  });
  const params = useParams();
  const [video, setVideo] = useState(null);
  const navigate = useNavigate();
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "comments") {
      const updatedComments = [...formData.comments];
      updatedComments[index] = value;
      setFormData({
        ...formData,
        comments: updatedComments,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  // };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `https://unisync-api.onrender.com/project/${params.pid}`
      );
      const data = response.data;

      if (data.success) {
        const { project } = data;
        console.log(project);
        setFormData({
          name: project.name || "",
          description: project.description || "",
          comments: project.comments || [],
          rating: project.rating || "",
        });
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error fetching course information");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteComment = (index) => {
    const updatedComments = [...formData.comments];
    updatedComments.splice(index, 1);
    setFormData({
      ...formData,
      comments: updatedComments,
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
      const response = await axios.put(
        `https://unisync-api.onrender.com/project/${params.pid}/edit-project`,
        formDataObj,
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      if (data.success) {
        console.log(data);
        // Handle success, redirect, or update state as needed
        const projectId = data.project._id;
        const videoFormData = new FormData();
        videoFormData.append("video", video);

        const videoResponse = await axios.put(
          `https://unisync-api.onrender.com/project/${projectId}/add-video`,
          videoFormData,
          {
            withCredentials: true,
          }
        );
        if (videoResponse.data.success) {
          const videoResult = videoResponse.data.videoUrl;
          console.log(videoResult);
          navigate(`/single-project/${projectId}`);
          // Handle success, redirect, or update state as needed
        } else {
          const videoError = await videoResponse.json();
          if (videoResponse.status === 404) {
            navigate(`/single-project/${projectId}`);
          }
          console.error(videoError);
          // Handle error
        }
      } else {
        console.error(data.message);
        navigate(`/single-project/${data.project._id}`);
        // Handle error
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network error
    }
  };

  return (
    <div
      className=" bg-[#232323] flex flex-col text-white p-8"
      style={{ paddingBottom: "0", minHeight: "100vh" }}
    >
       <NavBar></NavBar>
      {/* <h1>Edit Project</h1> */}
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
                  Add Project Videos{" "}
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
                </div>
                {video && <p>{video.path}</p>}

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
                <div
                  style={{
                    color: "#fff",
                    fontSize: "2vw",
                    fontWeight: "700",
                    marginBottom: "1vw",
                  }}
                >
                  Techstacks
                </div>
                <input
                  type="text"
                  name="techstacks"
                  value={formData.techstacks}
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
                />
              </label>
            </div>
          </div>
          <div className="col2 flex flex-col">
            <div style={{ height: "11.24vw" }}>
              <label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={true}
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
                <div
                  style={{
                    color: "#fff",
                    fontSize: "2vw",
                    fontWeight: "700",
                    marginBottom: "1vw",
                  }}
                >
                  Description
                </div>
                <textarea
                  name="description"
                  value={formData.description}
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
                <div
                  style={{
                    color: "#fff",
                    fontSize: "2vw",
                    fontWeight: "700",
                    marginBottom: "1vw",
                  }}
                >
                  Links
                </div>
                <input
                  type="text"
                  name="links"
                  value={formData.links}
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
                />
              </label>
            </div>
          </div>
          <div className="col3 flex flex-col" style={{ height: "50vw" }}  >
            {formData.comments.length > 0 && (
              <div>
              <div className="comment" style={{
              marginTop: "1.05vw",
              height: "12.4vw",
              width: "17vw",
              border: "1px solid white",
              padding: "10px",
              paddingLeft: "2rem",
              backgroundColor: "none",
              overflowY: "auto", maxHeight: "50vw" 
            }}>
            <label>
             <div
                  style={{
                    color: "#fff",
                    fontSize: "2vw",
                    fontWeight: "700",
                    marginBottom: "1vw",
                  }}
                >
                  Comments
                </div>
              {formData.comments.map((comment, index) => (
                <div key={index} style={{display:"flex", flexDirection:"row"}}>
                  <textarea
                    name="comments"
                    value={comment}
                    onChange={(e) => handleChange(e, index)}
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
                  />
                  <button
                    type="button"

                    onClick={() => handleDeleteComment(index)}
                    style={{
                      backgroundColor: "#fff", // Replace with the actual background color from your image
                      color: "#FF7575", // Replace with the actual text color from your image
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
                    Delete
                  </button>
                </div>
              ))}
                  </label>
              </div>
            </div>
            )}
            <button type="submit" style={{
                      backgroundColor: "#fff", // Replace with the actual background color from your image
                      color: "#8598FF", // Replace with the actual text color from your image
                      border: "none",
                      borderRadius: "10px", // Adjust as needed to match your image
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)", // Adjust the color and spread as needed
                      padding: "10px 20px", // Adjust as needed based on your image
                      fontSize: "16px", // Adjust as needed based on your image
              // Adjust if your button text is bold
                      justifyContent:"center",
                      cursor: "pointer",
                      outline: "none",
                      width: "83px", // Based on the width provided in your image
              height: "50px",
              marginLeft: "5rem",
              marginTop:"9rem"
                      
                    }}>Edit </button>
          </div>
          {/* <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={true}
            />
          </label>
          <br />
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          <br />

          <label>
            Links:
            <input
              type="text"
              name="links"
              value={formData.links}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Techstacks:
            <input
              type="text"
              name="techstacks"
              value={formData.techstacks}
              onChange={handleChange}
            />
          </label>
          <br />

          {formData.comments.length > 0 && (
            <label>
              Comments:
              {formData.comments.map((comment, index) => (
                <div key={index}>
                  <textarea
                    name="comments"
                    value={comment}
                    onChange={(e) => handleChange(e, index)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteComment(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </label>
          )}
          <br />
          <h1>Add Video to Project</h1>
          <div {...getRootPropsVideo()} style={dropzoneStyle}>
            <input {...getInputPropsVideo()} />
            <p>Drag 'n' drop a video file here, or click to select one</p>
          </div>
          {uploadedVideoUrl && (
            <p>Video uploaded successfully. Video URL: {uploadedVideoUrl}</p>
          )} */}

          {/* Add more input fields for other properties */}
          
        </div>
      </form>
    </div>
  );
};
const dropzoneStyle = {
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

export default EditProjectPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import disang_logo from "./Images/disang_logo.svg";
import search from "./Images/search.png";
import NavBar from "./NavBar";
const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/profile/search-user/${keyword}`
      );
      setUsers(response.data);
      setKeyword("");
    } catch (error) {
      setError("Error searching for users");
    }
  };
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/profile/all-user"
        );
        const data = response.data;

        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <div
      className="bg-[#232323] flex flex-col text-white p-8"
      style={{ minHeight: "100vh" }}
    >
      <div className="header flex" style={{ marginBottom: "3.3vw" }}>
        <img
          src={disang_logo}
          style={{ width: "4.2vw", height: "4.2vw", marginRight: "1.58vw" }}
        />
        <img src={disang_logo} style={{ width: "4.2vw", height: "4.2vw" }} />
        <NavBar></NavBar>
      </div>
      {/* <h1>All Users Page</h1> */}
      <div
        className="search-bar"
        style={{ display: "flex", alignItems: "center", marginLeft: "25rem" }}
      >
        <img
          src={search}
          style={{
            width: "1rem",
            marginBottom: "2rem",
          }}
        ></img>
        <input
          type="text"
          placeholder="Enter keyword to search users"
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
            marginBottom: "2rem",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            marginBottom: "2rem",
          }}
        >
          Search
        </button>
      </div>
      <div className="grid md:grid-cols-4 gap-3" >
        {users.length > 0 && 
      users.map((user) => (
        <div key={user._id} className="bg-[#1C1B1F] rounded-lg p-4"
          style={{ padding: "4rem", marginBottom: "1rem", alignItems: "center",width:"20rem" }}>
            <Link to={`/user/${user._id}`}>
              <img
                src={`http://localhost:8000/profile/${user._id}/get-photo`}
                alt="user"
                style={{
                  width: "10rem",
                  height: "12rem",
                  objectFit: "cover",
                  borderRadius: "10px",
                  alignItems:"center"
                }}
              />
              {user.name}
            </Link>
          </div>
        ))
      
          
        }
      </div>
    </div>
  );
};

export default AllUsersPage;

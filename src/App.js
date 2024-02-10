
import './App.css';
import { Routes, Route } from 'react-router-dom';
import CreateProject from './CreateProject';
import Login from './Login';



import AllUsersPage from './AllUsersPage';
import UserProfilePage from './UserProfilePage';
import ProfilePage from './ProfilePage';
import SingleCoursePage from './SingleCoursePage';
import CreateCoursePage from './CreateCoursePage';
import AllCoursesPage from './AllCoursesPage';
import EditCoursePage from './EditCoursePage';
import SingleProjectPage from './SingleProjectPage';
import EditProjectPage from './EditProjectPage';


function App() {
  return (
    <>
      <Routes>
        <Route path='/create-project' element={<CreateProject />}></Route> {/* for creating project*/}
        
        
        <Route path='/all-user' element={<AllUsersPage />}></Route> {/* all users page */}
        <Route path='/single-course/:cid' element={<SingleCoursePage />}></Route> {/* single course page */}
        <Route path='/single-project/:pid' element={<SingleProjectPage />}></Route> {/* single proj page */}
        <Route path='/edit-project/:pid' element={<EditProjectPage />}></Route>
        <Route path='/create-course' element={<CreateCoursePage />}></Route>
        <Route path='/all-courses' element={<AllCoursesPage />}></Route>
        <Route path='/edit-course/:cid' element={<EditCoursePage />}></Route>
        <Route path='/user/:id' element={<UserProfilePage />}></Route>  {/* to view other's profile */}
        <Route path='/profile-page' element={<ProfilePage />}></Route>  {/* khud ki profile */}
        
        
        <Route path = '/' element ={ <Login/>}></Route>
    </Routes>
    </>
  );
}

export default App;

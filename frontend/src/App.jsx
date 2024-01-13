import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing.jsx";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import ProfileForm from "./components/profile-forms/ProfileForm";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
import NotFound from "./components/layout/NotFound";
import PrivateRoute from "./components/routing/PrivateRoute.jsx";
import "./App.css";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

// Redux
import { Provider } from "react-redux";
import store from "./store";
import { CLEAR_PROFILE, LOGOUT } from "./actions/types";

function App() {
  useEffect(() => {
    // check for token in LS
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());

    // log user out from all tabs if they log out in one tab
    window.addEventListener("storage", () => {
      if (!localStorage.token) {
        store.dispatch({ type: LOGOUT });
        store.dispatch({ type: CLEAR_PROFILE });
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <section className="container">
            <Alert />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/" element={<PrivateRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="create-profile" element={<ProfileForm />} />
                <Route path="edit-profile" element={<ProfileForm />} />
                <Route path="add-experience" element={<AddExperience />} />
                <Route path="add-education" element={<AddEducation />} />
                <Route path="posts" element={<Posts />} />
                <Route path="posts/:id" element={<Post />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;

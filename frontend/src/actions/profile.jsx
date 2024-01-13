import axios from 'axios';
import { setAlert } from './alert';
import { ACCOUNT_DELETED, CLEAR_PROFILE, GET_PROFILE, GET_PROFILES,GET_REPOS, NO_REPOS, PROFILE_ERROR, RESET_LOADING, UPDATE_PROFILE } from './types';

// Get current users profile
export const getCurrentProfile = () => async dispatch => {
  dispatch({type:RESET_LOADING});
  try {
    const res = await axios.get(`${window.location.origin}/api/profile/me`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) { 
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({type:RESET_LOADING});
  try {
    const res = await axios.get(`${window.location.origin}/api/profile`);

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

// Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`${window.location.origin}/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

// Get Github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`${window.location.origin}/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: NO_REPOS,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

// Create or update profile
export const createProfile = (
  formData,
  edit = false
) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post(`${window.location.origin}/api/profile`, formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
    
  } catch (error) {  
    dispatch(setAlert(error.message, 'danger'))

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

// Add Experience
export const addExperience = (formData) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`${window.location.origin}/api/profile/experience`, formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Added', 'success'));

  } catch (error) {
    dispatch(setAlert(error.message, 'danger'))

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response?.statusText, status: error.response?.status }
    });
  }
};

// Add Education
export const addEducation = (formData) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.put(`${window.location.origin}/api/profile/education`, formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Added', 'success'));

  } catch (err) {

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

// Delete experience
export const deleteExperience = id => async dispatch => {
  if(window.confirm('Are you sure want to delete?')){
    try {
      const res = await axios.delete(`${window.location.origin}/api/profile/experience/${id}`);
  
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
  
      dispatch(setAlert('Experience Removed', 'success'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }
};

// Delete education
export const deleteEducation = id => async dispatch => {
  if(window.confirm('Are you sure want to delete?')){
    try {
      const res = await axios.delete(`${window.location.origin}/api/profile/education/${id}`);
  
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
  
      dispatch(setAlert('Education Removed', 'success'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }
};

// Delete account & profile
export const deleteAccount = () => async dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete(`${window.location.origin}/api/profile`);
 
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert('Your account has been permanantly deleted'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response?.statusText, status: err.response?.status }
      });
    }
  }
};
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";

const PrivateRoute = ({ auth: { isAuthenticated, loading } }) => (
  loading ? (
    <Spinner />
  ) : isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  )
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);

import React from "react";
import "./scss/auth-header.scss";

const AuthHeader = () => {
  return (
    <div className="auth-header__container">
      <h1 className="auth-header">AFFORDABLE</h1>
      <div className="auth-header__logo" alt="Affordable Logo" />
    </div>
  );
};

export default AuthHeader;

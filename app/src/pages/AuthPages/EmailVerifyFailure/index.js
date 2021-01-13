import React from "react";

const EmailVerifyFailure = () => {
  return (
    <div className="row mt-5">
      <div className="col">
        <div className="row">
          <div className="col text-center">
            <h1>Oops - we've run into a problem verifying your email</h1>
          </div>
        </div>

        <div className="row mt-1">
          <div className="col text-center">
            <h4>Please contact the administrator for assistance!</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerifyFailure;

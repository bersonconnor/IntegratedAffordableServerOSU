import React from "react";

const ResetPasswordVerify = () => {
  return (
    <div className="row mt-5">
      <div className="col">
        <div className="row">
          <div className="col text-center">
            <h1>Your Password has successfully been changed!</h1>
          </div>
        </div>

        <div className="row mt-1">
          <div className="col text-center">
            <h4>Please <a href='/login'>click here</a> to login.</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordVerify;

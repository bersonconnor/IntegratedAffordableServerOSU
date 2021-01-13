import React from "react";

const EmailVerify = () => {
  return (
    <div className="row mt-5">
      <div className="col">
        <div className="row">
          <div className="col text-center">
            <h1>Your Email has been Verified!</h1>
            <h1>Thank you for registering to AFFORDABLE!</h1>
          </div>
        </div>

        <div className="row mt-1">
          <div className="col text-center">
            <h4>Please <a href='/login'>click here</a> to continue filling out the registration!</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;

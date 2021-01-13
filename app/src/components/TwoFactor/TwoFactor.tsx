import React from 'react'

interface AddTwoFactorProps {
    handleTwoFactorCodeValidation: (event: any) => void;
    imageURL: string
}

export const AddTwoFactorComponent = (props: AddTwoFactorProps) => {
            return(
            <div>
            <div className="row justify-content-end">
              <div className="col-7">
                <ol type="1">
                  <li>Download the &quot;Google Authenticator&quot; app</li>
                  <li>Use your camera to scan the QR code below</li>
                  <li>Enter your deivce name</li>
                  <li>Input the 6-digit code shown on your mobile device</li>
                </ol>
              </div>
            </div>

            <div>
              <div className="text-center">
                <input
                  placeholder="Enter Device Name"
                  type="text"
                  id="add-device-input"
                  className="App-login-input"
                />
              </div>
            </div>

            <div>
              <div className="text-center">
                <input
                  placeholder="Enter Code"
                  type="text"
                  id="token"
                  className="App-login-input"
                />
              </div>
            </div>

            <div>
              <div className="text-center">
                <button
                  onClick={props.handleTwoFactorCodeValidation}
                  id="authenticate"
                  className="App-login-button2"
                >
                  Authenticate
                </button>
              </div>
            </div>

            <br />

            <div>
              <div className="text-center">
                <img
                  className="App-border2"
                  src={props.imageURL}
                  alt="Wait for the QR to get generated!"
                />
              </div>
            </div>
        </div>
    );
}

interface ValidateTwoFactorProps {
    handleValidateTwoFactor: (event: any) => void;
    buttonText: string;
}

export const ValidateTwoFactorComponent = (props: ValidateTwoFactorProps) => {
    return(
        <div>
            <div className="text-center">
            <input
            placeholder="Enter Code"
            type="text"
            id="token"
            className="App-login-input"
            />
        </div>
        <div className="text-center">
            <button
            onClick={props.handleValidateTwoFactor}
            id="authenticate"
            className="App-login-button2"
            >
            {props.buttonText}
            </button>
        </div>
        </div>
    )
}
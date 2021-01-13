import React from "react";
import "./scss/congratulations.scss";

class Selection extends React.Component {
  render() {
    return (
      <div className="col">
        <br />
        <div className="row">
          <div className="col text-center">
            <h1 className="afford">AFFORDABLE</h1>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <img
              className="image"
              src="/static/media/logo.ce709d6c.png"
              alt="logo"
            />
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <br />
            <h2>CONGRATULATIONS!</h2>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <br />
            <h3>You have successfully submitted your applications</h3>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col text-left">
            <h3>Remember:</h3>
            <ul>
              <li>
                Check on your applications from the &quot;Manager&quot; tab.
              </li>
              <li>
                Messages from charities can be accessed via the
                &quot;Message&quot; tab.
              </li>
              <li>
                You can search for other sources of aid from the
                &quot;Search&quot; tab.
              </li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <h3>share your experience</h3>
          </div>
        </div>
        <div className="row">
          <div className="col text-right">
            <a
              href="https://facebook.com/"
              target="_blank"
              className="col fa fa-facebook"
            ></a>
          </div>
          <div className="col text-left">
            <a
              href="https://twitter.com/"
              target="_blank"
              className="col fa fa-twitter"
            ></a>
          </div>
        </div>
      </div>
    );
  }
}
export default Selection;

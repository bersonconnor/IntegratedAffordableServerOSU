import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import Geocode from "react-geocode";

const K_WIDTH = 20;
const K_HEIGHT = 20;
const greatPlaceStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: "absolute",
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  border: "5px solid #f44336",
  borderRadius: K_HEIGHT,
  backgroundColor: "white",
  textAlign: "center",
  color: "#3f51b5",
  fontSize: 16,
  fontWeight: "bold",
  padding: 4
};

const AnyReactComponentStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: "absolute",
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  border: "5px solid #f44336",
  borderRadius: K_HEIGHT,
  backgroundColor: "white",
  textAlign: "center",
  color: "#3f51b5",
  fontSize: 10,
  fontWeight: "bold"
};

class MyGreatPlace extends Component {
  render() {
    return <div style={greatPlaceStyle}>{this.props.text}</div>;
  }
}

const AnyReactComponent = ({ text }) => (
  <div style={AnyReactComponentStyle}>
    <div>{text}</div>
  </div>
);

class SimpleMap extends Component {
  static defaultProps = {
    zoom: 15,
    center: {
      lat: 39.9977,
      lng: -83.0086
    },
    markers: {
      lat: [
        39.9977,
        39.9977,
        39.9977,
        39.9977,
        39.9977,
        39.9977,
        39.9977,
        39.9977,
        39.9977,
        39.9977
      ],
      lng: [
        -83.0086,
        -83.0086,
        -83.0086,
        -83.0086,
        -83.0086,
        -83.0086,
        -83.0086,
        -83.0086,
        -83.0086,
        -83.0086
      ]
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      },
      markers: {
        lat: this.props.markers.lat,
        lng: this.props.markers.lng
      }
    };

    Geocode.setApiKey("AIzaSyC5rmDNjHf75H8VRD5utCPpD-aMpUVYzfM");
    this.updateLocation();
  }

  componentDidUpdate(prevProps) {
    if (this.props.addresses !== undefined) {
      if (
        prevProps.addresses === undefined ||
        prevProps.addresses[0] !== this.props.addresses[0]
      ) {
        this.updateLocation();
      }
    }
  }

  updateLocation() {
    if (this.props.addresses !== undefined && this.props.addresses.length > 0) {
      Geocode.fromAddress(
        `${this.props.addresses[0].mailingAddress.streetAddress1} ${
          this.props.addresses[0].mailingAddress.streetAddress2
            ? this.props.addresses[0].mailingAddress.streetAddress2
            : ""
        } ${this.props.addresses[0].mailingAddress.city}, ${
          this.props.addresses[0].mailingAddress.stateOrProvince
        } ${this.props.addresses[0].mailingAddress.postalCode}`
      ).then(
        response => {
          this.setState({
            center: {
              lat: response.results[0].geometry.location.lat,
              lng: response.results[0].geometry.location.lng
            }
          });
        },
        error => {
          console.error("error:" + error);
        }
      );
      for (let i = 0; i < this.props.addresses.length; i++) {
        Geocode.fromAddress(
          `${this.props.addresses[i].mailingAddress.streetAddress1} ${
            this.props.addresses[i].mailingAddress.streetAddress2
              ? this.props.addresses[i].mailingAddress.streetAddress2
              : ""
          } ${this.props.addresses[i].mailingAddress.city}, ${
            this.props.addresses[i].mailingAddress.stateOrProvince
          } ${this.props.addresses[i].mailingAddress.postalCode}`
        ).then(
          response => {
            /*make a copy of lat and lng to change them*/
            const newArray = this.state.markers.lat.slice();
            newArray[i] = response.results[0].geometry.location.lat;
            const newArray2 = this.state.markers.lng.slice();
            newArray2[i] = response.results[0].geometry.location.lng;
            console.log(i);
            this.setState({
              markers: {
                lat: newArray,
                lng: newArray2
              }
            });
          },
          error => {
            console.error("error:" + error);
          }
        );
      }
    } else {
      this.setState({
        markers: {
          lat: [
            39.9977,
            39.9977,
            39.9977,
            39.9977,
            39.9977,
            39.9977,
            39.9977,
            39.9977,
            39.9977,
            39.9977
          ],
          lng: [
            -83.0086,
            -83.0086,
            -83.0086,
            -83.0086,
            -83.0086,
            -83.0086,
            -83.0086,
            -83.0086,
            -83.0086,
            -83.0086
          ]
        },
        center: {
          lat: 39.9977,
          lng: -83.0086
        }
      });
    }
  }

  render() {
    return (
      <div className="col">
        <script
          src="https://maps.googleapis.com/maps/api/js"
          type="text/javascript"
        ></script>
        <div id="map">
          <div
            className="mr-0"
            style={{
              height: "50vh",
              width: "100%"
            }}
          >
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyC5rmDNjHf75H8VRD5utCPpD-aMpUVYzfM"
              }}
              center={this.state.center}
              defaultZoom={this.props.zoom}
            >
              <MyGreatPlace
                lat={this.state.center.lat}
                lng={this.state.center.lng}
                text={""}
              />
              <AnyReactComponent
                lat={this.state.markers.lat[9]}
                lng={this.state.markers.lng[9]}
                text={"10"}
              />
              <AnyReactComponent
                lat={this.state.markers.lat[8]}
                lng={this.state.markers.lng[8]}
                text={"9"}
              />
              <AnyReactComponent
                lat={this.state.markers.lat[7]}
                lng={this.state.markers.lng[7]}
                text={"8"}
              />
              <AnyReactComponent
                lat={this.state.markers.lat[6]}
                lng={this.state.markers.lng[6]}
                text={"7"}
              />
              <AnyReactComponent
                lat={this.state.markers.lat[5]}
                lng={this.state.markers.lng[5]}
                text={"6"}
              />
              <AnyReactComponent
                lat={this.state.markers.lat[4]}
                lng={this.state.markers.lng[4]}
                text={"5"}
              />
              <AnyReactComponent
                lat={this.state.markers.lat[3]}
                lng={this.state.markers.lng[3]}
                text={"4"}
              />
              <AnyReactComponent
                lat={this.state.markers.lat[2]}
                lng={this.state.markers.lng[2]}
                text={"3"}
              />
              <AnyReactComponent
                lat={this.state.markers.lat[1]}
                lng={this.state.markers.lng[1]}
                text={"2"}
              />
              <AnyReactComponent
                lat={this.state.markers.lat[0]}
                lng={this.state.markers.lng[0]}
                text={"1"}
              />
            </GoogleMapReact>
          </div>
        </div>
      </div>
    );
  }
}

export default SimpleMap;

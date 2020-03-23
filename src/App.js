import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav } from "react-bootstrap";
import mapboxgl from 'mapbox-gl';
var https = require("https");
const parse = require("csv-parse");
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibHV2aXNhY2NoYXJpbmUiLCJhIjoiY2s4NHg2MTlyMDEzbjNmcXY4bWN4dHQ5diJ9._w5I5CMTFoThTpgWWAqtHA';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
let data;

let countryList = [
  "Anguilla",
  "Antigua and Barbuda",
  "Aruba",
  "The Bahamas",
  "Barbados",
  "British Virgin Islands",
  "Cayman Islands",
  "Cuba",
  "Dominica",
  "Dominican Republic",
  "Grenada",
  "Guadeloupe",
  "Haiti",
  "Jamaica",
  "Martinique",
  "Montserrat",
  "Netherlands Antilles",
  "Puerto Rico",
  "Saint Barthelemy",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "St Martin",
  "Saint Vincent and the Grenadines",
  "Trinidad and Tobago",
  "Turks & Caicos Islands",
  "US Virgin Islands",
  "Venezuela",
  "Guyana",
  "Belize",
  "French Guiana",
  "Suriname",
  "Panama"
];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "",
      total: "",
      lng: -61,
      lat: 15,
      zoom: 4
    };
  }

  getCOVIDInfo(url, callback) {
    var body = "";
    https
      .get(url, function(res) {
        res.on("data", function(chunk) {
          body += chunk;
        });

        res.on("end", data => {
          callback(body);
        });
      })
      .on("error", function(e) {
        console.log("Got an error: ", e);
      });
  }

  isCaribbeanCountry(arr) {
    return countryList.includes(arr[1]) || countryList.includes(arr[0]);
  }

  sum(total, array) {
    return total + parseInt(array[array.length - 1]);
  }

  componentDidMount() {

  

    //setInterval(() => {
    this.getCOVIDInfo(url, body => {
      console.log("hi");
      data = body;
      parse(
        body,
        {
          comment: "#"
        },
        (err, output) => {
          const arr = output;
          let size = arr[0].length; //latest entry
          console.log(arr[0][size - 1]); //date of latest entry
          let outputString = "";

          let caribbeanData = arr.filter(this.isCaribbeanCountry);
          for (let country in caribbeanData) {
            outputString +=
              caribbeanData[country][0] === ""
                ? caribbeanData[country][1]
                : caribbeanData[country][0];
            outputString +=
              " " +
              caribbeanData[country][caribbeanData[country].length - 1] +
              "   ";
          }

          this.setState({ output: outputString });
          this.setState({ total: caribbeanData.reduce(this.sum, 0) });
        }
      );
    });
    //}, 10000);

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/luvisaccharine/ck84wx1570bzg1iqfbqelhs3o',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
      });

    map.on('move', () => {
      this.setState({
      lng: map.getCenter().lng.toFixed(4),
      lat: map.getCenter().lat.toFixed(4),
      zoom: map.getZoom().toFixed(2)
      });
      });
  }

  render() {
    return (
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top" >
          <Navbar.Brand href="#home">Caribbean COVID Map BETA</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>
          <Nav className="justify-content-end" activeKey="/home">
            <Nav.Item>
              <Nav.Link href="/home">Home</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
        <div ref={el => this.mapContainer = el} className="mapContainer"/>
      </div>
    );
  }
}
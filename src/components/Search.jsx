import React from 'react';
import map from '../images/map.png';
import restaurantData from '../data/restaurants.json';
// import locationData from '../data/location.json';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Weather from './Weather';
const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      locationSearch: '',
      restaurantData: restaurantData,
      locationData: {},
      weatherData: [],
      error: null,
    }
  }

  // one place to change and update code, not 2
  handleError = (e) => {
    if (e) {
      console.log('Error occurred while requesting');
      this.setState({ error: e });
    } else {
      this.setState({ error: null });
    }
  }


  // just send a request and return the response
  handleRequest = async (url, method) => {
    let request = {
      method: method,
      url: url,
    }
    let response = await axios(request);
    return response.data;
  }

  // give me object and I'll set to state!
  handleState = (newState) => {
    Object.keys(newState).forEach(key => {
      this.setState({ [key]: newState[key] });
    })
  }

  // this should query location IQ for geolocation data
  handleLocationSearch = async (e) => {
    e.preventDefault();
    let request = {
      method: 'GET',
      url: `https://us1.locationiq.com/v1/search?key=${ACCESS_KEY}&q=${e.target.search.value}&format=json`
    }

    // make our location IQ request;
    try {
      let response = await axios(request);
      console.log('this is our response', response.data[0]);
      // we never get to this line of code if we get an error;
      this.setState({
        locationSearch: e.target.search.value,
        locationData: response.data[0],
      }, () => this.handleWeatherSearch());
      // really handy for examining and capturing errors.
    } catch (err) {
      // console.log('Error occurred while requesting');
      // this.setState({ error: err.response.data });
      console.log(err);
      this.handleError(err.response.data);
    }
  }

  // here for reference, but not used
  oldHandleWeatherSearch = async () => {
    let request = {
      method: 'GET',
      url: `http://localhost:3001/weather?lat=${this.state.locationData.lat}&lon=${this.state.locationData.lon}`
    }
    try {
      let response = await axios(request);

      this.setState({
        weatherData: response.data,
      });
    } catch (err) {
      // console.log('Error occurred while requesting');
      // this.setState({ error: err.response.data });
      this.handleError(err.response.data);
    }
  }

  handleWeatherSearch = async () => {
    try {
      let data = await this.handleRequest(`http://localhost:3001/weather?lat=${this.state.locationData.lat}&lon=${this.state.locationData.lon}`, 'GET');
      this.handleState({ weatherData: data });
    } catch (e) {
      this.handleError(e);
    }
  }; 

  render() {
    console.log(this.state);
    return (
      <div id="city-search">
        <form onSubmit={this.handleLocationSearch}>
          <label>Search for a location</label>
          <input type="text" name="search" placeholder="Enter City here"/>
          <button type="submit">Explore!</button>
        </form>
        {this.state.error
          ? <Alert>
              {JSON.stringify(this.state.error)}
              <Button onClick={() => this.handleError()}>Thanks go away</Button>
            </Alert>
          : null
        }
        {this.state.locationData 
          ? <p>{this.state.locationData.display_name}</p>
          : <p>Please search for a city!</p>
        }
        {this.state.weatherData.length
          ? <>
              {this.state.weatherData.map( day => <Weather date={day.date} description={day.description}/>) }
            </>
          : null
        }
        {this.state.locationSearch && this.state.locationData
          ? <div id="map"><img src={map} alt="location map"/></div>
          : null
        }
        {this.state.locationSearch && this.state.restaurantData
          ? <ul>{this.state.restaurantData.map(place => <li>{place.restaurant}</li>)}</ul>
          : null
        }
      </div>
    )
  }
}

export default Search;

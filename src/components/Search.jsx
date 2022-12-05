import React from 'react';
import map from '../images/map.png';
import restaurantData from '../data/restaurants.json';
import locationData from '../data/location.json';
import axios from 'axios';
const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      locationSearch: '',
      restaurantData: restaurantData,
      locationData: locationData
    }
  }

  // this should query location IQ for geolocation data
  handleLocationSearch = async (e) => {
    e.preventDefault();
    let request = {
      method: 'GET',
      url: `https://us1.locationiq.com/v1/search?key=${ACCESS_KEY}&q=${e.target.search.value}&format=json`
    }

    // make our location IQ request;
    let response = await axios(request);
    this.setState({
      locationSearch: e.target.search.value,
      locationData: response.data[0],
    });
  }

  render() {
    return (
      <div id="city-search">
        <form onSubmit={this.handleLocationSearch}>
          <label>Search for a location</label>
          <input type="text" name="search" placeholder="Enter City here"/>
          <button type="submit">Explore!</button>
        </form>
        {this.state.locationData 
          ? <p>{this.state.locationData.display_name}</p>
          : <p>Please search for a city!</p>
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

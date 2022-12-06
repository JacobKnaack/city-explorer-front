import React from 'react';
import map from '../images/map.png';
import restaurantData from '../data/restaurants.json';
import locationData from '../data/location.json';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      locationSearch: '',
      restaurantData: restaurantData,
      locationData: locationData,
      error: null,
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
    try {
      let response = await axios(request);

      // we never get to this line of code if we get an error;
      this.setState({
        locationSearch: e.target.search.value,
        locationData: response.data[0],
      }, () => this.handlePokemonSearch('pikachu'));
      // really handy for examining and capturing errors.
    } catch (err) {
      console.log('Error occurred while requesting');
      this.setState({ error: err.response.data });
    }
  }

  handlePokemonSearch = async (pokemonName) => {
    let request = {
      method: 'GET',
      url: `http://localhost:3001/pokemon?name=${pokemonName}`
    }
    try {
      let response = await axios(request);

      this.setState({
        pokemonData: response.data,
      });
    } catch (err) {
      console.log('Error occurred while requesting');
      this.setState({ error: err.response.data });
    }

  };

  handleError = () => {
    this.setState({ error: null });
  } 

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
              <Button onClick={this.handleError}>Thanks go away</Button>
            </Alert>
          : null
        }
        {this.state.locationData 
          ? <p>{this.state.locationData.display_name}</p>
          : <p>Please search for a city!</p>
        }
        {this.state.pokemonData
          ? <div>
              <p>Name: {this.state.pokemonData.name}</p>
              <p>type: {this.state.pokemonData.type}</p>
            </div>
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

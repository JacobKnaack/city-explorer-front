import React from 'react';
import axios from 'axios';

class City extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
    }
  }

  fetchCity = async () => {
    let request = {
      method: 'GET',
      url: 'https://us1.locationiq.com/v1/search?key=YOUR_ACCESS_TOKEN&q=SEARCH_STRING&format=json',
    }

    // this will happen asynchronously?
    let response = await axios(request); // makes our HTTP request and returns our response.
    console.log(response); //
    this.setState({
      data: response.data.results
    });
  }

  render() {
    return (
      <div>
        <h2>City</h2>
        <ul>
          {this.state.data.length
            ? <>{this.state.data.map(city => <li key={city.name}>{city.name}</li>)}</>
            : <p>No City to display</p>
          }
        </ul>
        <button onClick={this.fetchCity}>Fetch City!</button>
      </div>
    )
  }
}

export default City;


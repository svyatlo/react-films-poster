import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Cards from './cards.jsx';

class RenderFilms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filmsCollection: [],
      offset: 0
    };

    this.makeRequest = this.makeRequest.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  makeRequest() {
    const url = 'http://react-cdp-api.herokuapp.com/movies/';
    const limit = 12;
    const { offset } = this.state;

    fetch(`${url}?offset=${offset}&limit=${limit}`)
    .then(response => response.json())  
    .then(result => {
      result.data.forEach(filmInfo => this.state.filmsCollection.push(filmInfo));
      this.setState({offset: this.state.offset + limit});
      console.log(this.state);
    }).catch(function(error) {
      console.log('Request failed', error);  
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    // this.setState({filmsCollection: [], offset: 0}, () => {this.makeRequest()});
    // console.log('filmsCollection', this.state.filmsCollection);
    // console.log('offset', this.state.offset);
    this.makeRequest();
  }

  render() {
    return (
      <div className='content'>
        <form onSubmit={this.handleSubmit}>
          <input id='findThis' type='text' name='findThis' />
          <input type='submit' value='Search' />
        </form>
        <ul className='cards-list'><Cards filmsCollection={this.state.filmsCollection} /></ul>
      </div>
    )
  }
}

ReactDOM.render(
  <RenderFilms />,
  document.getElementById('root')
);
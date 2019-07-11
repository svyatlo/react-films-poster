import React, {Component} from 'react';

class Cards extends Component {
  constructor(props) {
    super(props);
    this.getTimeInHours = this.getTimeInHours.bind(this);
    this.calcItemHeight = this.calcItemHeight.bind(this);
    this.setInitialHeight = this.setInitialHeight.bind(this);
  }

  getTimeInHours(timeInMin) {
    if (!timeInMin) {
      return '--';
    }
    return (Math.floor(timeInMin / 60) || 0) + 'h ' + timeInMin % 60 + 'min ';
  }

  setInitialHeight() {
    const form = document.querySelector('form');
    
    if (form) {
      return window.innerHeight - form.offsetHeight - 100;
    }
  }

  calcItemHeight() {
    const form = document.querySelector('form');
    const cardItem = document.querySelectorAll('.content__item');
    const calcHeight = window.innerHeight - form.offsetHeight - 100;

    if (form && cardItem) {
      cardItem.forEach(item => item.style.height = `${calcHeight}px`);
    }
  }

  componentDidMount() { 
    window.addEventListener('resize', this.calcItemHeight); 
  }

  render() {
    return this.props.filmsCollection.map(filmInfo => 
      <li className='content__item' style={{ height: this.setInitialHeight() }} key={filmInfo.id}>
        <img src={filmInfo.poster_path} />
        <div className='item-description'>
          <div className='item-title'><h2>{filmInfo.title}</h2><p>{filmInfo.tagline}</p></div>
          <div className='item-info'><h3>Genre: </h3><p>{filmInfo.genres.join(', ')}</p></div>
          <div className='item-info'><h3>Time: </h3><p>{this.getTimeInHours(filmInfo.runtime)}</p></div>
          <div className='item-info'><h3>Rating: </h3><p>{filmInfo.vote_average} (Votes: {filmInfo.vote_count})</p></div>
          <div className='item-info'><h3>Description: </h3><p>{filmInfo.overview}</p></div>
          <img src="https://www.clipartmax.com/png/middle/53-531770_gray-arrow-down-icon.png" alt="arrow"></img>
        </div>
      </li>
    );
  }
}

export default Cards;
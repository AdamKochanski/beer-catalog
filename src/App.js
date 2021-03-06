import React, { Component } from 'react';
import './App.css';
import bglImg from'./bgl.png';
import axios from 'axios';
import Modal from 'react-modal';
import Visit from 'react-visit';
import ProgressiveImage from "react-progressive-image-loading";

// api endpoint
const beersApi = resources => 
  `https://api.punkapi.com/v2/beers${resources}`

// pagination
let page = 1;

// modal configuration
const customStyles = {
  overlay : {
    backgroundColor  : 'rgba(0, 0, 0, 0.75)'
  },
  content : {
    top              : '50%',
    left             : '50%',
    right            : 'auto',
    bottom           : 'auto',
    padding          : '30px',
    marginRight      : '-50%',
    transform        : 'translate(-50%, -50%)',
  }
};

// pagination iginte container
const visitStyle = {
  position: 'absolute',
  visibility: 'hidden',
  width: '100%',
  marginTop: '-10rem',
  height: '10rem'
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      beers: [],
      beerMods: [],
      beerModsMini:[],
      beersEndList: false,
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    // for tests in App.test.js
    if (process.env.NODE_ENV === 'test') return

    // initial modal
    let initModal = window.location.pathname.split( '/' )[2];
    initModal && this.openModal(initModal);

    axios.get(beersApi('?page=1&per_page=20'))
      .then(res => {
        const beers = res.data;
        // console.log('all beers:', beers);
        this.setState({ beers });
      })
  }

  openModal(idx, e) {
    this.setState({modalIsOpen: true});
    
    axios.get(beersApi('/'+idx))
      .then(res => {
        const beerMods = res.data;
        // console.log('beerMods lookup:', beerMods);
        this.setState({ beerMods });
      })

    //set history state
    window.history.pushState({}, null, '/details/'+idx);
  }

  afterOpenModal(idx) {
    // references are now sync'd and can be accessed.
      this.subtitle.style.display = 'none';
    // @TODO dynamic search 
    axios.get(beersApi('?ibu_gt=40&ibu_lt=45&per_page=3'))
      .then(res => {
        const beerModsMini = res.data;
        //console.log('IBU ABV EBC lookup:', beerModsMini);
        this.setState({ beerModsMini });
      })
  }

  closeModal() {
    this.setState({modalIsOpen: false});

    //set history state
    window.history.pushState({}, null, '/');
  }

  handleVisit () {
    // console.log('next page.')
    page++; // add next page
    axios.get(beersApi('?page='+page+'&per_page=20'))
      .then(res => {
        const beersNext = res.data;
        // console.log('all beers:', beersNext);
        this.setState({ beers: this.state.beers.concat(beersNext) });
        // when all beers showed
        beersNext.length === 0 && this.setState({ beersEndList: true });;
      })
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <h1>
            <span className="title-pre">BEER</span>
            <span className="title-post">GURU</span>
          </h1>
        </header>
        <main className="wrapper">
          {this.state.beers.map(beer =>
            <article key={beer.id} id={beer.id} className="card" onClick={this.openModal.bind(this, beer.id)}>
                { /*<img src={beer.image_url} alt={beer.name}/> //img without progressive rendering*/} 
                <ProgressiveImage
                    preview={bglImg}
                    src={beer.image_url}
                    render={(src, style) => <img src={src} style={style} alt={beer.name}/>}
                />
                <h3 className="beer-name">{beer.name}</h3>
                <p className="beer-tagline">{beer.tagline}</p>
            </article>
          )}
        </main>
        <div className="end-list">{ this.state.beersEndList ? 'This is THE END :)' : 'Loading...' }</div>
        <Visit visitStyle={visitStyle} onVisit={ () => this.handleVisit() } />
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="BeerModal">

          <div ref={subtitle => this.subtitle = subtitle}>Loading...</div>

          {this.state.beerMods.map(beerMod =>
            <div key={beerMod.id} className="modal">
              <button onClick={this.closeModal}>X</button>
              <ProgressiveImage
                preview={bglImg}
                src={beerMod.image_url}
                render={(src, style) => <img src={src} style={style} alt={beerMod.name}/>}
              />
              <div className="details">
                <p className="name">{beerMod.name}</p>
                <p className="tagline">{beerMod.tagline}</p>
                <span className="underline"></span>
                <div className="ranks">
                  <span>IBU: </span> {beerMod.ibu}
                  <span>ABV: </span> {beerMod.abv}
                  <span>EBC: </span> {beerMod.ebc}
                </div>
                <p>{beerMod.description}</p>
                <p>{beerMod.brewers_tips}</p>
              </div>
            </div>
          )}

          <div className="additional">You might also like:</div>

          <div className="miniPrev">
          {this.state.beerModsMini.map(beerModM =>
            <div key={beerModM.id} >
              <img src={beerModM.image_url} alt={beerModM.name}/>
              <p>{beerModM.name}</p>
            </div>
          )}
          </div>
          
          {/*  End of Modal */}
        </Modal>  
      </div>
    );
  }
}

export default App;

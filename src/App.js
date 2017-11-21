import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Infinite from 'react-infinite';
import Modal from 'react-modal';



const beersApi = resources => 
  `https://api.punkapi.com/v2/beers${resources}`


//modal configuration
const customStyles = {
  overlay : {
    backgroundColor  : 'rgba(0, 0, 0, 0.75)'
  },
  content : {
    top              : '50%',
    left             : '50%',
    right            : 'auto',
    bottom           : 'auto',
    marginRight      : '-50%',
    transform        : 'translate(-50%, -50%)'
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      beers: [],
      beerMods: [],
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    axios.get(beersApi('?page=1&per_page=20'))
      .then(res => {
        const beers = res.data;
        console.log(beers);
        this.setState({ beers });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  openModal(idx, e) {
    this.setState({modalIsOpen: true});
    
    axios.get(beersApi('/'+idx))
      .then(res => {
        const beerMods = res.data;
        console.log('beerMods lookup:', beerMods);
        this.setState({ beerMods });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
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
      {/*  */}
        
          <main className="wrapper">
            {this.state.beers.map(beer =>
              <article key={beer.id} id={beer.id} className="card" onClick={this.openModal.bind(this, beer.id)}>
                  <img src={beer.image_url} alt={beer.name}/>
                  <h3 className="beer-name">{beer.name}</h3>
                  <p className="beer-tagline">{beer.tagline}</p>
              </article>
            )}
          </main>
        <Infinite containerHeight={400} elementHeight={400} useWindowAsScrollContainer>
        </Infinite>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="BeerModal">

          {this.state.beerMods.map(beerMod =>
            <div key={beerMod.id} className="modal">
              <img src={beerMod.image_url} alt={beerMod.name}/>
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
            
          <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
          <button onClick={this.closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>  
      </div>
    );
  }
}

export default App;

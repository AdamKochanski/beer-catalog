import React from 'react';
import { configure } from 'enzyme';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http'
import nock from 'nock';

configure({adapter : new Adapter() })

const host = 'http://localhost';

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

// it('check api response', () => {
//   return axios.get('https://api.punkapi.com/v2/beers')
//         .then( res => console.log(res) )
// });

it('content duplication', () => {
	const component = shallow(<App name="app"/>);
	expect(component.find('header').length).toEqual(1);
	expect(component.find('main').length).toEqual(1);
});

it('branding', () => {
	const component = shallow(<App name="app"/>);
	const branding = "BEERGURU"
	const header = component.find('header');
	expect(header.text()).toEqual(branding);
});

it('loader', () => {
	const component = shallow(<App name="app"/>);
	const loader = component.find('.end-list');
	expect(loader.text()).toEqual("Loading...");
});

it('state contorl', () => {
	const component = shallow(<App name="app"/>);
	expect(component.state().modalIsOpen).toEqual(false);
	expect(component.state().beersEndList).toEqual(false);
});
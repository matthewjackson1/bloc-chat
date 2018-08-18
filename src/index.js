import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import myApp from './reducers';

let store = createStore(myApp);

function render() {
	ReactDOM.render(
		<Provider store={store}> 
			<App />
		</Provider>,
		document.getElementById('root')
		);
}

store.subscribe(render);
render();
registerServiceWorker();
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';

import { applyMiddleware, createStore } from "redux";
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './js/store/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

import {setStory} from "./js/store/router/actions";
import App from './App';

import '@vkontakte/vkui/dist/vkui.css';
import './css/style.css';
import { AdaptivityProvider } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge'; //test

export const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk),
));

bridge.send('VKWebAppInit', {}) //test

store.dispatch(setStory('home', 'home_tab')); //базовая страница

ReactDOM.render(
    <Provider store={store}>
        <AdaptivityProvider>
            <App/>
        </AdaptivityProvider>
    </Provider>,
    document.getElementById('root')
);

//import('./eruda.js').then(({ default: eruda }) => {})
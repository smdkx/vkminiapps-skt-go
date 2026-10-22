import React from 'react';
import {createRoot} from 'react-dom/client';

import {configureStore} from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from './js/store/reducers';

import {setStory} from "./js/store/router/actions";
import App from './App';

import '@vkontakte/vkui/dist/vkui.css';
import './css/style.css';

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            // The existing router keeps Alert elements in memory, outside VK Storage.
            ignoredPaths: ['router.popouts'],
            ignoredActionPaths: ['payload.popout', 'payload.router.popouts'],
        },
    }),
    devTools: import.meta.env.DEV,
});

store.dispatch(setStory('home', 'home_tab')); //базовая страница

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App/>
    </Provider>
);

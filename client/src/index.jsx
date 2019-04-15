import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {HashRouter} from 'react-router-dom';
import App from '@/app/app';
import axios from 'axios';

axios.defaults.withCredentials = true;

ReactDOM.render(
    <HashRouter>
        <App/>
    </HashRouter>,
    document.getElementById('root')
);
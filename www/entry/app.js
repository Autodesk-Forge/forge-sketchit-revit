import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from '../store/store';
import SketchIt from '../react/sketch_it';
import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import style from '../css/style.css';

document.addEventListener("DOMContentLoaded", (event) => {
  ReactDOM.render(
    <Provider store={store}>
      <SketchIt />
    </Provider>,
    document.getElementById('body-div')
  );
});

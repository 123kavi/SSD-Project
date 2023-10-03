import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { Provider } from 'react-redux'; // Import Provider from react-redux
import DataProvider from '../../client/src/components/redux/store'; // Import your Redux store
import App from './App'; // Your main application component
ReactDOM.render(
  <React.StrictMode>
    <DataProvider>
      <App />
    </DataProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
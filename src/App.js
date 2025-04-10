'use client'

import React from 'react';
import RouterControl from "./router/router"
import { Provider } from 'react-redux';
import {store, persistor} from './store';
import { PersistGate } from 'redux-persist/integration/react'
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

// Next.js adaptation note: This App component is replaced by layout.js and page.js in Next.js
// This file is kept for reference but its functionality is distributed between those files

function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <div className="App">
            <RouterControl/>
          </div>
        </PersistGate>
      </Provider>
    </MuiPickersUtilsProvider>
  );
}

export default App;

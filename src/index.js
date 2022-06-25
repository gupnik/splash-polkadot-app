import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { SplashContextProvider } from './store/SplashContext'

ReactDOM.render(
  <React.StrictMode>
    <SplashContextProvider>
      <App />
    </SplashContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

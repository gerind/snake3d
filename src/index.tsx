import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import { isMobileDevice } from './core/utils'
import NoMobile from './components/NoMobile'

const root = ReactDOM.createRoot(document.getElementById('root')!)

if (isMobileDevice()) root.render(<NoMobile />)
else root.render(<App />)

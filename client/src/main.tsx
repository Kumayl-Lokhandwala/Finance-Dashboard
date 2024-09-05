
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from './state/api.ts'
import { red } from '@mui/material/colors'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {  [api.reducerPath]: api.reducer },
  middleware:(getDefault) => getDefault().concat(api.middleware),
})

setupListeners(store.dispatch)

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)

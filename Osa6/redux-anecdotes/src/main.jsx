import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'

import { setAnecdotes } from './reducers/anecdoteReducer'
import anecdoteService from './services/anecdotes'



anecdoteService.getAll().then((anecdotes) => 
  store.dispatch(setAnecdotes(anecdotes))
)


store.subscribe(() => console.log(store.getState()))

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)

import ReactDOM from 'react-dom/client'
import App from './App'
import '../index.css'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from './contexts/NotificationContext'
import { UserContextProvider } from './contexts/UserContext'
import { BlogsContextProvider } from './contexts/BlogsContext'
import { BrowserRouter as Router } from 'react-router-dom'


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <BlogsContextProvider>
        <NotificationContextProvider>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </NotificationContextProvider>
      </BlogsContextProvider>
    </QueryClientProvider>
  </Router>
)

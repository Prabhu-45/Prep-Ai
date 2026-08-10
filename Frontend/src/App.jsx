import React from 'react'
import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"
import CustomCursor from './components/CustomCursor'

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <CustomCursor />
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App

import React from 'react'
import Register from './Register'
import { Navigate } from 'react-router-dom'

function Register_nav() {
  return (
    () => {
        Navigate("/register")
    }
  )
}

export default Register_nav
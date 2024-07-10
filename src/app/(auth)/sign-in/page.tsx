'use client'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'

const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage]= useState('')
  const [isCheckingUsername, setIsCheckingUsername]= useState(false)
  return (
    <div>page</div>
  )
}

export default page
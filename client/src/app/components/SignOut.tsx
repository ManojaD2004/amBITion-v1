"use client"
import React from 'react'
import { signOut } from "next-auth/react"


const SignOut = () => {
  return (
     <button onClick={() => signOut()} className='ml-[20px] cursor-pointer bg-white text-black text-sm py-[10px] px-[15px] rounded-[30px]'>Sign Out</button>
  )
}

export default SignOut
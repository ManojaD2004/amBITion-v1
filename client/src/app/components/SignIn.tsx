import React from 'react'
import {signIn,auth} from "../../../auth"

const SignIn = () => {
  return (
    <form
    action={async () => {
      "use server"
      await signIn("github")
    }}
  >
    <button type="submit" className=' bg-white text-black text-sm py-[10px] px-[15px] rounded-[30px]'>Signin with GitHub</button>
    </form>
  )
}

export default SignIn
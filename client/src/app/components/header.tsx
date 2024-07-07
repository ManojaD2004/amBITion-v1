import Image from 'next/image'
import React from 'react'
import {signIn,auth} from "../../../auth"
import SignIn from './SignIn';
import SignOut from './SignOut';
import Link from 'next/link';

export default async function Header() {
  const session = await auth();
  console.log(session);
  return (
    <div className='bg-black flex justify-between items-center h-20 p-4  fixed z-10 w-full px-[150px]'>
      <div className='flex gap-20 text-gray-300'>
      <Link href={'/'} className='font-bold '>
        <span className='text-[#3077c6] text-[20px]'>D</span>olphine
      </Link>
      <ul className="flex gap-6 list-none font-medium">
        <Link href={'/create-instance'}>Instance</Link>
        <Link href={'/create-github-instance'}>Github</Link>
        <Link href={'/loadbalancer'}>Architecture</Link>
      </ul>
      </div>
        <div className='flex gap-6 list-none text-white items-center'>
          
       {session?(<div className='font-medium'><img src={`${session?.user?.image}`} width={30} className='inline-block rounded-[50%]' /> {session?.user?.name} <SignOut/></div>):(<div><SignIn/></div>)}
        </div>
    </div>
  )
};


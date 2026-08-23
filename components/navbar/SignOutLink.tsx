'use client'

import {  SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import { toast } from 'sonner'

function SignOutLink() {

  function handelSignOut() {
    toast("Sign out..")
  }
  return (
    <SignOutButton>
      <Link href='/' className='w-full text-left' onClick={handelSignOut}>
        Logout
      </Link>
    </SignOutButton>

  )
}

export default SignOutLink
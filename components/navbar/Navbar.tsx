import React, { Suspense } from 'react'
import Container from '../global/Container'
import Logo from './Logo'
import NavSearch from './NavSearch'
import CartButton from './CartButton'
import LinksDropdown from './LinksDropdown'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
async function Navbar() {
  const { userId } = await auth();
  const isAdmin = userId === process.env.ADMIN_USER_ID;

  return (
    <div className='w-full h-[33vh]'>
      <Container className='h-full py-0'>
        <div className='relative h-full w-full overflow-hidden'>
          <Image
            src="/nav-img.jpg"
            alt="logo"
            fill
            sizes='100vw'
            priority
            className='object-cover'
          />

          <div className='absolute top-5 left-5 flex gap-4 items-center'>
            <CartButton />
          </div>
          <div className='absolute top-5 right-5 flex gap-4 items-center'>
            <LinksDropdown isAdmin={isAdmin} />
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Navbar
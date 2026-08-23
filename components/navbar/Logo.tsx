"use client"

import React from 'react'
import Link from 'next/link'
import { Button, buttonVariants } from '../ui/button'
import { VscCode } from 'react-icons/vsc'
import { dropDownMenuLinks } from '@/utils/links'
import { cn } from '@/lib/utils'
import { toast } from "sonner"

function Logo() {

  // function test() {
  //   toast("Event has been created.")
  // }
  return (
    <Button className={cn(
      buttonVariants({ size: 'icon' }),
      'flex items-center justify-center'
    )} 
   >
      <Link 
      // onClick={() =>
      //     toast.success("Be at the area 10 minutes before the event time")
      //   }
        href={dropDownMenuLinks[0].href}
      >
        <VscCode className='w-6 h-6 ' />
      </Link>
    </Button>

  )
}

export default Logo
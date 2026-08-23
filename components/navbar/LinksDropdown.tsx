"use client"

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserIcon from './UserIcon';
import Link from 'next/link';;
import { dropDownMenuLinks } from '@/utils/links';
import { Button } from '@/components/ui/button';
import { LuAlignLeft } from 'react-icons/lu';
import { SignInButton, SignOutButton, SignUpButton, useAuth } from "@clerk/nextjs";

function LinksDropdown({ isAdmin = false }: { isAdmin?: boolean }) {

  const { userId } = useAuth();
  const isSignedIn = !!userId;

  return (
    <div className="flex gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant='outline' className='flex gap-4 max-w-[100px]' aria-label="Open navigation menu" />}
        >
          <LuAlignLeft className='w-6 h-6' />
          <UserIcon />

        </DropdownMenuTrigger>


        {/* //here */}

        <DropdownMenuContent className='w-40' align='end' sideOffset={10}>
          {!isSignedIn ? (
            <>
              <DropdownMenuItem>
                <SignInButton mode='modal'>
                  <button className='w-full text-left'>Sign In</button>
                </SignInButton>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SignUpButton mode='modal'>
                  <button className='w-full text-left'>Sign Up</button>
                </SignUpButton>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              {dropDownMenuLinks.map((link) => {
                if (link.name === 'dashboard' && !isAdmin) return null;

                return (
                  <DropdownMenuItem key={link.name}>
                    <Link href={link.href}>
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <SignOutButton>
                  <button className='w-full text-left'>Sign Out</button>
                </SignOutButton>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>


      </DropdownMenu>


    </div>

  )
}

export default LinksDropdown




//  <div className='flex items-center gap-4 bg-transpart'>

//     {isLoaded && user ? (
//       <>
//         <UserButton >
//           <UserButton.MenuItems>
//             <UserButton.Link
//               label="Orders"
//               labelIcon={<Package size={15} />}
//               href="/orders"
//             />
//           </UserButton.MenuItems>
//         </UserButton>
//         {/* <CartSheet initialCart={cart} /> */}
//       </>
//     ) : isLoaded && (
//       <>
//         <SignInButton
//           mode='modal' >
//           <Button variant='outline'>
//             Sign In
//           </Button>
//         </SignInButton>
//         <SignUpButton mode='modal' >
//           <Button  variant='outline'>
//             Sign Up
//           </Button>
//         </SignUpButton>
//       </>
//     )}
//   </div>

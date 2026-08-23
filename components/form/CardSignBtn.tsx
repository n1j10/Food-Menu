import { SignInButton } from '@clerk/nextjs'
import { FaHeart } from 'react-icons/fa'
import { Button } from '../ui/button'

//user -> !auth -> go to sign in

function CardSignBtn() {
  return (
    <SignInButton mode='modal'>
      <Button
        variant={'ghost'}
        size={'icon'}
        type='button'
        className='p-2 cursor-pointer'
      >
        <FaHeart className=' text-red-500 hover:cursor-pointer' />
      </Button>
    </SignInButton>

  )
}

export default CardSignBtn
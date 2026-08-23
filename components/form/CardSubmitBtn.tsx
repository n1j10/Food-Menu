"use client"
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { SignInButton } from '@clerk/nextjs'
import { Loader2Icon } from "lucide-react";



function FavSubmitButton({isFav}:{isFav: boolean}) {

  const {pending} = useFormStatus();
  
  return (
    // <SignInButton mode='modal'>
      <Button
        variant={'ghost'}
        size={'icon'}
        type='submit'
        className=' text-red-500 p-2 cursor-pointer'
      >
        {pending ? ( <Loader2Icon className="animate-spin w-3 h-3" /> 
        ): isFav ? <FaHeart /> : <FaRegHeart />}
      </Button>
    // </SignInButton>
  )
}

export default FavSubmitButton
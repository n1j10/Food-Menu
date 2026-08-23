'use client';

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";
import { VscLoading } from "react-icons/vsc";
import { SignInButton } from "@clerk/nextjs";


type btnSize = 'default' | 'lg' | 'sm';

interface SubmitButtonProps {
  className?: string;
  text?: string;
  size?: btnSize;
};

export function SubmitButton({ className = '', text = 'submit', size = 'lg', }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      type='submit'
      disabled={pending}
      className={cn('capitalize mt-4', className)}
      size={size}
    >
      {pending ? (
        <>
          <VscLoading className='mr-2 h-4 w-4 animate-spin' />
          Please wait...
        </>
      ) : (
        text
      )}
    </Button>
  );
}


export default SubmitButton 



export const ProductSignInButton = () => {
  return (
    <SignInButton mode='modal'>
      <Button type='button' className='mt-8 capitalize'>
        sign in
      </Button>
    </SignInButton>
  );
};
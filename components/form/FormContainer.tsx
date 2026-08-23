"use client"
import { useActionState, useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { actionFunction } from "@/utils/type";
import { toast } from "sonner";
import React from "react";
import { useRouter } from "next/navigation";




const initialState = {
  message: '',
};

interface FormProps {
  children: React.ReactNode
  action: actionFunction
}

function FormContainer({ children, action, }: FormProps) {

  const [state, formAction] = useActionState(action, initialState); // react change  useFormState to  React.useActionState
  const [isPending, startTransition] = useTransition();
  const router = useRouter();


  // const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast("", { description: state.message });
    }
    startTransition( () => {
      setTimeout(() => { 
        router.refresh();
      }, 200); // Delay to allow toast to be seen

    })  
  }, [state]);


  return <form action={formAction}>
    {children}
  </form>;
}
export default FormContainer;

"use client"
import FormContainer from '../form/FormContainer'
import { Card } from '../ui/card'
import { creatReviewAction } from '@/utils/actions';
import RatingInput from './RatingInput';
import TextAreaInput from '../form/TextAreaInput';
import SubmitButton from '../form/Buttons';
import { useState } from 'react';
import { Button } from '../ui/button';

function SubmitReview({id}: {id:string}) {
   const [isvisabile,setIsvisabile]= useState(false);

  return (
<>
<Button onClick={()=> setIsvisabile(prev=>!prev)}>Leave Review</Button>
{
  isvisabile && (  
 <div>
    <Card className='p-8 my-8 '>
      <FormContainer action={creatReviewAction} >
        <input type='hidden' name={'productId'} value={id}/>
        <RatingInput name='rating'/>
        <TextAreaInput name='comment'  labelText='FeedBack'/>
        <SubmitButton/>
      </FormContainer>
    </Card>
    </div>
    )

}
   
</>
  )
}

export default SubmitReview
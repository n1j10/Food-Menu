

import FormContainer from '../form/FormContainer'
import { toggleFavAction } from '@/utils/actions';
import CardSubmitButton from '../form/CardSubmitBtn';
// import { usePathname } from 'next/navigation';

type toggleFavActionProps ={
  productID: string;
  FavoriteID: string | null;
}

function FavoriteToggleForm({productID,FavoriteID}:toggleFavActionProps) {



  const toggleAction = toggleFavAction.bind(null, { productID, FavoriteID })
  
  return (

    <FormContainer action={toggleAction} >

      <CardSubmitButton isFav={FavoriteID ? true : false}/>

    </FormContainer>

    
  )
}

export default FavoriteToggleForm



      {/* <input type='hidden' name='productID' value={productID} />
      <input type='hidden' name='FavoriteID'value={FavoriteID || ''} /> */}
        
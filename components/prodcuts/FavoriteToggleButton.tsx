import { auth } from '@clerk/nextjs/server'
import FavCardSignBtn from '../form/CardSignBtn';
import FavoriteToggleForm from './FavoriteToggleForm';
import { fetchFavoritID } from '@/utils/actions';


async function FavoriteToggleButton({productId}:{productId:string}) {
  const { userId } = await auth();
  // const fetchID ='10'
  if(!userId) return <FavCardSignBtn />

  const fetchID = await fetchFavoritID(productId);

  return (
    <FavoriteToggleForm productID={productId} FavoriteID={fetchID} />
  )
}

export default FavoriteToggleButton


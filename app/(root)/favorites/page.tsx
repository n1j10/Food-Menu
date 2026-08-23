export const dynamic = 'force-dynamic';

import SectionTitle from '@/components/global/SectionTitle'
import ProductsGrid from '@/components/prodcuts/ProductsGrid';
import { fetchUserFav } from '@/utils/actions';


const FavoritesPage =async () => {
  const userFavorites =await fetchUserFav();
//   console.log(userFavorites,"userFavorites")
  if(userFavorites.length === 0){
    return (
        <div>
            <SectionTitle text="You Don't Have Any Favorites Yet" />
        </div>
    )
  }
  else {
    return (
        <div>
            <SectionTitle text=" My Favorites" />
            <ProductsGrid  products={userFavorites.map(fav=>fav.product)}/>
        
        </div>
    )
  }
}

export default FavoritesPage
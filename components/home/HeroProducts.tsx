
import SectionTitle from '../global/SectionTitle'
import ProductsGrid from '../prodcuts/ProductsGrid'
import { fetchFeaturedProducts } from '@/utils/actions';
import EmptyList from '../global/EmptyList';

async function FeaturedProducts() {
  const Featured_Products = await fetchFeaturedProducts();

  if (Featured_Products.length === 0) return <EmptyList title="Add New  Products" />

  return (

    <section className='pt-24'>
      <SectionTitle text={'Products'} />
      
      <ProductsGrid products={Featured_Products} />

      
    </section>



  )
}

export default FeaturedProducts


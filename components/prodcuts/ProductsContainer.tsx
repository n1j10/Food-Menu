import { fetchAllProducts, fetchSingleCategory } from '@/utils/actions'
import React from 'react'
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LuLayoutGrid, LuList } from 'react-icons/lu';
import { links } from '@/utils/links';
import ProductsGrid from './ProductsGrid';
import ProductsList from './ProductsList';
import { ArrowBigLeft } from 'lucide-react';

async function ProductsContainer({ layout, search, categoryId }: { layout: string; search?: string; categoryId?: string }) {

  const totalProducts = await fetchAllProducts({ search, categoryId });
  const category = categoryId ? await fetchSingleCategory(categoryId) : null;

  const lengthProducts = totalProducts.length;

  const searchTerm = search ? `&search=${search}` : '';
  const categoryTerm = categoryId ? `&category=${categoryId}` : '';

  return (
    <>
    
      <section>
        <div className='flex justify-between items-center'>
          <div className='border outline rounded-full'>
            <Link href={links.HOME.href} >
              <ArrowBigLeft />
            </Link>
          </div>
          <h4 className='font-medium text-lg'>
            {category ? `${category.title}: ` : ''}
          </h4>
          
          <div className='flex gap-x-4'>
            <Button
              variant={layout === 'grid' ? 'default' : 'outline'}
              size='icon'
            >
              <Link href={`${links.PRODUCTS.href}?layout=grid${searchTerm}${categoryTerm}`}>
                <LuLayoutGrid />
              </Link>
            </Button>
            <Button
              variant={layout === 'list' ? 'default' : 'outline'}
              size='icon'

            >
              <Link href={`${links.PRODUCTS.href}?layout=list${searchTerm}${categoryTerm}`}>
                <LuList />
              </Link>
            </Button>
          </div>
        </div>
        <Separator className='mt-4' />
      </section>




      {/* product  */}

      <section>
        {
          totalProducts.length === 0 ? (
            <h5>sorry no product Matched your search</h5>
          ) : layout === 'grid' ? (
            <ProductsGrid products={totalProducts} />
          ) : (
            <ProductsList products={totalProducts} />
          )


        }


      </section>
    </>

  )
}

export default ProductsContainer

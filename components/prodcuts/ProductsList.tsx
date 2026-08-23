import { Product } from '@/lib/generated/prisma/client'
import { links } from '@/utils/links'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import { formatCurrency } from '@/utils/format'
import FavoriteToggleButton from './FavoriteToggleButton'
import FormContainer from '../form/FormContainer'
import { createOrderAction } from '@/utils/actions'
import SubmitButton from '../form/Buttons'

function ProductsList({ products }: { products: Product[] }) {

  console.log(products, "products list++");

  return (
    <section className='mt-12 grid gap-y-8'>
      {/* card */}

      {
        products.map((product) => {
          const productId = product.id;
          const { name, price, image, description } = product;
          const dinarAmount = formatCurrency(price);

          return (

            <div key={productId} className='group relative'>
              <Link href={`/products/${productId}`}>
                <Card className='transform group-hover:shadow-lg transition-shadow duration-500'>
                  <CardContent className='p-8 gap-y-4 grid md:grid-cols-3'>

                    <div className='relative h-64 md:h-48 md:w-48'>
                      <Image
                        src={image} alt={`${image}-List`}
                        fill
                        sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw, 33vw '
                        priority
                        className='rounded w-full object-cover rounded-lg transform group-hover:scale-110 transition-transform duration-500'
                      />
                    </div>
                    <div>
                      <h2 className='text-xl font-semibold capitalize'>{name}</h2>
                      <p className='text-muted-foreground mt-4 '>
                        {description}
                      </p>
                      <div className='w-[30%] mt-15'>
    <FormContainer action={createOrderAction}>
                        <input type="hidden" name="productId" value={productId} />
                        <SubmitButton text='Place Order' className='w-full mt-8' />
                      </FormContainer>
                      </div>
                  
                    </div>

                    <div className='flex gap-4 items-center md:flex-col justify-between text-xl text-center text-blue-200'>

                      <p>{dinarAmount}</p>
                      <div className=' z-5'>
                        <FavoriteToggleButton productId={productId} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>



            </div>

          )

        })
      }
    </section>
  )
}

export default ProductsList











// <div className='mt-12 grid gap-y-8'>
//   {products.map((product) => {
//     return (
//         <Link href={`/products/${productId}`}>
//           <Card className='transform group-hover:shadow-xl transition-shadow duration-500'>
//             <CardContent className='p-8 gap-y-4 grid md:grid-cols-3'>
//               <div className='relative h-64 md:h-48 md:w-48'>
//                 <Image
//                   src={image}
//                   alt={name}
//                   fill
//                   sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw, 33vw '
//                   priority
//                   className='w-full rounded object-cover'
//                 />
//               </div>
//               <div>
//                 <h2 className='text-xl font-semibold capitalize'>{name}</h2>
//                 <h4 className='text-muted-foreground'>{company}</h4>
//               </div>
//               <p className='text-muted-foreground text-lg md:ml-auto'>
//                 {dollarsAmount}
//               </p>
//             </CardContent>
//           </Card>
//         </Link>
//         <div className='absolute bottom-8 right-8 z-5'>
//           <FavoriteToggleButton productId={productId} />
//         </div>
//       </div>
//     );
//   })}
// </div>
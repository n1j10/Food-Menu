
import FavoriteToggleButton from '@/components/prodcuts/FavoriteToggleButton';
import ProductReviews from '@/components/reviews/ProductReviews';
import SubmitReview from '@/components/reviews/SubmitReview';
import AddtoCart from '@/components/single-prodcut/AddtoCart';
import BreadCrumb from '@/components/single-prodcut/BreadCrumb';
import ProductRating from '@/components/single-prodcut/ProductRating';
import SelectProductAmount from '@/components/single-prodcut/SelectProductAmount';
import ShareButton from '@/components/single-prodcut/shareButton';
import { fetchSingleProduct } from '@/utils/actions';
import { formatCurrency } from '@/utils/format';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';

// interface replace with PageProps
// interface Params {
//     id: string
// }
const ProductDetailsPage = async ({ params }: { params: { id: string } }) => {

    const { id } = await params;

    //   const reviewDoesNotExist = userId && !(await findExistingReview(userId, product.id));
    try {
        const product = await fetchSingleProduct(id);
        const dinarAmount = formatCurrency(product.price)
        const { name, image, description, price } = product;
        const { userId } = await auth();

        return (
            <>
                <section>
                    <BreadCrumb name={product.name} />
                    <section className='grid lg:grid-cols-2 mt-5 gap-y-6 lg:gap-x-16'>
                        {/* image */}
                        <div className='relative h-full '>
                            <Image src={product.image}
                                alt={product.name}
                                fill
                                priority
                                className='w-full rounded-md object-cover'
                                sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw, 33vw '
                            />
                        </div>
                        {/* Product Info */}
                        <div >
                            <div className='flex gap-x-5 items-center' >
                                <h2 className='capitalize text-3xl font-bold'>{product.name}</h2>
                                <FavoriteToggleButton productId={id} />
                                <ShareButton id={id} name={product.name} />
                            </div>
                            <ProductRating productId={product.id} />   {/* change it to dynamic */}
                            <h4 className='text-md p-2 mt-3  bg-muted  rounded-md inline-block'>
                                {dinarAmount}
                            </h4>
                            <p className='mt-6 leading-8 text-muted-foreground '>{product.description}</p>
                            <AddtoCart productId={product.id} />

                        </div>
                    </section>
                </section>
                <ProductReviews productId={id} />
                <SubmitReview id={id} />
                {/* {reviewDoesNotExist && <SubmitReview productId={params.id} />} */}

            </>
        )

    } catch (error) {
        return (
            <section>
                <h1 className='text-2xl font-bold'>Product not found</h1>
                <Link href='/products' className='btn btn-outline mt-5 inline-block'>Back to Products</Link>
            </section>
        )

    }

}

export default ProductDetailsPage 
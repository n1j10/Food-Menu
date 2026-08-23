import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import { fetchAllCategories } from "@/utils/actions";
import EmptyList from "../global/EmptyList";
import { links } from "@/utils/links";
import NavSearch from "../navbar/NavSearch";


async function Hero() {
  const categories = await fetchAllCategories();
  if (categories.length === 0) return <EmptyList title="No Active Categories" />

  return (
    <>
          <h1 className="max-w font-bold text-4xl tracking-tight sm:text-6xl flex justify-center ">
        E-Menu
      </h1>
        <section className=' pt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-10 lg:grid-cols-6 '>

        {
          categories.map((category) => {
            const { id, title, image } = category;
            return (
              <div key={id} className='group relative w-full h-44'>
                <Link href={`${links.PRODUCTS.href}?category=${id}`}>

                  <Card className='transform group-hover:shadow-xl transition-shadow duration-500  '>

                    <CardContent>
                      <div className='relative h-12 sm:h-20 md:h-20 lg:h-20 rounded overflow-hidden  '>
                        <Image
                          src={`${image}`}
                          alt={title}
                          fill
                          sizes='(max-width:500px) 50vw,(max-width:600px) 30vw, 23vw '
                          priority
                          className='rounded w-full object-cover transform group-hover:scale-110 transition-transform duration-500'
                        />
                      </div>
                      <div className='mt-4 text-center'>
                        <h2 className='text-lg capitalize'>{title}</h2>
                      </div>
                    </CardContent>

                  </Card>
                </Link>
              </div>
            )
          }
          )}


        </section>
           <div className="mt-15   ">
             <NavSearch />
           </div>

    </>
  );
}



















export default Hero;
{/* <div>
        <Button size="lg" className="mt-10 bg-blue-500 text-white">
          <Link href="/products">All Products</Link>
        </Button>
      </div> */}
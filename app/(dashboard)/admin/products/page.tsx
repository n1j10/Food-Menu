export const dynamic = 'force-dynamic';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from 'next/link';
import { deleteProductAction, fetchAdminPosts } from '@/utils/actions';
import { formatCurrency } from "@/utils/format";
import { Edit2 } from "lucide-react";
import { links } from "@/utils/links";
import IconButton from "@/components/admin/products/IconButton";
import FormContainer from "@/components/form/FormContainer";


async function ProductsAdminPage() {
  const getPosts = await fetchAdminPosts();
  // console.log(getPosts);
  const total = getPosts.length;
  return (
    <section className="w-[50vw] mx-auto">
      <Table>
        <TableCaption>Total Products: {total}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead >Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            getPosts.map((product) => {
              const { id, name, price } = product;
              const formattedPrice = formatCurrency(price);
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link href={`${links.PRODUCTS.href}/${id}`}
                      className='underline text-muted-foreground tracking-wide capitalize'
                    >
                      {name}
                    </Link>
                  </TableCell>
                  <TableCell>{formattedPrice}</TableCell>
                  <TableCell className="flex gap-2 items-center">
                    <Link href={`${links.AdminProducts.href}/${id}/edit`}>
                      <IconButton actionType={"edit"} />
                    </Link>
                    <DeleteProduct productId={product.id} />

                  </TableCell>
                </TableRow>
              )

            })
          }
        </TableBody>
      </Table>
    </section>

  )
}

export default ProductsAdminPage


function DeleteProduct({ productId }: { productId: string }) {
  const delete_product = deleteProductAction.bind(null, { productId })

  return (
    <FormContainer action={delete_product}>
      <IconButton actionType={"delete"} />
    </FormContainer>
  )

}
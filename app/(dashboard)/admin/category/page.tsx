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
import { deleteCategoryAction, fetchAdminCategories } from '@/utils/actions';
import IconButton from "@/components/admin/products/IconButton";
import FormContainer from "@/components/form/FormContainer";

async function CategoriesAdminPage() {
  const categories = await fetchAdminCategories();
  const total = categories.length;

  return (
    <section className="w-[50vw] mx-auto">
      <Table>
        <TableCaption>Total Categories: {total}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Category Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            categories.map((category) => {
              const { id, title } = category;
              return (
                <TableRow key={id}>
                  <TableCell>
                    <Link href={`/admin/category/${id}/edit`}
                      className='underline text-muted-foreground tracking-wide capitalize'
                    >
                      {title}
                    </Link>
                  </TableCell>
                  <TableCell className="flex gap-2 items-center">
                    <Link href={`/admin/category/${id}/edit`}>
                      <IconButton actionType={"edit"} />
                    </Link>
                    <DeleteCategory categoryId={id} />
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

export default CategoriesAdminPage

function DeleteCategory({ categoryId }: { categoryId: string }) {
  const delete_category = deleteCategoryAction.bind(null, { categoryId })

  return (
    <FormContainer action={delete_category}>
      <IconButton actionType={"delete"} />
    </FormContainer>
  )
}
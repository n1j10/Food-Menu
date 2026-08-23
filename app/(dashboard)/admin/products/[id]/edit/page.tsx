import ImageInputEditContainer from '@/components/admin/products/ImageInputContainer'
import SubmitButton from '@/components/form/Buttons'
import CategoryInput from '@/components/form/CategoryInput'
import CheckBoxInput from '@/components/form/CheckBoxInput'
import FormContainer from '@/components/form/FormContainer'
import FormInput from '@/components/form/FormInput'
import PriceInput from '@/components/form/PriceInput'
import TextAreaInput from '@/components/form/TextAreaInput'
import { fetchSingleProduct, updateProductAction, updateProductImageAction } from '@/utils/actions'

interface EditParamsProps {
  params: { id: string }
}

async function EditProductPage({ params }: EditParamsProps) {
  const { id } = await params;
  const product = await fetchSingleProduct(id);
  const { name, description, price, featured, image, categoryId } = product;
  return (

    <section className=' w-3xl'>
      <h1 className='text-2xl font-semibold mb-4 capitalize'>Update product</h1>
      <div className='border p-8 rounded-md'>
        <ImageInputEditContainer
          name={name}
          image={image}
          action={updateProductImageAction}
          text="update image"
        >
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="url" value={image} />

        </ImageInputEditContainer>



        <FormContainer action={updateProductAction}>
          <input type="hidden" name="id" value={id} />


          <div className='grid gap-4 md:grid-cols-2 my-4'>
            <FormInput
              name='name'
              type='text'
              label='Product Name'
              defaultValue={name}
            />
            <PriceInput defaultValue={price} />
            <CategoryInput defaultValue={categoryId} />
            <TextAreaInput
              name='description'
              labelText='Description'
              defaultValue={description}
            />
            <div className='mt-6'>
              <CheckBoxInput name='featured'
                label='Agree Terms' defaultChecked={featured} />
            </div>
            <SubmitButton text='Update Product' className='hover:cursor-pointer' />
          </div>
        </FormContainer>

      </div>
    </section>)
}

export default EditProductPage
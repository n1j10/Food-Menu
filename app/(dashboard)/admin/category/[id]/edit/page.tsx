import ImageInputEditContainer from '@/components/admin/products/ImageInputContainer'
import SubmitButton from '@/components/form/Buttons'
import CategoryInput from '@/components/form/CategoryInput'
import FormContainer from '@/components/form/FormContainer'
import FormInput from '@/components/form/FormInput'

import { fetchSingleCategory, updateCategoryAction, updateCategoryImageAction } from '@/utils/actions'

interface EditParamsProps {
  params: { id: string }
}

async function EditCategoryPage({ params }: EditParamsProps) {
  const { id } = await params;
  const category = await fetchSingleCategory(id);
  const {title, image } = category;
  return (

    <section className=' w-3xl'>
      <h1 className='text-2xl font-semibold mb-4 capitalize'>Update category</h1>
      <div className='border p-8 rounded-md'>
        <ImageInputEditContainer
          name={title}
          image={image}
          action={updateCategoryImageAction}
          text="update image"
        >
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="url" value={image} />

        </ImageInputEditContainer>



        <FormContainer action={updateCategoryAction}>
          <input type="hidden" name="id" value={id} />

          <div className='grid gap-4 md:grid-cols-2 my-4'>
            <FormInput
              name='title'
              type='text'
              label='Category Name'
              defaultValue={title}
            />
            <SubmitButton text='Update category' className='hover:cursor-pointer' />
          </div>
        </FormContainer>

      </div>
    </section>)
}

export default EditCategoryPage
import SubmitButton from '@/components/form/Buttons'
import FormContainer from '@/components/form/FormContainer'
import FormInput from '@/components/form/FormInput'
import ImageInput from '@/components/form/ImageInput'
import { createCategoryAction } from '@/utils/actions'

function CreateCategoryPage() {
  return (
       <section className=' w-3xl'>
      <h1 className='text-2xl font-semibold mb-4 capitalize'>create category</h1>
      <div className='border p-8 rounded-md'>
        <FormContainer action={createCategoryAction}>

          <div className='grid gap-4 md:grid-cols-2 my-4'>
            <FormInput
              name='title'
              type='text'
              label='Category Name'
            />
            <ImageInput name='image' />
    
            <SubmitButton text='Create Category'/>
          </div>
        </FormContainer>

      </div>
    </section>
  )
}

export default CreateCategoryPage

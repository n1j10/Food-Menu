import SubmitButton from '@/components/form/Buttons'
import CategoryInput from '@/components/form/CategoryInput'
import CheckBoxInput from '@/components/form/CheckBoxInput'
import FormContainer from '@/components/form/FormContainer'
import FormInput from '@/components/form/FormInput'
import ImageInput from '@/components/form/ImageInput'
import PriceInput from '@/components/form/PriceInput'
import TextAreaInput from '@/components/form/TextAreaInput'
import { createProductAction } from '@/utils/actions'


function CreateProductPage() {

  return (

    <section className=' w-3xl'>
      <h1 className='text-2xl font-semibold mb-4 capitalize'>create product</h1>
      <div className='border p-8 rounded-md'>
        <FormContainer action={createProductAction}>

          <div className='grid gap-4 md:grid-cols-2 my-4'>
            <FormInput
              name='name'
              type='text'
              label='Product Name'
            />
            <PriceInput />
            <CategoryInput />
            <ImageInput name='image' />
            <TextAreaInput
              name='description'
              labelText='Description'
            />
            <div className='mt-6'>
              <CheckBoxInput name='featured' 
              label='Agree Terms'/>
            </div>
            <SubmitButton text='Create Product'/>
          </div>
        </FormContainer>

      </div>
    </section>
  )
}

export default CreateProductPage
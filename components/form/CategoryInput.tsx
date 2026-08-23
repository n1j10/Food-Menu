import { fetchAllCategories } from '@/utils/actions';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

async function CategoryInput({ defaultValue, }: { defaultValue?: string | null }) {
  const categories = await fetchAllCategories();

  return (
    <div className='mb-2'>
      <Label htmlFor='categoryId' className='capitalize mb-2'>
        Category
      </Label>

      <Select 
        id='categoryId'
        name='categoryId'
        defaultValue={defaultValue || ''}
        required >
      <SelectTrigger className="w-full h-8  min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none 
        focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
        <SelectValue placeholder="Select a Category" />
      </SelectTrigger>
      <SelectContent>
     
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.title}>
            {category.title}
          </SelectItem>
        ))}
     
      </SelectContent>
    </Select>

    </div>
  );
}
    
export default CategoryInput;


 


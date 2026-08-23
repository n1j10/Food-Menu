import React from 'react'
import {
  Select,
  SelectContent,
  // SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '../ui/label';



interface RatingInputProps {
  name: string;
  labelText?: string;
}
function RatingInput({ name, labelText }: RatingInputProps) {

  const numbers = Array.from({ length: 5 }, (_, i) => {
    const value = i + 1;
    return value.toString();
  }).reverse();

  return (
    <div className='mb-4 max-w-xs flex gap-4 items-center'>
      <Label className='capitalize'>
        {labelText || name}
      </Label>

      <Select defaultValue={numbers[0]} name={name} required>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {numbers.map((num) => (
            <SelectItem key={num} value={num}>
              {num}
            </SelectItem>
          ))}
        </SelectContent>

      </Select>

    </div>
  )
}

export default RatingInput
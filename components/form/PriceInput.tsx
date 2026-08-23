import { Input } from "../ui/input"
import { Label } from "../ui/label"



interface PriceFormatProps {
  name?:string,
  defaultValue?:number
}

function PriceInput({name,defaultValue}:PriceFormatProps) {
  return (
    <div className="mb-2">
      <Label htmlFor="price" className="capitalize mb-1.5">
        Price ($)
      </Label>
      <Input
        id={name || 'price'}
        type="number"
        name={name || 'price'}
        min={0}
        defaultValue={defaultValue || 100}
        required
      />
    </div>
  )
}  

export default PriceInput
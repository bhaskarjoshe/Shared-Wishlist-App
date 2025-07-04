import type { ProductType } from "../types/types"
import { TiDeleteOutline } from "react-icons/ti"

interface ProductsProps{
    product: ProductType
    handleDelete:(id:number)=>void
}

const Products = ({product, handleDelete}: ProductsProps) => {
  return (
    <div className="rounded shadow py-4 px-2 my-2 flex h-25 relative">
        <div className="w-[30%] flex justify-center items-center">
            <img src={product.imageurl} className="h-[100%] rounded "/>
        </div>
        <div className="flex flex-col w-[70%] py-2 ml-[5%]">
            <span>{product.name}</span>
            <span className="text-green-600">₹{product.price}</span>
        </div>
        <TiDeleteOutline className="text-xl absolute top-2 right-2 text-red-300 cursor-pointer" onClick={handleDelete}/>
    </div>
  )
}

export default Products
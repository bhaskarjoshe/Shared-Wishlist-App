import { useEffect, useState } from "react";
import type { ProductType, WishlistType } from "../types/types";
import Products from "./Products";

const ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;

const Wishlist = ({ wishlist }: { wishlist: WishlistType }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const getWishlists = async () => {
      try {
        const res = await fetch(
          `${ROOT_API_URL}/wishlist/${wishlist.id}/products`,
          {
            method: "GET",
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.error("Error Fetching Products");
        } else {
          setProducts(data);
        }
      } catch (err) {
        alert("Internal server error");
        console.error(err);
      }
    };
    getWishlists();
  }, []);

  const addNewProduct = async () => {
    if (!productName.trim() || !price.trim()) {
      alert("Please fill out both product name and price");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated");
      return;
    }

    try {
      const imageurl =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5okG0tz2dWr36k2p9gxbFmqoM4AeW1e3pPQ&s";

      const res = await fetch(
        `${ROOT_API_URL}/wishlist/${wishlist.id}/add_product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: productName,
            price,
            imageurl,
          }),
        }
      );

      const data: ProductType = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to add product");
      }

      setProducts((prev) => [...prev, data]);

      setProductName("");
      setPrice("");
      setImage(null);
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Something went wrong while adding the product");
    }
  };

  const handleDelete = async (productId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated");
      return;
    }

    try {
      const res = await fetch(
        `${ROOT_API_URL}/wishlist/${wishlist.id}/remove_product/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Something went wrong while deleting the product");
    }
  };

  return (
    <div className="border border-gray-300 rounded-2xl shadow-md h-120 w-100 flex flex-col bg-white overflow-hidden">
      <h1 className="bg-gray-100 p-4 text-center text-lg font-semibold text-gray-800">
        {wishlist.name}
      </h1>

      <div className="flex-1 p-4 text-gray-600 text-sm overflow-y-auto">
        <div>
          {products.length > 0 ? (
            products.map((product) => (
              <Products
                key={product.id}
                product={product}
                handleDelete={() => handleDelete(product.id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-400">No products to display</p>
          )}
        </div>
        <div className="rounded shadow py-4 px-1 my-2 flex h-25">
          <div className="w-[30%]">
            <input
              type="file"
              id="productImage"
              accept="image/*"
              className="hidden"
              onChange={(e) => console.log(e.target.files?.[0])}
            />
            <label
              htmlFor="productImage"
              className=" w-full h-full cursor-pointer rounded border border-gray-300 text-center flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Select Image
            </label>{" "}
          </div>
          <div className="flex flex-col w-[70%] py-2 ml-[5%] gap-1">
            <input
              className="border border-gray-300 text-gray-400 px-2 py-0.5 rounded"
              placeholder="Enter product"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <div className="flex gap-1">
              <input
                className="border border-gray-300 w-[50%] text-gray-400 px-2 py-0.5 rounded"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <button
                className="w-[50%] rounded text-white bg-green-400 px-2 py-0.5 cursor-pointer"
                onClick={addNewProduct}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      <span className="bg-gray-100 p-3 text-center text-xs text-gray-500">
        Added by @{wishlist.added_by}
      </span>
    </div>
  );
};

export default Wishlist;

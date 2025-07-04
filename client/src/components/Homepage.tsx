import { useEffect, useState } from "react";
import Wishlist from "./Wishlist";
import type { WishlistType } from "../types/types";

const ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;

const Homepage = () => {
  const [wishlists, setWishlists] = useState<WishlistType[]>([]);
  const [newWishlistName, setNewWishlistName] = useState<string>("");
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWishlists = async () => {
    try {
      const res = await fetch(`${ROOT_API_URL}/wishlists`);
      const data = await res.json();
      if (res.ok) {
        setWishlists(data);
      } else {
        console.error("Error Fetching Wishlists");
      }
    } catch (err) {
      alert("Internal server error");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWishlists()
  }, []);

  const handleAddWishlist = async () => {
    if (!inputVisible) {
      setInputVisible(true);
      return;
    }

    const trimmedName = newWishlistName.trim();
    if (!trimmedName) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${ROOT_API_URL}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${token}`
        },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (!res.ok) {
        throw new Error("Failed to create wishlist");
      }

      const newWishlist = await res.json();

      setWishlists((prev) => [newWishlist, ...prev]);

      setNewWishlistName("");
      setInputVisible(false);
    } catch (err) {
      alert("Failed to create wishlist");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  return (
   <div className="flex flex-col gap-5 items-center px-4 py-8">
      <div className="flex gap-6 w-full max-w-6xl">
        {wishlists.map((wishlist) => (
          <Wishlist key={wishlist.id} wishlist={wishlist} />
        ))}
      </div>

      <div className="flex items-center gap-2 mt-6">
        {inputVisible && (
          <input
            placeholder="Enter new wishlist"
            className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={newWishlistName}
            onChange={(e) => setNewWishlistName(e.target.value)}
            disabled={loading}
          />
        )}
        <button
          className="rounded-xl shadow bg-blue-400 hover:bg-blue-500 text-white text-2xl px-4 py-1 transition-all duration-200 cursor-pointer"
          onClick={handleAddWishlist}
          disabled={loading}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Homepage;

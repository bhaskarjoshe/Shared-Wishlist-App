import express from "express";
import {
  addProductToWishlist,
  createNewWishlist,
  editProductInWishlist,
  getAllWishlist,
  removeProductFromWishlist
} from "../controllers/wistlistController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();
router.get("/api/wishlists", getAllWishlist);
router.post("/api/wishlist", authenticateJWT, createNewWishlist);
router.post("/api/wishlist/:id/add_product", authenticateJWT, addProductToWishlist);
router.delete("/api/wishlist/:id/remove_product/:product_id", authenticateJWT, removeProductFromWishlist);
router.put("/api/wishlist/:id/edit_product/:product_id", authenticateJWT, editProductInWishlist);

export default router;

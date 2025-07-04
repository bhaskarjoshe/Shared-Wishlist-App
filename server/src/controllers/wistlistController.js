import { pool } from "../config/db.js";
import logger from "../config/logger.js";

const getAllWishlist = async (req, res) => {
  try {
    const wishlists = await pool.query("SELECT * FROM wishlist");
    logger.info("Fetched Wishlists");
    res.status(200).json({
      wishlists: wishlists.rows,
    });
  } catch (err) {
    logger.error(`Error fething wishlists: ${err}`);
    res.status(500).json({
      message: `Error fething wishlists`,
    });
  }
};

const createNewWishlist = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "wishlist name is required" });
    }
    console.log(req.user);
    await pool.query("INSERT INTO wishlist (name, added_by) VALUES ($1, $2)", [
      name,
      req.user.id,
    ]);
    logger.info(`Wishlist added successfully: ${name}`);
    return res.status(201).json({ message: "wishlist added successfully" });
  } catch (err) {
    logger.error(`Error fething wishlists: ${err}`);
    res.status(500).json({
      message: `Error fething wishlists`,
    });
  }
};

const addProductToWishlist = async (req, res) => {
  try {
    const { name, price, imageurl } = req.body;
    const added_by = req.user.id;
    const { id } = req.params;
    if (!name || !price) {
      res.status(400).json({ message: "name or price is missing" });
    }
    await pool.query(
      "INSERT INTO products(name,price,imageurl, added_by, wishlist_id) VALUES ($1, $2, $3, $4, $5)",
      [name, price, imageurl, added_by, id]
    );
    logger.info(`Product added successfully: ${name}`);
    return res.status(201).json({ message: "product added successfully" });
  } catch (err) {
    logger.error(`Error adding product to wishlist: ${err}`);
    res.status(500).json({
      message: `Error adding product`,
    });
  }
};

const removeProductFromWishlist = async (req, res) => {
  try {
    const { product_id } = req.params;

    if (!product_id) {
      res.status(400).json({ message: "missing id" });
    }
    await pool.query("DELETE FROM products WHERE id = $1", [product_id]);
    logger.info(`Product deleted successfully`);
    return res.status(200).json({ message: "product deleted successfully" });
  } catch (err) {
    logger.error(`Error deleting product from wishlist: ${err}`);
    res.status(500).json({
      message: `Error deleting product`,
    });
  }
};

const editProductInWishlist = async (req, res) => {
  try {
    const { product_id } = req.params;
    if (!product_id) {
      res.status(400).json({ message: "missing id" });
    }

    const { name, price, imageurl } = req.body;

    const result = await pool.query(
      "UPDATE products SET name = $1, price= $2, imageurl = $3 WHERE id=$4",
      [name, price, imageurl, product_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    logger.info(`Product edited successfully`);
    return res.status(200).json({ message: "product edited successfully" });
  } catch (err) {
    logger.error(`Error editing product in wishlist: ${err}`);
    res.status(500).json({
      message: `Error editing product`,
    });
  }
};

export {
  getAllWishlist,
  createNewWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  editProductInWishlist,
};

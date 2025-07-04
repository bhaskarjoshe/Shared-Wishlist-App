import { pool } from "../config/db.js";
import logger from "../config/logger.js";

const getAllWishlist = async (req, res) => {
  try {
    const wishlists = await pool.query(`
      SELECT
        wishlist.id,
        wishlist.name,
        wishlist.created_at,
        users.username AS added_by
      FROM wishlist
      JOIN users ON wishlist.added_by = users.id
      ORDER BY wishlist.created_at DESC
    `);
    logger.info("Fetched Wishlists");
    res.status(200).json(wishlists.rows);
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


const getProductsFromWishlist = async (req, res) => {
  const wishlistId = req.params.id;

  try {
    const products = await pool.query(
      `
      SELECT
        products.id,
        products.name,
        products.price,
        products.imageurl,
        products.created_at,
        users.username AS added_by
      FROM products
      JOIN users ON products.added_by = users.id
      WHERE products.wishlist_id = $1
      ORDER BY products.created_at DESC
      `,
      [wishlistId]
    );

    logger.info(`Fetched products for wishlist ID ${wishlistId}`);

    res.status(200).json(products.rows);
  } catch (err) {
    logger.error(`Error fetching products for wishlist ID ${wishlistId}: ${err}`);
    res.status(500).json({
      message: "Error fetching products for wishlist",
    });
  }
};

const addProductToWishlist = async (req, res) => {
  try {
    const { name, price, imageurl } = req.body;
    const added_by = req.user.id;
    const { id: wishlist_id } = req.params;

    if (!name || !price) {
      return res.status(400).json({ message: "name or price is missing" });
    }

    const result = await pool.query(
      `
      INSERT INTO products (name, price, imageurl, added_by, wishlist_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, price, imageurl, added_by, wishlist_id, created_at
      `,
      [name, price, imageurl, added_by, wishlist_id]
    );

    const newProduct = result.rows[0];

    logger.info(`Product added successfully: ${name}`);
    return res.status(201).json(newProduct);
  } catch (err) {
    logger.error(`Error adding product to wishlist: ${err}`);
    res.status(500).json({
      message: "Error adding product",
    });
  }
};

const removeProductFromWishlist = async (req, res) => {
  try {
    const { id: wishlist_id, product_id } = req.params;

    if (!product_id) {
      return res.status(400).json({ message: "Missing product_id" });
    }

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 AND wishlist_id = $2 RETURNING *",
      [product_id, wishlist_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found or not in this wishlist" });
    }

    logger.info(`Product ${product_id} deleted from wishlist ${wishlist_id}`);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    logger.error(`Error deleting product from wishlist: ${err}`);
    res.status(500).json({ message: "Error deleting product" });
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
  getProductsFromWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  editProductInWishlist,
};

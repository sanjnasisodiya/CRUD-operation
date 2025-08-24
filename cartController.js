
import pool from "../database/db.js";

//add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }

    //check if item already in cart
    const query = "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
    const [existing] = await pool.query(query, [userId, product_id]);
    if (existing.length > 0) {
      //update quantity if already exists
      const updateQuery = `UPDATE cart SET quantity = quantity + ?
                          WHERE user_id =? AND product_id =?`;
      await pool.query(updateQuery, [quantity, product_id]);
    } else {
      //insert new cart item
      const query =
        "INSERT INTO cart(user_id,product_id,quantity) VALUES (?,?,?)";
      await pool.query(query, [userId, product_id, quantity]);
    }
    res.status(201).json({ message: "Product added to cart" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const [items] = await pool.query(
      `SELECT c.id,p.name,p.price,c.quantity,(p.price*c.quantity) AS total_price
      FROM cart c
      JOIN products p ON c.product_id=p.id
      WHERE c.user_id =?`,
      [userId]
    );
    res.status(200).json(items);
  } catch (err) {}
};

//update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart_id } = req.params; //cart table ID
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    const [result] = await pool.query(
      "UPDATE cart SET quantity = ? AND user_id = ?",
      [quantity, cart_id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({ message: "Cart updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//remove single item from cart
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart_id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM cart WHERE id=? AND user_id=?",
      [cart_id, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json({ message: "Cart item removed" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await pool.query("DELETE FROM cart WHERE user_id=?", [userId]);
    res.status(201).json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

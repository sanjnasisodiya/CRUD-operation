import pool from "../database/db.js";

//create product
export const createProduct = async (req, res) => {
  try {
    const { name, price, category_id, description, stock } = req.body;
    if (!name || !price || !category_id || stock === undefined) {
      return res
        .status(400)
        .json({ message: "All required fileds must be provides" });
    }

    const query =
      "INSERT INTO products (name,price,category_id,description,stock) VALUES (?,?,?,?,?)";
    const [result] = await pool.query(query, [
      name,
      price,
      category_id,
      description,
      stock,
    ]);
    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId,
    });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get products
export const getProducts = async (req, res) => {
  try {
    const query = `SELECT p.id ,p.name,p.price,p.description,p.stock,c.name AS category_name
                   FROM products p
                   JOIN categories c ON p.category_id = c.id`;

    const [data] = await pool.query(query);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get product by id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT p.id,p.name,p.price,p.description,p.stock,c.name AS category_name
                   FROM products p
                   JOIN categories c ON p.category_id = c.id
                   WHERE p.id = ?`;

    const [data] = await pool.query(query, [id]);
    if (data.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    console.error("Error fetching producct by id:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category_id, description, stock } = req.body;
    const query =
      "UPDATE products SET name =?,price=?,category_id=?,description=?,stock=? WHERE id = ?";
    const [data] = await pool.query(query, [
      name,
      price,
      category_id,
      description,
      stock,
      id,
    ]);

    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM products WHERE id =?";
    const [data] = await pool.query(query, [id]);
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

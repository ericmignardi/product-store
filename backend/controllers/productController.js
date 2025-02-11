import { sql } from "../config/db.js";

export const readAllProducts = async (req, res) => {
  try {
    const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
        `;
    console.log("Fetched Products", products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error in readAllProducts: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const readProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql`
            SELECT * FROM products WHERE id = ${id}
            ORDER BY created_at DESC
            `;
    console.log("Fetched Product", product);
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("Error in readProductById: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;
  if (!name || !image || !price) {
    return res
      .status(400)
      .json({ success: false, message: "All Fields Are Required" });
  }
  try {
    const product = await sql`
            INSERT INTO products (name, image, price)
            VALUES (${name}, ${image}, ${price})
            RETURNING *
            `;

    console.log("Created Product", product);
    res.status(201).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("Error in createProduct: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { name, price, image } = req.body;
  const { id } = req.params;
  try {
    const product = await sql`
        UPDATE products SET NAME = ${name}, IMAGE = ${image}, price = ${price} WHERE id = ${id} RETURNING *
    `;
    if (product.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }
    console.log("Updated Product", product);
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("Error in updateProduct: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql`
        DELETE FROM products WHERE id = ${id} RETURNING *
    `;
    if (product.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }
    console.log("Deleted Product", product);
    res.status(200).json({ success: true, message: product[0] });
  } catch (error) {
    console.log("Error in deleteProduct: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

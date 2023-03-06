const productsModel = require("../models/products.model");

const getProducts = async (req, res) => {
  try {
    const { query } = req;
    const result = await productsModel.getProducts(query);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "Product not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

// params => query (search, filter, sort, paginasi) & path (get detail)
const getProductDetail = async (req, res) => {
  try {
    const { params } = req;
    const result = await productsModel.getProductDetail(params);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "Product not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const insertProducts = async (req, res) => {
  try {
    const { body } = req;
    const result = await productsModel.insertProducts(body);
    res.status(201).json({
      data: result.rows,
      msg: "Create Product Success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error cuy",
    });
  }
};

const updateProducts = async (req, res) => {
  try {
    const { params, body } = req;
    const result = await productsModel.updateProducts(params, body);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "Product not found",
      });
      return;
    }
    res.status(201).json({
      data: result.rows,
      msg: "Update Product Success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error cuy",
    });
  }
};

const deleteProducts = async (req, res) => {
  try {
    const { params } = req;
    const result = await productsModel.deleteProducts(params);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "Product not found",
      });
      return;
    }
    res.status(200).json({
      msg: "Product Deleted",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  getProducts,
  insertProducts,
  getProductDetail,
  updateProducts,
  deleteProducts,
};

/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
const productsModel = require("../models/products.model");
const { uploader } = require("../utils/cloudinary");
const randomstring = require("randomstring");

const getProducts = async (req, res) => {
  try {
    const { query } = req;

    if (query.hasOwnProperty("categories") && query.favorite == "false") {
      delete query.favorite;
    }
    if (query.hasOwnProperty("favorite") && query.favorite == "true") {
      delete query.categories;
    }

    const result = await productsModel.getProducts({
      ...query,
      name: query.name || "",
    });
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "Product not found",
      });
      return;
    }

    const meta = await productsModel.getMetaProducts({
      ...query,
      name: query.name || "",
    });
    res.status(200).json({
      data: result.rows,
      meta,
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

// const insertProducts = async (req, res) => {
//   const fileLink = `/images/${req.file.filename}`;
//   try {
//     const { body } = req;
//     const result = await productsModel.insertProducts(body, fileLink);
//     res.status(201).json({
//       data: result.rows[0],
//       msg: "Insert Success",
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({
//       msg: "Internal server error",
//     });
//   }
// };

const insertProducts = async (req, res) => {
  try {
    let fileLink;
    if (req.file) {
      // Unggah file ke cloud
      // generate a random string of length 10
      const randomString = randomstring.generate(10);

      // get the file extension
      const ext = req.file.originalname.split(".").pop();

      // create a filename using the random string and file extension
      const filename = `${randomString}.${ext}`;

      const cloudResult = await cloudUpload(req, res, {
        prefix: "product",
        id: filename,
      });
      fileLink = cloudResult.secure_url;
      console.log(fileLink);
    }
    const { body } = req;
    if (!body || !fileLink) {
      return res.status(400).json({ msg: "Input cannot be empty" });
    }
    const result = await productsModel.insertProducts(body, fileLink);
    res.status(201).json({
      data: result.rows[0],
      msg: "Insert success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Terjadi kesalahan pada server",
    });
  }
};

const cloudUpload = async (req, res) => {
  try {
    // upload ke cloud
    const { params } = req;
    const { data, err, msg } = await uploader(req, "product", params.id);
    if (err) throw { msg, err };
    if (!data) return res.status(200).json({ msg: "No File Uploaded" });
    return data;
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
  // console.log(error)
};

// const updateProducts = async (req, res) => {
//   if (req.file === undefined) {
//     fileLink = req.body.image;
//   } else {
//     fileLink = `/images/${req.file.filename}`;
//   }
//   const fileLink = `/images/${req.file.filename}`;
//   try {
//     const { params, body } = req;
//     const result = await productsModel.updateProducts(params, body, fileLink);
//     res.status(201).json({
//       data: result.rows,
//       msg: "Update Product Success",
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({
//       msg: "Internal Server Error cuy",
//     });
//   }
// };

// const updateProducts = async (req, res) => {
//   try {
//     let fileLink = req.body.image;
//     if (req.file !== undefined) {
//       fileLink = `/images/${req.file.filename}`;
//     }
//     const { params, body } = req;
//     const result = await productsModel.updateProducts(params, body, fileLink);
//     res.status(200).json({
//       data: result.rows,
//       msg: "Product updated successfully",
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({
//       msg: "Internal Server Error",
//     });
//   }
// };

const updateProducts = async (req, res) => {
  try {
    let fileLink;
    if (req.file) {
      // Unggah file ke cloud
      const cloudResult = await cloudUpload(req, res, {
        prefix: "product",
        id: req.params.id,
      });
      fileLink = cloudResult.secure_url;
    }

    const { params, body } = req;
    if (!fileLink && !body.name && !body.price) {
      // Jika tidak ada perubahan yang diberikan, maka kembalikan response kosong
      return res.status(200).json({
        data: [],
        msg: "Tidak ada perubahan yang dilakukan",
      });
    }
    const result = await productsModel.updateProducts(params, body, fileLink); // sertakan fileLink pada pemanggilan productModel.updateProducts
    res.status(200).json({
      data: result.rows,
      msg: "Update Berhasil",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const deleteProducts = async (req, res) => {
  try {
    const { params } = req;
    // eslint-disable-next-line no-unused-vars
    const result = await productsModel.deleteProducts(params);
    return res.status(200).json({
      data: result.rows,
      msg: "Product Deleted",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const patchImageProducts = async (req, res) => {
  const fileLink = `/images/${req.file.filename}`;
  console.log(fileLink);
  try {
    const result = await productsModel.updateImageProducts(
      fileLink,
      req.params.id
    );
    res.status(200).json({
      data: result.rows,
      msg: "Success Updating Image",
    });
  } catch (err) {
    console.log(err);
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
  patchImageProducts,
  cloudUpload,
};

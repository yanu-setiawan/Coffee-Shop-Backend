const promoModel = require("../models/promo.model");

const getPromo = async (req, res) => {
  try {
    const { query } = req;
    const result = await promoModel.getPromo(query);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "Promo not found",
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

const getPromoDetail = async (req, res) => {
  try {
    const { params } = req;
    const result = await promoModel.getPromoDetail(params);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "Promo not found",
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

// const insertPromo = async (req, res) => {
//   try {
//     const { body } = req;
//     const result = await promoModel.insertPromo(body);
//     res.status(202).json({
//       data: result.rows,
//       msg: "Create Promo Success",
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({
//       msg: "Internal Server Error cuy",
//     });
//   }
// };

const insertPromo = async (req, res) => {
  try {
    const { body } = req;
    const result = await promoModel.insertPromo(body);
    res.status(201).json({
      msg: "Add Data Promo Success...",
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Internal Server Error...",
      error: err.message,
    });
  }
};

// const updatePromo = async (req, res) => {
//   try {
//     const { params, body } = req;
//     const result = await promoModel.updatePromo(params, body);
//     res.status(201).json({
//       data: result.rows,
//       msg: "Update Promo Success",
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({
//       msg: "Internal Server Error cuy",
//     });
//   }
// };
const updatePromo = async (req, res) => {
  try {
    const { params, body } = req;
    const result = await promoModel.updatePromo(params, body);
    if (result.rowCount === 0) {
      res.status(404).json({
        msg: `Edit Fail... ID ${params.promoId} Not Found...`,
      });
      return;
    }
    res.status(200).json({
      msg: "Edit Data Promo Success...",
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Internal Server Error...",
      data: err.detail,
    });
  }
};
const deletePromo = async (req, res) => {
  try {
    const { params } = req;
    const result = await promoModel.deletePromo(params);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "Promo not found",
      });
    }
    res.status(200).json({
      msg: "Promo Deleted",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  getPromo,
  getPromoDetail,
  insertPromo,
  updatePromo,
  deletePromo,
};

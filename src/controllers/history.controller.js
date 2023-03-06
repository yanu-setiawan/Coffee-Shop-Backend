const historyModel = require("../models/history.model");

// const getHistory = (req, res) => {
//   historyModel
//     .getHistory()
//     .then((result) => {
//       res.status(200).json({
//         data: result.rows,
//       });
//     })
//     .catch((err) => {
//       console.log(err.message);
//       res.status(500).json({
//         msg: "Internal Server Error",
//       });
//     });
// };

const getHistory = async (req, res) => {
  try {
    const { query } = req;
    const result = await historyModel.getHistory(query);
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

const getHistoryDetail = async (req, res) => {
  try {
    const { params } = req;
    const result = await historyModel.getHistoryDetail(params);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "History not found",
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

const insertHistory = async (req, res) => {
  try {
    const { body } = req;
    const result = await historyModel.insertHistory(body);
    res.status(201).json({
      data: result.rows,
      msg: "Create Success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error cuy",
    });
  }
};

const updateHistory = async (req, res) => {
  try {
    const { params, body } = req;
    const result = await historyModel.updateHistory(params, body);
    res.status(201).json({
      data: result.rows,
      msg: "Update Success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error cuy",
    });
  }
};

const deleteHistory = async (req, res) => {
  try {
    const { params } = req;
    const result = await historyModel.deleteHistory(params);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "History not found",
      });
      return;
    }
    res.status(200).json({
      msg: "History Deleted",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  getHistory,
  getHistoryDetail,
  insertHistory,
  updateHistory,
  deleteHistory,
};

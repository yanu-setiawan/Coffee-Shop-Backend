/* eslint-disable no-unused-vars */
const db = require("../configs/postgre");
const transactionsModel = require("../models/transactions.model");

// create transaction
// 1. insert ke transaction
// 2. insert detail
const createTransaction = async (req, res) => {
  const { authInfo, body } = req;
  //   res.status(200).json({
  //     ...body,
  //   });
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await transactionsModel.createTransaction(
      client,
      body,
      authInfo.id
    );
    const transactionId = result.rows[0].id;
    await transactionsModel.createDetailTransaction(
      client,
      body,
      transactionId
    );
    await client.query("COMMIT");
    const transactionWithDetail = await transactionsModel.getTransaction(
      client,
      transactionId
    );
    client.release();
    res.status(200).json({
      data: transactionWithDetail.rows,
      msg: "OK",
    });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    client.release();
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const { authInfo } = req;
    const result = await transactionsModel.getHistories(authInfo);
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal Server Error...",
    });
  }
};

const deleteTransaction = async (req, res) => {
  const client = await db.connect();
  try {
    client.query("BEGIN");
    const result = await transactionsModel.deleteHistory(client, req);
    // if (result.rowCount === 0) {
    //   res.status(404).json({
    //     msg: "Data Not Found...",
    //   });
    //   return;
    // }
    client.query("COMMIT");
    const resultAll = await transactionsModel.deleteTransaction(client, req);
    // if (resultAll.rowCount === 0) {
    //   res.status(404).json({
    //     msg: "Data Not Found...",
    //   });
    //   return;
    // }
    res.status(200).json({
      msg: "Delete Success...",
    });
  } catch (err) {
    console.log(err);
    client.query("ROLLBACK");
    res.status(500).json({
      msg: "Internal Server Error...",
    });
  }
};

module.exports = { createTransaction, getHistory, deleteTransaction };

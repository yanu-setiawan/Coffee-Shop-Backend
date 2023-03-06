const path = require("path");
const welcomePage = (req, res) => {
  // res.json({
  //   msg: "Selamat Datang di Toko Kopi API",
  // });
  res.status(200).sendFile(path.join(__dirname, "../html/welcome.html"));
};

module.exports = {
  welcomePage, // welcomePage
};

const cloudinary = require("../configs/cloudinary");
const path = require("path");
const dataUriParser = require("datauri/parser");

const uploader = async (req, prefix, id) => {
  const { file } = req;
  if (!file) return { data: null };

  // mendapatkan buffer dari multer
  const buffer = file.buffer;
  const ext = path.extname(file.originalname).toString();
  // buffer konversi menjadi datauri
  const parser = new dataUriParser();
  const datauri = parser.format(ext, buffer);
  const fileName = `${prefix}-${file.fieldname}-${id}`;

  try {
    // upload ke cloudinary
    const result = await cloudinary.uploader.upload(datauri.content, {
      public_id: fileName,
      folder: "coffee-shop",
    });
    return { data: result, msg: "OK" };
  } catch (err) {
    return { data: null, msg: "Upload Failed", err };
  }
};

module.exports = { uploader };

const path = require("path");
const fs = require("fs");
const config = require("../config");
const Product = require("./model");

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let targetPath = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(targetPath);

      src.pipe(dest);

      src.on("end", async () => {
        try {
          let product = new Product({ ...payload, image_url: filename });
          await product.save();
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(targetPath);
          if (err && err.name === "ValidationEror") {
            return res.json({
              eror: 1,
              message: err.message,
              fields: err.erors,
            });
          }
          next(err);
        }
      });
      src.on("eror", async () => {
        next(err);
      });
    } else {
      let product = new product(payload);
      await product.save();
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === "ValidationEror") {
      return res.json({
        eror: 1,
        message: err.message,
        fields: err.erors,
      });
    }
    next(err);
  }
};
const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let { id } = req.params;
    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      let filename = req.file.filename + "." + originalExt;
      let targetPath = path.resolve(
        config.rootPath,
        `public/images/products/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(targetPath);

      src.pipe(dest);

      src.on("end", async () => {
        try {
          let product = await Product.findById(id);
          let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }
          product = await Product.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
          });
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(targetPath);
          if (err && err.name === "ValidationEror") {
            return res.json({
              eror: 1,
              message: err.message,
              fields: err.erors,
            });
          }
          next(err);
        }
      });
      src.on("eror", async () => {
        next(err);
      });
    } else {
      let product = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === "ValidationEror") {
      return res.json({
        eror: 1,
        message: err.message,
        fields: err.erors,
      });
    }
    next(err);
  }
};
const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;
    let products = await Product.find()
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return res.json(products);
  } catch (err) {
    next(err);
  }
};

// Impor modul 'fs' hanya jika belum diimpor sebelumnya
if (!global.fs) {
  global.fs = require("fs").promises; // Menggunakan fs.promises untuk operasi berbasis promise
}

const destroy = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const currentImage = path.join(
      config.rootPath,
      "public",
      "images",
      "products",
      product.image_url
    );

    try {
      await fs.unlink(currentImage);
    } catch (unlinkErr) {
      // Tangani error jika penghapusan gagal
      console.error("Error deleting image:", unlinkErr);
    }

    return res.json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = { destroy };

module.exports = {
  store,
  index,
  update,
  destroy,
};

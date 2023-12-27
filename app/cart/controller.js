const Product = require("../product/model");
const CartItem = require("../cart-item/model");

const update = async (req, res, next) => {
  try {
    const { items } = req.body;
    const productIds = items.map((item) => item.product._id);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      // Menangani produk yang tidak ditemukan
      const foundProductIds = products.map((product) => product._id.toString());
      const missingProductIds = productIds.filter(
        (productId) => !foundProductIds.includes(productId.toString())
      );

      return res.json({
        error: 1,
        message: `Products not found for IDs: ${missingProductIds.join(", ")}`,
      });
    }

    let CartItem = items.map((item) => {
      let relatedProduct = products.find(
        (product) => product._id.toString() === item.product._id
      );

      return {
        product: relatedProduct._id,
        price: relatedProduct.price,
        image_url: relatedProduct.image_url,
        name: relatedProduct.name,
        user: req.user._id,
        qty: item.qty,
      };
    });

    // Menghapus item keranjang belanja yang ada untuk pengguna tertentu
    await CartItem.deleteMany({ user: req.user._id });

    // Menyimpan atau memperbarui item keranjang belanja yang baru
    await CartItem.bulkWrite(
      cartItems.map((item) => {
        return {
          updateOne: {
            filter: {
              user: req.user._id,
              product: item.product,
            },
            update: item,
            upsert: true,
          },
        };
      })
    );

    // Memberikan respons yang sesuai
    res.json(CartItems);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    } else {
      // Menangani kesalahan umum
      res.status(500).json({
        error: 1,
        message: "Internal Server Error",
      });
    }
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    let items = await CartItem.find({ user: req.user._id }).populate("product");
    return res.json(items);
  } catch (err) {
    if (err && err.name == "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

module.exports = {
  update,
  index,
};

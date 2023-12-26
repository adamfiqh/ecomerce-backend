const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const orderItemSchema = Schema({
  name: {
    type: String,
    minlength: [5, "Panjang nama makanan minimal 50 karakter"],
    required: [true, "Name must be filled"],
  },
  price: {
    type: Number, // Tambahkan tipe data untuk price, bisa diisi dengan tipe yang sesuai seperti Number
    required: [true, "harga item harus di isi"], // Misalnya, defaultnya adalah 0
  },
  qty: {
    type: Number, // Tambahkan tipe data untuk qty, bisa diisi dengan tipe yang sesuai seperti Number
    required: [true, " kuantitas harus di isi"],
    min: [1, " kuantitas minimal 1"],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
});

module.exports = model("OrderItem", orderItemSchema);

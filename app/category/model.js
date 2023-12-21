const mongoose = require("mongoose");
const { model, Schema } = mongoose;

let categorySchema = Schema({
  name: {
    type: String,
    minlength: [3, "panjang nama kategori min 3 karakter"],
    maxlength: [20, "panjang nama kategori max 20 karakter"],
    required: [true, "nama kategori harus diisi"],
  },
});

module.exports = model("Category", categorySchema);

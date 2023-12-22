const mongoose = require("mongoose");
const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const AutoIncrement = require("mongoose-sequence")(mongoose);

let userSchema = Schema(
  {
    full_name: {
      type: String,
      required: [true, "nama harus diisi"],
      maxlength: [255, "panjang nama harus antara 3 - 255 karakter"],
      minlength: [3, "panjang nama harus 3 - 255 karakter"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "email harus diisi"],
      maxlength: [255, "panjang email maksimal 255"],
    },
    password: {
      type: String,
      required: [true, "password harus diisi"],
      maxlength: [255, "panjang password maksimal 255 karakter"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  {
    timestamps: true,
  }
);

// Validate email format
userSchema.path("email").validate(
  function (value) {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} harus diisi dengan email yang benar!`
);

// Validate unique email in the database
userSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("User").countDocuments({ email: value });
      return count === 0;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `${attr.value} email sudah terdaftar`
);

const HASH_ROUND = 10;
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

module.exports = model("User", userSchema);

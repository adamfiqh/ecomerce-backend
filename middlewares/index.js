const { getToken, policyFor } = require("../utils");
const jwt = require("jsonwebtoken");
const config = require("../app/config"); // Gantilah ini sesuai struktur proyek Anda
const User = require("../app/user/model");

function decodeToken() {
  return async function (req, res, next) {
    try {
      const token = getToken(req);
      if (!token) return next();

      req.user = jwt.verify(token, config.secretKey); // Sesuaikan secretKey dengan struktur proyek Anda

      let user = await User.findOne({ token: { $in: [token] } });
      if (!user) {
        return res.json({
          error: 1,
          message: "Token expired",
        });
      }

      // Jika Anda ingin melanjutkan ke middleware atau rute berikutnya,
      // Anda perlu memanggil next() di sini
      next();
    } catch (err) {
      if (err && err.name === "JsonWebTokenError") {
        return res.json({
          error: 1,
          message: err.message,
        });
      }

      // Tangani kesalahan dekode token
      return res.status(401).json({ error: 1, message: "Tidak diizinkan" });
    }
  };
}

function police_check(action, subject) {
  return function (req, res, next) {
    let policy = policyFor(req.user);
    if (!policy.can(action, subject)) {
      return res.json({
        error: 1,
        message: ` you are not allowed to ${action}${subject}`,
      });
    }
    next();
  };
}

module.exports = {
  decodeToken,
  police_check,
};

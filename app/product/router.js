const router = require("express").Router();
const multer = require("multer");
const os = require("os");
const { policy_check } = require("../../middlewares");
const productController = require("./controller");

router.get("/products", productController.index);
router.post(
  "/products",
  multer({ dest: os.tmpdir() }).single("image"),
  policy_check("create", "Product"),
  productController.store
);
router.put(
  "/products/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  policy_check("update", "Product"),
  policy_check("delete", "Product"),
  productController.update
);
router.delete("/products/:id", productController.destroy);
module.exports = router;

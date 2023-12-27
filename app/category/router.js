const router = require("express").Router();
const { policy_check } = require("../../middlewares");
const categoryController = require("./controller");

router.get("/categories", categoryController.index);
router.post(
  "/categories",
  policy_check("create", "Category"),
  categoryController.store
);
router.put(
  "/categories/:id",
  policy_check("update", "Category"),
  categoryController.update
);
router.delete(
  "/categories/:id",
  policy_check("delete", "Category"),
  categoryController.destroy
);

module.exports = router;

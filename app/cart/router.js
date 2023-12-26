const express = require("express");
const { policy_check } = require("../../middlewares");
const cartItemController = require("./controller");

const router = express.Router();

// Update cart items
router.put(
  "/cart-items",
  policy_check("update", "cartitem"),
  cartItemController.update
);

// Get cart items
router.get(
  "/cart-items",
  policy_check("read", "cartitem"),
  cartItemController.index
);

module.exports = router;

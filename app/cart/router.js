// D:\2023\server-eduwork\app\cart\router.js

const express = require("express");
const { policy_check } = require("../../middlewares");
const cartItemController = require("./controller");

const router = express.Router();

// Update cart items
router.put(
  "/cart-items",
  policy_check("update", "CartItems"),
  cartItemController.update
);

// Get cart items
router.get(
  "/cart-items",
  policy_check("read", "CartItems"),
  cartItemController.index
);

module.exports = router;

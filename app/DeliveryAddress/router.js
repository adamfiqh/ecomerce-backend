const { policy_check } = require("../../middlewares");
const deliveryAddressController = require("./controller");

const router = require("express").Router();
router.get(
  "/delivery-addresses",
  policy_check("read", "DeliveryAddress"),
  deliveryAddressController.index
);
router.post(
  "/delivery-addresses",
  policy_check("create", "DeliveryAddress"),
  deliveryAddressController.store
);
router.put(
  "/delivery-addresses/:id",
  policy_check("update", "DeliveryAddress"),
  deliveryAddressController.update
);
router.delete(
  "/delivery-addresses/:id",
  policy_check("delete", "DeliveryAddress"),
  deliveryAddressController.destroy
);

module.exports = router;

const DeliveryAddress = require("./model");

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let user = req.user;

    let address = await new DeliveryAddress({ ...payload, user: user._id });
    await address.save();

    res.status(201).json(address);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};
const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let addressId = req.params.id;
    let user = req.user;

    let address = await DeliveryAddress.findOneAndUpdate(
      { _id: addressId, user: user._id },
      payload,
      { new: true, runValidators: true }
    );

    if (!address) {
      return res.status(404).json({ error: 1, message: "Address not found" });
    }

    return res.json(address);
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    let addressId = req.params.id;
    let user = req.user;

    let address = await DeliveryAddress.findOneAndDelete({
      _id: addressId,
      user: user._id,
    });

    if (!address) {
      return res.status(404).json({ error: 1, message: "Address not found" });
    }

    return res.json(address);
  } catch (err) {
    next(err);
  }
};
const index = async (req, res, next) => {
  try {
    let user = req.user;
    let addresses = await DeliveryAddress.find({ user: user._id });

    return res.json(addresses);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  store,
  update,
  destroy,
  index,
};

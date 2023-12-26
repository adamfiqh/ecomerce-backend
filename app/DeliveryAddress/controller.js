const { policyFor } = require("../../utils");
const DeliveryAddress = require("./model");
const { subject } = require("@casl/ability");

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let user = req.user;

    let address = new DeliveryAddress({ ...payload, user: user._id });
    await address.save();

    res.status(201).json(address);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.status(422).json({
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
    let { _id, ...payload } = req.body;
    let { id } = req.params;
    let address = await DeliveryAddress.findById(id);
    let subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: address.user,
    });

    let policy = policyFor(req.user);
    if (!policy.can("update", subjectAddress)) {
      return res.status(403).json({
        error: 1,
        message: `You are not allowed to modify this resource`,
      });
    }

    address = await DeliveryAddress.findByIdAndUpdate(id, payload, {
      new: true,
    });
    res.json(address);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.status(422).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    let { id } = req.params;
    let user = req.user;

    let address = await DeliveryAddress.findOneAndDelete({
      _id: id,
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

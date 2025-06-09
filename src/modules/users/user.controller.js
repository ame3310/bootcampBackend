const { User } = require("./user.model");
const Order = require("../orders/order.model");
const Product = require("../products/product.model");
const bcrypt = require("bcrypt");
const { AppError } = require("../../middlewares/error-handler");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "userName", "email", "role"],
      include: [
        {
          model: Order,
          as: "orders",
          include: [
            {
              model: Product,
              as: "products",
              through: { attributes: ["quantity", "price"] },
            },
          ],
        },
      ],
    });

    if (!user) return next(new AppError("Usuario no encontrado", 404));
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) return next(new AppError("Usuario no encontrado", 404));

    if (userName) user.userName = userName;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ message: "Perfil actualizado correctamente" });
  } catch (err) {
    next(err);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return next(new AppError("Usuario no encontrado", 404));

    await user.destroy();
    res.json({ message: "Perfil eliminado correctamente" });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "userName", "role"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
};

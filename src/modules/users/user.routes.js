const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
} = require("./user.controller");

const requireAuth = require("../../middlewares/requireAuth.middleware");
const requireAdmin = require("../../middlewares/requireAdmin.middleware");
const autoRefresh = require("../../middlewares/autoRefresh.middleware");
const validate = require("../../middlewares/validate.middleware");
const { updateUserSchema } = require("./user.validation");

router.use(autoRefresh);
router.use(requireAuth);

router.get("/profile", getProfile);
router.put("/profile", validate(updateUserSchema), updateProfile);
router.delete("/profile", deleteProfile);
router.get("/", requireAdmin, getAllUsers);

module.exports = router;

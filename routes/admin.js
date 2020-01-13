const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/admin');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

// const advancedFuncs = require('../middleware/advancedFuncs');
const advancedFuncs = require('../middleware/functions');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(advancedFuncs(User), getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;

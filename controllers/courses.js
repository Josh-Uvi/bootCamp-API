const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const errorHandler = require('../utils/errorHandler');
const asyncHandler = require('../middleware/async');

//setup middleware functions for routes

// @desc    GET ALL COURSES
// @routes  GET /api/v1/courses
// @routes  GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  //check course by id
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return (
      res.status(200),
      json({
        success: true,
        count: courses.length,
        data: courses
      })
    );
  } else {
    res.status(200).json(res.advancedFuncs);
  }
});

// @desc    GET SINGLE COURSE
// @routes  GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  //query db to find single course
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  //check if course id exist
  if (!course) {
    return next(
      new errorHandler(`No Course with the id of ${req.params.id}`),
      404
    );
  }

  //send query result to frontend
  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    ADD COURSE
// @routes  POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  //add the bootcampId to the bootcamp field
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  //query db to find single bootcamp
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  //check if bootcamp id exist
  if (!bootcamp) {
    return next(
      new errorHandler(`No bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }

  //make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new errorHandler(
        `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
        401
      )
    );
  }

  //create new course
  const course = await Course.create(req.body);

  //send query result to frontend
  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    UPDATE COURSE
// @routes  PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  //query db to find single bootcamp
  let course = await Course.findById(req.params.id);

  //check if course id exist in db
  if (!course) {
    return next(
      new errorHandler(`No course with the id of ${req.params.id}`),
      404
    );
  }

  //make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new errorHandler(
        `User ${req.user.id} is not authorized to update course ${course._id}`,
        401
      )
    );
  }

  //update course
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  //send query result to frontend
  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    DELETE COURSE
// @routes  DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  //query db to find single bootcamp
  const course = await Course.findById(req.params.id);

  //check if course id exist in db
  if (!course) {
    return next(
      new errorHandler(`No course with the id of ${req.params.id}`),
      404
    );
  }

  //make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new errorHandler(
        `User ${req.user.id} is not authorized to delete course ${course._id}`,
        401
      )
    );
  }

  //delete course
  await Course.deleteOne();

  //send query result to frontend
  res.status(200).json({
    success: true,
    data: {}
  });
});

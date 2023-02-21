const User = require("./../models/userModel"); 
const catchAsync = require("./../utils/catchAsync");



exports.getAllUsers = catchAsync(async function (req, res,next) {
    const users = await User.find();
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users: users
        }

    });

   
});
exports.getUser = function (req, res) {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    });
};
exports.createUser = function (req, res) {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    });
};
exports.updateUser = function (req, res) {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    });
};
exports.deleteUser = function (req, res) {
    res.status(500).json({
        status: "error",
        message: "This route is not yet defined"
    });
};
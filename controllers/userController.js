import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";


// Authentication
export const signup = catchAsyncError(async (req, res, next) => {
    const { name, userName, email, password } = req.body;

    if (!name || !userName || !email || !password) {
        return next(new ErrorHandler("Please enter all field", 400));
    }

    let user = await User.findOne({ email });
    let UserName = await User.findOne({ userName });
    if (user) return next(new ErrorHandler("User Already Exist", 409));
    if (UserName) return next(new ErrorHandler("User Name Already Exist", 409));

    user = await User.create({
        name,
        userName,
        email,
        password,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const options = {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        // httpOnly: true,
        // secure: true,
        sameSite: "none",
    };
    res.status(201).cookie("token", token, options).json({
        success: true,
        message: "Registered Successfully"
    });

})

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return next(new ErrorHandler("Enter all fileds", 400));

    const user = await User.findOne({ email, password });

    if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    const options = {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        // httpOnly: true,
        // secure: true,
        sameSite: "none",
    };

    res.status(200).cookie("token", token, options).json({
        success: true,
        message: "Logged In Successfully"
    });

})

export const logout = catchAsyncError(async (req, res, next) => {
    const options = {
        expires: new Date(Date.now()),
        // httpOnly: true,
        // secure: true,
        sameSite: "none",
    };

    res.status(200).cookie("token", null, options).json({
        success: true,
        message: "Logged Out Successfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user,
    });
});


// Tasks

export const createTask = catchAsyncError(async (req, res, next) => {

    const { title, description, dueDate, isCompleted } = req.body;

    if (!title || !description || !dueDate) return next(new ErrorHandler("Please add all fields", 400));

    const user = await User.findById(req.user._id);

    user.tasks.unshift({
        title,
        description,
        dueDate,
        isCompleted
    });

    await user.save();

    res.status(201).json({
        success: true,
        message: "Task Added Successfully",
    });

});

export const getMyAllTasks = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user._id);
    const tasks = user.tasks;

    res.status(201).json({
        success: true,
        message: `${tasks.length} record found`,
        tasks
    });

});

export const updateTasks = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { title, description, dueDate, isCompleted } = req.body;
    const user = await User.findById(req.user._id);

    const taskIndex = user.tasks.findIndex(task => task._id.toString() === id.toString());

    if (taskIndex === -1) {
        return next(new ErrorHandler("Task Not Found", 404));
    }

    if (title) user.tasks[taskIndex].title = title;
    if (description) user.tasks[taskIndex].description = description;
    if (dueDate) user.tasks[taskIndex].dueDate = dueDate;
    if (isCompleted) user.tasks[taskIndex].isCompleted = isCompleted;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Task Updated Successfully"
    });

});

export const deleteTask = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    user.tasks = user.tasks.filter((item) => {
        if (item._id.toString() !== id.toString()) return item;
    });

    await user.save();

    res.status(200).json({
        success: true,
        message: "Task Deleted Successfully"
    });
});




//Admin
export const getAllUser = catchAsyncError(async (req, res, next) => {
    const user = await User.find().select("-email");

    res.status(200).json({
        success: true,
        message: `${user.length} record found`,
        user,
    });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler("User not found", 404));


    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: `User Deleted Successfully `,
    });

});
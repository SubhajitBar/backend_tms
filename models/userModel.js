import mongoose from "mongoose";


const userSchema = await mongoose.Schema({
    name: {
        type: String,
        require: [true, "Enter Your Name"]
    },
    userName: {
        type: String,
        unique: [true, "User name should be unique"],
        require: [true, "Enter unique user name "],
    },
    email: {
        type: String,
        require: [true, "Enter your email"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        require: [true, "Enter your password"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false,
    },

    tasks: [
        {
            title: String,
            description: String,
            dueDate: Date,
            isCompleted: {
                type: Boolean,
                default: false
            }
        },
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export const User = mongoose.model("User", userSchema);
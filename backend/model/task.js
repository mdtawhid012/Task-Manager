import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true 
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    status: {
        type: Boolean,
        default: false
    }
})

export const Task = mongoose.model("Task", taskSchema);
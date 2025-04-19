import express from "express";
import jwt from "jsonwebtoken";
import { connectDB } from "./db/db.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "./model/user.js";
import { authMiddleware } from "./middleware/auth.js";
import { Task } from "./model/task.js";

dotenv.config();
const app = express();

app.use(express.json());

connectDB();

app.post("/api/auth/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;

    if (!username || !password || !name){
        res.status(400).send({ 
            message: "Username, password, and name are required." 
        });
    }

    try {
        const existingUser = await User.findOne({username});

        if (existingUser) {
            res.status(403).send("User already exists...")
        };

        const hashedPass = await bcrypt.hash(password, 10);

        const user = await User.create(
            {
                username,
                password: hashedPass,
                name
            }
        );

        res.status(200).send({
            message: "User created",
            user
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: "Error creating user.",
        })
    }
})

app.post("/api/auth/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await User.findOne({username});

        if (!user) {
            res.status(400).send({
                message: "User does not exist."
            })
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            return res.status(400).send({
                message: "Invalid password."
            })
        }

        const token = jwt.sign({
            userID: user._id
        }, process.env.JWT_SECRET)

        res.status(200).send({
            message: "You are logged in.",
            token
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: "Error logging user.",
        })
    }
})

app.post("/api/tasks", authMiddleware, async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;

    try {
        const task = await Task.create({
            title,
            description,
            user: req.user.userID
        });
    
        res.status(200).send({
            task
        })
    } catch (error) {
        res.status(500).send({
            message: "Error creating a task."
        })
    }
});

app.get("/api/tasks", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({user: req.user.userID});
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send({
            message: "Error fetching tasks."
        })
    }
});

app.put("/api/tasks/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            {_id: req.params.id, user: req.user.userID},
            req.body,
            {new: true}
        );

        if (!task){
            res.status(400).send({
                message: "Task not found."
            })
        };
        res.status(200).send({
            message: "Task updated."
        });
    } catch (error) {
        res.status(500).send({
            message: "Error updating task."
        })
    }
});

app.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, user: req.user.userID})
        
        if (!task){
            res.status(400).send({
                message: "task not found."
            })
        }
        res.status(200).send({
            message: "task deleted."
        })
    } catch (error) {
        res.status(500).send({
            message: "Error deleting task"
        })
    }
});

app.listen(3000, () => {
    console.log("listening on port 3000...")
})

const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const test = (req, res) => {
    res.json("test is working");
};

const registerUser = async (req, res) => {
    try {
        const {
            name,
            lastName,
            phone,
            address,
            city,
            country,
            postalCode,
            birthday,
            email,
            password,
        } = req.body;

        if (!name) {
            return res.json({
                error: "Name is required",
            });
        }

        if (!password || password.length < 6) {
            return res.json({
                error: "Password is required and should be at least 6 characters long",
            });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.json({
                error: "Email is already taken",
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            userID: uuidv4(),
            name,
            lastName,
            phone,
            address,
            city,
            country,
            postalCode,
            birthday,
            email,
            isAdmin: false,
            password: hashedPassword,
        });

        return res.json(user);
    } catch (error) {
        console.log(error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: "User not found",
            });
        }

        const match = await comparePassword(password, user.password);
        if (match) {
            jwt.sign(
                {
                    email: user.email,
                    userID: user.userID,
                    name: user.name,
                    lastName: user.lastName,
                    phone: user.phone,
                    address: user.address,
                    city: user.city,
                    country: user.country,
                    postalCode: user.postalCode,
                    birthday: user.birthday,
                    isAdmin: user.isAdmin,
                },
                process.env.JWT_SECRET,
                {},
                (err, token) => {
                    if (err) throw err;
                    res.cookie("token", token).json(user);
                }
            );
        } else {
            return res.json({
                error: "Incorrect password",
            });
        }
    } catch (error) {
        console.log(error);
        return res.json({
            error: "Something went wrong",
        });
    }
};

const getProfile = async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            try {
                const user = await User.findOne({ userID: decoded.userID });
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }
                res.json(user);
            } catch (error) {
                console.error("Error fetching profile:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    } else {
        res.status(401).json({ error: "No token provided" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.log(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userID } = req.params;
        const user = await User.findOneAndDelete({ userID });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
};

const logout = (req, res) => {
    res.cookie("token", "").json(true);
};

const updateProfile = async (req, res) => {
    try {
        const {
            name,
            lastName,
            phone,
            address,
            city,
            country,
            postalCode,
            birthday,
            email,
        } = req.body;
        const { id } = req.params;

        const user = await User.findOne({ userID: id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        Object.assign(user, {
            name,
            lastName,
            phone,
            address,
            city,
            country,
            postalCode,
            birthday,
            email,
        });

        await user.save();
        res.json(user);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    getUsers,
    logout,
    deleteUser,
    updateProfile,
};

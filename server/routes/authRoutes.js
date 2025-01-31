const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
    test,
    registerUser,
    loginUser,
    getProfile,
    getUsers,
    logout,
    deleteUser,
    updateProfile,
} = require("../controllers/authController");

const PORT = process.env.REACT_APP_PORT;

router.use(
    cors({
        credentials: true,
        origin: `http://localhost:${PORT}`,
    })
);

router.get("/", test);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.get("/users", getUsers);
router.post("/logout", logout);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateProfile);

module.exports = router;

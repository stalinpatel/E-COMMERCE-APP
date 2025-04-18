import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redish } from "../lib/redish.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redish.set(`refresh_token:${userId}`, refreshToken);
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //PREVENT XSS ATACKS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevent CSRF attack,cross site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, //15 mins 15 * 60 * 1000
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //PREVENT XSS ATACKS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevent CSRF attack,cross site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    console.log("Signup endpoint hit by user :", name);

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const user = await User.create({ name, email, password });
    // AUTHENTICATE USER
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
    setTimeout(() => {
      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }, 3000);
  } catch (error) {
    console.log("Error in signup controller ", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Login endpoint hit by user :", email);
    const user = await User.findOne({ email });

    // CHECK IF USER EXISTS OR NOT
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // IF USER EXISTS CHECK IF PASSWORD IS CORRECT
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // AUTHENTICATE USER
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    setTimeout(() => {
      res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }, 1000);
  } catch (error) {
    console.log("Error in login controller ", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res, next) => {
  console.log("logout endpoint hit");

  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redish.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Loggedout Successfully" });
  } catch (error) {
    console.log("Error in logout controller ", error.message);

    res.status(500).json({ message: "Server Error ," + error.message });
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redish.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ message: "Token refreshed Successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    return res.status(500).json({ message: "Server Error ," + error.message });
  }
};

export const getProfile = async (req, res, next) => {
  console.log("getProfile hitted");
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "No access token found. Login again " });
    }
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired access token." });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Authentication successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error in getProfile controller", error.message);
    return res.status(500).json({ message: "Server error," + error.message });
  }
};

// TODO : Implement the axiox interceptors for refreshing the access token

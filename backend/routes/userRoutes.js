import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import {generateToken, isAuth, sendEmail} from "../utils.js";
import crypto from 'crypto';
import dotenv from "dotenv"
import Token from "../models/tokenModel.js";

dotenv.config();


const userRouter = express.Router();

const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};



userRouter.post("/signin",
  expressAsyncHandler(async (req, res) => {
    // console.log(req.body);
    const user = await User.findOne({ email: req.body.email });
    // console.log(user);
    if (user) {
      // console.log(`body pass = ${req.body.password}`);
      // console.log(`db pass = ${user.password}`);
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          jwtToken: generateToken(user),
        });
        return;
      }
    }

    res.status(401).send({ message: "invalid email or password" });
  })
);

userRouter.post("/signup",
  expressAsyncHandler(async (req, res) => {
    // console.log(req.body);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    // console.log(user);
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      jwtToken: generateToken(user),
    });
  })
);

userRouter.put("/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // console.log(req.body);
    const user =  await User.findById(req.user._id)
    if(user){
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if(req.body.password){
        user.password = bcrypt.hashSync(req.body.password, 8)
      }
      const updatedUser = await user.save();
      // console.log(user);
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        jwtToken: generateToken(updatedUser),
      });

    }
    else{
      res.status(404).send({message: 'User not found'})
    }
  })
);

userRouter.post("/forgot-password",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (user) {
        // Delete existing tokens
        let token = await Token.findOne({ userId: user._id });
        if (token) await token.deleteOne();

        // Generate new reset token
        const resetToken = generateResetToken();
        const hashToken = bcrypt.hashSync(resetToken);

        // Save new token
        await new Token({
          userId: user._id,
          token: hashToken,
          createdAt: Date.now(),
        }).save();

        // Construct reset link
        const link = `http://localhost:3000/reset-password?token=${resetToken}&id=${user._id}`;

        // Send email and wait for the result
        const emailResult = await sendEmail(user.email, 'Password Reset', link);

        // Check the result of sending the email
        if (emailResult instanceof Error) {
          // Handle email sending error
          res.status(500).send({ message: 'Error sending reset email' });
        } else {
          // Email sent successfully
          res.status(200).send({ message: 'Password reset email sent successfully', link });
        }
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    } catch (error) {
      // Handle other errors
      res.status(500).send({ message: 'Internal server error' });
    }
  })
);

userRouter.post("/reset-password",
  expressAsyncHandler(async (req, res) => {
    const { userId, token, password } = req.body;
    console.log(req.body);

    try {
      // Validate the token
      const storedToken = await Token.findOne({ userId});
      // console.log(storedToken.token);
      if (!storedToken || !bcrypt.compareSync(token, storedToken.token)) {
        return res.status(400).send({ message: 'Invalid or expired reset token' });
      }

      // Reset the password
      const user = await User.findById(userId);
      user.password = bcrypt.hashSync(password);
      await user.save();

      // Delete the used token
      await storedToken.deleteOne();

      return res.status(200).send({ message: 'Password reset successfully' });
    } catch (error) {
      // Handle other errors
      console.error(error);
      return res.status(500).send({ message: 'Internal server error' });
    }
  })
);



export default userRouter;

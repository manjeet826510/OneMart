import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

export const generateToken = (user) => {
  return jwt.sign(
    //payload object
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    //signing payload object
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
    //return a token string
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    if (authorization === "RazorPay") {
      return;
    }
    const token = authorization.slice(7, authorization.length); //Bearer XXXXXX
    // console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      // decode = payload object which passed while signing jwt
      if (err) {
        // console.log("inside err");
        res.status(401).send({ message: "Invalid Token" });
      } else {
        // console.log(decode); decode = { userInfo }
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

export const isAdmin = (req, res, next)=>{
  // console.log("checking isAdmin");
  if(req.user && req.user.isAdmin){
    next();
  }
  else{
    res.status(401).send({"message": "Invalid Admin Token"})
  }
}


export const sendEmail = async (email, subject, payload) => {
  try {
    // create reusable transporter object using the default SMTP transport

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: subject,
      text: `Click the following link to reset your password: ${payload}`,
    };



    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return error;
      } else {
        return res.status(200).json({
          success: true,
        });
      }
    });
  } 
  catch (error) {
    return error;
  }
};

  
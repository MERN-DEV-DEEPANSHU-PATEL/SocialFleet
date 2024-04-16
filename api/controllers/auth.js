import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtp, verifyOtp } from "../utils/otp.js";

export const register = (req, res) => {
  const { username, password, email, name, otp} = req.body; // object destructuring
  console.log(req.body);
  try {
    // CHECK IF USER EXISTS
    const {isVerify,msg} = verifyOtp(otp,email)
    if (isVerify) {
      db.execute(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, results) => {
          if (err) {
            console.error("Error checking user while register controller:");
            console.log(err);
            return res.status(500).json({ msg: "internal server error" });
          }
          if (results.length > 0) {
            // If user exists with the provided username
            return res
              .status(409)
              .json({ msg: "User already exists with username" });
          }
          db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email],
            (err, results) => {
              if (err) {
                console.error("Error checking user while register controller:");
                console.log(err);
                return res.status(500).json({ msg: "internal server error" });
              }
              if (results.length > 0) {
                // If user exists with the provided email
                return res
                  .status(409)
                  .json({ msg: "User already exists with Email" });
              }
  
              // CREATE A NEW USER
              // Hash the password
              const saltRounds = 10;
              bcrypt.hash(password, saltRounds, (hashErr, hashedPassword) => {
                if (hashErr) {
                  console.error(
                    "Error hashing password while Register controller:",
                    hashErr
                  );
                  return res.status(500).json({ msg: "internal server error" });
                }
                db.execute(
                  "INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)",
                  [username, email, hashedPassword, name],
                  (insertErr) => {
                    if (insertErr) {
                      console.error(
                        "Error while register controller creating user:"
                      );
                      console.log(insertErr);
                      return res
                        .status(500)
                        .json({ msg: "internal server error" });
                    }
                    return res
                      .status(200)
                      .json({ msg: "Register Successful......." });
                  }
                );
              });
            }
          );
        }
      );
    }else{
      res.status(400).json({msg})
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json("There is an internal server error");
  }
};

export const login = (req, res) => {
  const username = req.body.username;
  console.log(req.body);
  try {
    db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, results) => {
        if (err) {
          console.log("Error While Login Controller");
          console.log(err);
          return res.status(500).json({ msg: "internal server error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ msg: "User not found!" });
        }

        const checkPassword = bcrypt.compareSync(
          req.body.password,
          results[0].password
        );

        if (!checkPassword) {
          return res
            .status(400)
            .json({ msg: "Username and password does not match" });
        }
        const token = jwt.sign(results[0], "secretkey");
        const { password, ...others } = results[0];
        res.status(200).json({ token, ...others });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json("There is an internal server error");
  }
};

//THIS CAN BE HANDLE ON FRONTEND

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true, // Enable this if your application uses HTTPS
      sameSite: "none", // Adjust this based on your requirements
    })
    .status(200)
    .json("User has been logged out.");
};

export const SendOtp = async (req, res) => {
  const {username,email}= req.query
  db.execute(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error checking user while register controller:");
        console.log(err);
        return res.status(500).json({ msg: "internal server error" });
      }
      if (results.length > 0) {
        // If user exists with the provided username
        return res
          .status(409)
          .json({ msg: "User already exists with username" });
      }
      db.execute(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async(err, results) => {
          if (err) {
            console.error("Error checking user while register controller:");
            console.log(err);
            return res.status(500).json({ msg: "internal server error" });
          }
          if (results.length > 0) {
            // If user exists with the provided email
            return res
              .status(409)
              .json({ msg: "User already exists with Email" });
              
          }else{
            try {
              console.log("start otp");
              const status = await sendOtp(req.query.email);
              if (status.isSuccess) {
                return res.status(200).send(status.msg);
              } else {
                console.log("OTP Sending failed");
                return res.status(500).send(status.msg);
              }
            } catch (error) {
              console.error("Error sending OTP:", error);
              return res.status(500).json({ error: error.message });
            }
          }
        }
      );
    }
  );
};


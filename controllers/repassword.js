const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const bcrypt = require('bcrypt');
const db = require("../db");
const otpSecrets = {};

// Send OTP by Email
async function sendOTPViaEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MYGMAIL,
            pass: process.env.MYPASS,
        },
    });

    const mailOptions = {
        from: process.env.MYGMAIL,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is: ${otp}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

function generateOTP(secret) {
    return speakeasy.totp({
        secret: secret,
        encoding: process.env.ENCODE,
        step: 120,
    });
}

function verifyOTP(email, otp) {
    const secret = otpSecrets[email];
    if (!secret) {
        return false;
    }
    return speakeasy.totp.verify({
        secret: secret,
        encoding: process.env.ENCODE,
        token: otp,
        step: 120,
    });
}

function storeOTPSecret(email, secret) {
    otpSecrets[email] = secret;
}

// OTP to Email
exports.SendOTP = async (req, res) =>{
    const { email } = req.body;
    const secret = speakeasy.generateSecret().base32;
    otpSecrets[email] = secret; // เก็บ OTP secret ของผู้ใช้
    const otp = generateOTP(secret);
  
    try{
        await sendOTPViaEmail(email, otp);
        //res.redirect(200,'/repassword');
        //res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
  };
  
  //confirm OTP
  exports.VerifyOTP= async (req, res) => {
    const { email, otp } = req.body;
    const isValid = verifyOTP(email, otp);
  
    if (isValid) {
        res.status(200).json({ message: 'OTP verification successful' });
    } else {
        res.status(400).json({ error: `Invalid OTP ${email},${otp}` });
    }
  };

// New Password 
exports.NewPassword = async (req, res) => {
    const { newPassword, confirmPassword, username } = req.body;
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match" });
    }

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const name = username;
        const sql = "UPDATE users SET password = ? WHERE username = ?";
        db.query(
            sql,
            [hashedPassword, name],
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Error occurred while updating password.",
                        error: err,
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: `User not found. ${username}${newPassword}${confirmPassword}` });
                }

                res.status(200).json({ message: "Password updated successfully." });
            }
        );
    } catch (error) {

        res.status(500).json({
            message: "Error occurred while processing the request.",
            error: error,
        });
    }
};
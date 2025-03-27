const jwt = require("jsonwebtoken");
const { isJwt } = require("validator");
const { configDotenv } = require("dotenv");
const { Email } = require("../model/index");
const { createTransport } = require("nodemailer");

configDotenv();

const validatorAccess = async (req, res, next) => {
  try {
    const authorization = req.get("authorization")?.split(" ")[1];
    if (!authorization) {
      return res.status(401).json({
        error: "JWT 유효성 검증 실패"
      });
    }
    if (!isJwt(authorization)) {
      return res.status(401).json({
        error: "JWT 유효성 검증 실패"
      });
    }

    const salt = process.env.SECRET_OR_PRIVATE;

    req.payload = jwt.verify(authorization, salt, {
      algorithms: "HS256"
    });

    next();
  } catch (e) {
    console.error(e);
    return res.status(400).json({
      error: e
    });
  }
};

const validateWithMail = async (req, res) => {
  const emailId = process.env.EMAIL_ID;
  const emailPw = process.env.EMAIL_PW;

  const { email } = req.body;
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const transport = createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: emailId,
      pass: emailPw
    }
  });

  try {
    const random = Math.random().toString(36).substring(2, 9);

    await Email.create({
      email: email,
      code: random,
      expiresAt: expiresAt
    });
    await transport.sendMail({
      from: emailId,
      to: email,
      subject: "Lendy 이메일 인증 번호입니다",
      text: `인증번호는 ${random}입니다\n10분 안에 입력해주세요`
    });

    return res.status(200).json({
      message: "인증 메일이 발송되었습니다"
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "메일을 전송하지 못했습니다"
    });
  }
};

module.exports = {
  validatorAccess,
  validateWithMail
};

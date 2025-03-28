const { configDotenv } = require("dotenv");
const { createTransport } = require("nodemailer");
const { checkMailRegex } = require("../../utils/regex");

configDotenv();

const sendMail = async (req, res) => {
  const emailId = process.env.EMAIL_ID;
  const emailPw = process.env.EMAIL_PW;

  const { email } = req.body;

  if (!checkMailRegex(email)) {
    return res.status(400).json({
      message: "이메일 양식 오류"
    });
  }

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

    await transport.sendMail({
      from: emailId,
      to: email,
      subject: "Lendy 이메일 인증 번호입니다",
      text: `인증번호는 ${random}입니다\n10분 안에 입력해주세요`
    });

    return res.status(200).json({
      code: random,
      message: "인증 메일이 발송되었습니다"
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "메일 전송에 실패하였습니다"
    });
  }
};

module.exports = sendMail;

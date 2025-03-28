const { User } = require("../model/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { redisCli } = require("../redis");
const { checkUserIdRegex } = require("../utils/regex");

const validateId = async (req, res) => {
  const { userId } = req.body;

  if (!checkUserIdRegex(userId)) {
    return res.status(400).json({
      message: "아이디 양식 오류"
    });
  }
  try {
    const thisIdUser = await User.findOne({ where: { userId } });

    if (!thisIdUser) {
      return res.status(200).json({
        message: "사용 가능한 아이디입니다"
      });
    } else {
      return res.status(409).json({
        message: "이미 가입된 아이디입니다"
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: e
    });
  }
};

module.exports = {
  validateId
};

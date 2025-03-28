const checkUserIdRegex = (userId) => {
  const userIdPattern = /^[a-zA-Z0-9]{6,20}$/;
  return userIdPattern.test(userId);
};

const checkMailRegex = (mail) => {
  const mailPattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  return mailPattern.test(mail);
};

module.exports = {
  checkUserIdRegex,
  checkMailRegex
};

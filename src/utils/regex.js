const checkUserIdRegex = (userId) => {
  const userIdPattern = /^[a-zA-Z0-9]{6,20}$/;
  return userIdPattern.test(userId);
};

module.exports = {
  checkUserIdRegex
};

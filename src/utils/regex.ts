export const checkMailRegex = (email: string): boolean => {
  const emailPattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
  return email.length <= 32 && emailPattern.test(email);
};

export const checkPasswordRegex = (password: string): boolean => {
  const passwordPattern = /^[\w!@#$%^&*]{8,20}$/;
  return passwordPattern.test(password);
};

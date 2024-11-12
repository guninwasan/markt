const passwordCheck = (password: string) => {
  const isAtLeast8Chars = password.length >= 8;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&#-]/.test(password);

  return (
    isAtLeast8Chars &&
    hasLowerCase &&
    hasUpperCase &&
    hasNumber &&
    hasSpecialChar
  );
};

export { passwordCheck };

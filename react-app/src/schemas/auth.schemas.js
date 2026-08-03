export const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email address',
    },
  },
  password: {
    required: 'Password is required',
  },
  passwordWithMin: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters',
    },
  },
  confirmPassword: {
    required: 'Please confirm your password',
  },
  phoneNumber: {
    pattern: {
      value: /^\+?1?\d{9,15}$/,
      message: 'Phone number must be in format: +999999999 (up to 15 digits)',
    },
  },
};

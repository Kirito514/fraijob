// Input validation utilities

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  // Kamida 8 ta belgi, katta va kichik harflar, raqam
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return {
    isValid: minLength && hasUpper && hasLower && hasNumber,
    errors: {
      minLength: !minLength ? 'Password must be at least 8 characters' : null,
      hasUpper: !hasUpper ? 'Password must contain uppercase letter' : null,
      hasLower: !hasLower ? 'Password must contain lowercase letter' : null,
      hasNumber: !hasNumber ? 'Password must contain number' : null
    }
  };
}

export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return `${fieldName} is required`;
  }
  return null;
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // XSS himoyasi uchun HTML taglarni olib tashlash
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

export function validateJobData(data) {
  const errors = {};
  
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Job title is required';
  }
  
  if (!data.company || data.company.trim().length === 0) {
    errors.company = 'Company name is required';
  }
  
  if (data.salary && data.salary.length > 50) {
    errors.salary = 'Salary field is too long';
  }
  
  if (data.location && data.location.length > 100) {
    errors.location = 'Location field is too long';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validatePortfolioData(data) {
  const errors = {};
  
  if (data.name && data.name.length > 100) {
    errors.name = 'Name is too long';
  }
  
  if (data.bio && data.bio.length > 500) {
    errors.bio = 'Bio is too long';
  }
  
  if (data.email && !validateEmail(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
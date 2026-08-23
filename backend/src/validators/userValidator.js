const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateUsername(username) {
  const errors = [];

  if (username === undefined || username === null || username === '') {
    errors.push('Username is required.');
    return errors;
  }

  if (typeof username !== 'string') {
    errors.push('Username must be a string.');
    return errors;
  }

  const trimmed = username.trim();

  if (trimmed.length < 3) errors.push('Username must be at least 3 characters.');
  if (trimmed.length > 30) errors.push('Username must be at most 30 characters.');

  return errors;
}

function validateEmail(email) {
  const errors = [];

  if (!email) {
    errors.push('Email is required.');
    return errors;
  }

  if (typeof email !== 'string') {
    errors.push('Email must be a string.');
    return errors;
  }

  const trimmed = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmed)) errors.push('Email must be a valid email address.');

  return errors;
}

function validatePassword(password) {
  const errors = [];

  if (!password) {
    errors.push('Password is required.');
    return errors;
  }

  if (typeof password !== 'string') {
    errors.push('Password must be a string.');
    return errors;
  }

  if (password.length < 8) errors.push('Password must be at least 8 characters.');

  return errors;
}

function validateRole(role) {
  const errors = [];
  const allowed = ['user', 'admin'];

  // role is optional (defaults to 'user'), only validate if provided
  if (role !== undefined && !allowed.includes(role)) {
    errors.push(`Role must be one of: ${allowed.join(', ')}.`);
  }

  return errors;
}

function validateAvatar(avatar) {
  const errors = [];

  // avatar is optional
  if (avatar !== undefined && avatar !== null && typeof avatar !== 'string') {
    errors.push('Avatar must be a string (URL) or null.');
  }

  return errors;
}

/**
 * Validates a full user payload (e.g. signup).
 * @param {object} data
 * @returns {{ valid: boolean, errors: object }}
 */
function validateUser(data = {}) {
  const errors = {};

  const username = validateUsername(data.username);
  const email = validateEmail(data.email);
  const password = validatePassword(data.password);

  if (username.length) errors.username = username;
  if (email.length) errors.email = email;
  if (password.length) errors.password = password;

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validates a partial payload (e.g. PATCH/update) — only checks fields present.
 * @param {object} data
 * @returns {{ valid: boolean, errors: object }}
 */
function validateUserUpdate(data = {}) {
  const errors = [];

  if (data.username !== undefined) {
    const e = validateUsername(data.username);
    if (e.length) errors.username = e;
  }
  if (data.email !== undefined) {
    const e = validateEmail(data.email);
    if (e.length) errors.email = e;
  }
  if (data.password !== undefined) {
    const e = validatePassword(data.password);
    if (e.length) errors.password = e;
  }
  if (data.role !== undefined) {
    const e = validateRole(data.role);
    if (e.length) errors.role = e;
  }
  if (data.avatar !== undefined) {
    const e = validateAvatar(data.avatar);
    if (e.length) errors.avatar = e;
  }

  return { valid: errors.length === 0, errors };
}

function validateSignIn(data = {}){

  const errors = [];

    const usernameErrors = validateUsername(data.username);
    errors.push(...usernameErrors);
    const passwordErrors = validatePassword(data.password);
    errors.push(...passwordErrors);

  return { valid: errors.length === 0, errors };
}

function validateSignUp(data = {}){

  const errors =[];

  if(data.password !== data.confirmPassword){
    errors.push("Password mismatched");
  }
  
    const usernameErrors = validateUsername(data.username);
    errors.push(...usernameErrors);

    const emailErrors = validateEmail(data.email);
    errors.push(...emailErrors);

    const passwordErrors = validatePassword(data.password);
    errors.push(...passwordErrors);
    
  return { valid: errors.length === 0, errors };
}

function validateUserMiddleware(req, res, next) {
  const { valid, errors } = validateUser(req.body);
  if (!valid) return res.status(400).json({ errors });
  next();
}

function validateUserUpdateMiddleware(req, res, next) {
  const { valid, errors } = validateUserUpdate(req.body);
  if (!valid) return res.status(400).json({ errors });
  next();
}

function validateSignInMiddleware(req, res, next){
  const {valid, errors} = validateSignIn(req.body); 
  if (!valid) return res.status(400).json({ valid, errors });
  next();
}

function validateSignUpMiddleware(req, res, next){
  const {valid, errors} = validateSignUp(req.body); 
  if (!valid) return res.status(400).json({ errors }); 
  next();
}

module.exports = {
  validateSignUpMiddleware,
  validateSignInMiddleware,
  validateUser,
  validateUserUpdate,
  validateUserMiddleware,
  validateUserUpdateMiddleware,
};
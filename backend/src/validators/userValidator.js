const { z } = require('zod');

const requiredString = (label) =>
  z.string({
    error: (issue) => issue.input === undefined || issue.input === null
      ? `${label} is required.`
      : `${label} must be a string.`
  });

// ---------- Fields ----------

const usernameSchema = requiredString('Username').trim().superRefine((username, ctx) => {
  if (!username) {
    ctx.addIssue({ code: 'custom', message: 'Username is required.' });
    return;
  }
  if (username.length < 3) {
    ctx.addIssue({ code: 'custom', message: 'Username must be at least 3 characters.' });
  }
  if (username.length > 30) {
    ctx.addIssue({ code: 'custom', message: 'Username must be at most 30 characters.' });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Username may only contain letters, numbers and underscores.'
    });
  }
});

const emailSchema = requiredString('Email').trim().toLowerCase().superRefine((email, ctx) => {
  if (!email) {
    ctx.addIssue({ code: 'custom', message: 'Email is required.' });
    return;
  }
  if (email.length > 254) {
    ctx.addIssue({ code: 'custom', message: 'Email must be at most 254 characters.' });
  }
  if (!z.email().safeParse(email).success) {
    ctx.addIssue({ code: 'custom', message: 'Email must be a valid email address.' });
  }
});

// bcrypt ignores bytes past 72; use 128 if you switch to argon2
const PASSWORD_MAX_BYTES = 72;

const passwordSchema = requiredString('Password').superRefine((password, ctx) => {
  if (!password) {
    ctx.addIssue({ code: 'custom', message: 'Password is required.' });
    return;
  }
  if (password.length < 8) {
    ctx.addIssue({ code: 'custom', message: 'Password must be at least 8 characters.' });
  }
  if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
    ctx.addIssue({
      code: 'custom',
      message: `Password must be at most ${PASSWORD_MAX_BYTES} bytes.`
    });
  }
});

// Sign-in: don't enforce the signup policy, so policy changes never lock out old accounts
const signInUsernameSchema = requiredString('Username').trim()
  .min(1, 'Username is required.')
  .max(30, 'Invalid credentials.');

const signInPasswordSchema = requiredString('Password')
  .min(1, 'Password is required.')
  .max(128, 'Invalid credentials.');

const roleSchema = z.enum(['user', 'admin'], {
  error: 'Role must be one of: user, admin.'
});

const avatarSchema = z
  .url({
    protocol: /^https?$/,
    error: 'Avatar must be a valid http(s) URL or null.'
  })
  .max(2048, 'Avatar URL must be at most 2048 characters.')
  .nullable();

// ---------- Schemas (strict: unknown keys are rejected) ----------

const signInSchema = z.strictObject({
  username: signInUsernameSchema,
  password: signInPasswordSchema
});

const signUpSchema = z.strictObject({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string({ error: 'Password mismatched' })
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      path: ['confirmPassword'],
      message: 'Password mismatched'
    });
  }
});

const userSchema = z.strictObject({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema
});

// Self-service update: no role
const userUpdateSchema = z.strictObject({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  avatar: avatarSchema.optional()
});

// Admin-only update: adds role
const adminUpdateSchema = userUpdateSchema.extend({
  role: roleSchema.optional()
});

// ---------- Core validate ----------

// Always returns { valid, errors, data }.
// errors: array of messages when arrayErrors is true, otherwise { field: [messages] }.
function validate(schema, data, arrayErrors = false) {
  const result = schema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: arrayErrors ? [] : {}, data: result.data };
  }

  if (arrayErrors) {
    return { valid: false, errors: result.error.issues.map((i) => i.message), data: null };
  }

  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] || 'body';
    (errors[field] ||= []).push(issue.message);
  }
  return { valid: false, errors, data: null };
}

const validateUser = (data = {}) => validate(userSchema, data);
const validateUserUpdate = (data = {}) => validate(userUpdateSchema, data);
const validateAdminUpdate = (data = {}) => validate(adminUpdateSchema, data);
const validateSignIn = (data = {}) => validate(signInSchema, data, true);
const validateSignUp = (data = {}) => validate(signUpSchema, data, true);

// ---------- Middleware ----------

// Replaces req.body with the parsed output (trimmed, lowercased, unknown keys gone)
function makeMiddleware(validator, transform = (d) => d) {
  return (req, res, next) => {
    const { valid, errors, data } = validator(req.body);
    if (!valid) return res.status(400).json({ errors });
    req.body = transform(data);
    next();
  };
}

const validateUserMiddleware = makeMiddleware(validateUser);
const validateUserUpdateMiddleware = makeMiddleware(validateUserUpdate);
const validateAdminUpdateMiddleware = makeMiddleware(validateAdminUpdate);
const validateSignInMiddleware = makeMiddleware(validateSignIn);
const validateSignUpMiddleware = makeMiddleware(validateSignUp, ({ confirmPassword, ...rest }) => rest);

module.exports = {
  validateSignUpMiddleware,
  validateSignInMiddleware,
  validateUser,
  validateUserUpdate,
  validateAdminUpdate,
  validateUserMiddleware,
  validateUserUpdateMiddleware,
  validateAdminUpdateMiddleware
};
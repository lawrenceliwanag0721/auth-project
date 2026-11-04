const { z } = require('zod');

const usernameSchema = z.string({
  error: (issue) => issue.input === undefined || issue.input === null
    ? 'Username is required.'
    : 'Username must be a string.'
}).trim().superRefine((username, context) => {
  if (!username) {
    context.addIssue({ code: 'custom', message: 'Username is required.' });
  } else {
    if (username.length < 3) {
      context.addIssue({
        code: 'custom',
        message: 'Username must be at least 3 characters.'
      });
    }
    if (username.length > 30) {
      context.addIssue({
        code: 'custom',
        message: 'Username must be at most 30 characters.'
      });
    }
  }
});

const emailSchema = z.string({
  error: (issue) => issue.input === undefined || issue.input === null
    ? 'Email is required.'
    : 'Email must be a string.'
}).trim().superRefine((email, context) => {
  if (!email) {
    context.addIssue({ code: 'custom', message: 'Email is required.' });
  } else if (!z.email().safeParse(email).success) {
    context.addIssue({
      code: 'custom',
      message: 'Email must be a valid email address.'
    });
  }
});

const passwordSchema = z.string({
  error: (issue) => issue.input === undefined || issue.input === null
    ? 'Password is required.'
    : 'Password must be a string.'
}).superRefine((password, context) => {
  if (!password) {
    context.addIssue({ code: 'custom', message: 'Password is required.' });
  } else if (password.length < 8) {
    context.addIssue({
      code: 'custom',
      message: 'Password must be at least 8 characters.'
    });
  }
});

const roleSchema = z.enum(['user', 'admin'], {
  error: 'Role must be one of: user, admin.'
});

const avatarSchema = z.string({
  error: 'Avatar must be a string (URL) or null.'
}).nullable();

const signInSchema = z.object({
  username: usernameSchema,
  password: passwordSchema
});

const signUpSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string({
    error: 'Password mismatched'
  })
}).catchall(z.unknown()).superRefine((data, context) => {
  if (data.password !== data.confirmPassword) {
    context.addIssue({
      code: 'custom',
      path: ['confirmPassword'],
      message: 'Password mismatched'
    });
  }

  if (Object.keys(data).some((key) => ![
    'username',
    'email',
    'password',
    'confirmPassword'
  ].includes(key))) {
    context.addIssue({
      code: 'custom',
      message: 'invalid fields found'
    });
  }
});

const userSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema
});

const userUpdateSchema = z.strictObject({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  role: roleSchema.optional(),
  avatar: avatarSchema.optional()
});

function validate(schema, data, arrayErrors = false) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { valid: true, errors: arrayErrors ? [] : {} };
  }

  if (arrayErrors) {
    return {
      valid: false,
      errors: result.error.issues.map((issue) => issue.message)
    };
  }

  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] || 'body';
    if (!errors[field]) errors[field] = [];
    errors[field].push(issue.message);
  }
  return { valid: false, errors };
}

function validateUser(data = {}) {
  return validate(userSchema, data);
}

function validateUserUpdate(data = {}) {
  return validate(userUpdateSchema, data);
}

function validateSignIn(data = {}) {
  return validate(signInSchema, data, true);
}

function validateSignUp(data = {}) {
  return validate(signUpSchema, data, true);
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

function validateSignInMiddleware(req, res, next) {
  const { valid, errors } = validateSignIn(req.body);
  if (!valid) return res.status(400).json({ valid, errors });
  next();
}

function validateSignUpMiddleware(req, res, next) {
  const { valid, errors } = validateSignUp(req.body);
  if (!valid) return res.status(400).json({ errors });
  next();
}

module.exports = {
  validateSignUpMiddleware,
  validateSignInMiddleware,
  validateUser,
  validateUserUpdate,
  validateUserMiddleware,
  validateUserUpdateMiddleware
};

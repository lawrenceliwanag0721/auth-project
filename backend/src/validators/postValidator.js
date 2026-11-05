const { z } = require('zod');

const postUpdateSchema = z.strictObject({
  title: z.string().trim().min(1, 'Title is required.').max(200).optional(),
  content: z.string().trim().min(1, 'Content is required.').optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Provide a title or content to update.',
});

function validatePostUpdateMiddleware(req, res, next) {
  const result = postUpdateSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues.map((issue) => issue.message),
    });
  }

  req.body = result.data;
  next();
}

module.exports = { validatePostUpdateMiddleware };

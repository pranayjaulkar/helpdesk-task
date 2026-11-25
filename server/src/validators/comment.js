const { z } = require('zod');

const createComment = z.object({
  message: z.string().trim().min(1, 'Comment cannot be empty').max(2000),
});

module.exports = { createComment };

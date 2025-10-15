import { ZodError, ZodType } from 'zod';
import type { Context, Next } from 'hono';
import sanitizeHtml from 'sanitize-html';

function sanitizeInput<T>(input: T): T {
  if (typeof input === 'string') {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: 'discard'
    }) as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item)) as T;
  }

  if (input && typeof input === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized as T;
  }

  return input;
}

export const validateMiddleware =
  <T>(schema: ZodType<T>, type: 'json' | 'query' | 'param' = 'json') =>
  async (c: Context, next: Next) => {
    try {
      const raw =
        type === 'json'
          ? await c.req.json()
          : type === 'query'
          ? Object.fromEntries(c.req.query() ?? [])
          : c.req.param();

      const sanitized = sanitizeInput(raw);
      const parsed = schema.parse(sanitized);
      c.set('validated', parsed);

      await next();
    } catch (err) {
      if (err instanceof ZodError) {
        return c.json(
          {
            error: 'ValidationError',
            issues: err.issues.map((i) => ({
              path: i.path.join('.'),
              message: i.message
            }))
          },
          400
        );
      }

      throw err;
    }
  };

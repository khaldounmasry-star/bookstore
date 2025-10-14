import { ZodError, ZodType } from 'zod';
import type { Context, Next } from 'hono';
import sanitizeHtml from 'sanitize-html';

/**
 * Recursively sanitizes all string fields in an object or array.
 */
function sanitizeInput<T>(input: T): T {
  if (typeof input === 'string') {
    // remove all HTML/script tags entirely, not escape them
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

/**
 * Hono middleware: sanitize + validate + attach parsed data
 */
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

      // 🧼 sanitize before validation
      const sanitized = sanitizeInput(raw);

      // ✅ validate sanitized object
      const parsed = schema.parse(sanitized);

      // store validated + clean data for use in handler
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

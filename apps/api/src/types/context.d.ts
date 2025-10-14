// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Context } from 'hono';

declare module 'hono' {
  interface ContextVariableMap {
    validated: unknown; // you can narrow it later per route if needed
  }
}
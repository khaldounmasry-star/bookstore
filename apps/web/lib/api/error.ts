export interface ValidationIssue {
  path: string | string[];
  message: string;
}

export class ApiError extends Error {
  status: number;
  issues?: ValidationIssue[];

  constructor(status: number, message: string, issues?: ValidationIssue[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.issues = issues;
  }

  isValidationError(): boolean {
    return this.status === 400 && Array.isArray(this.issues);
  }

  isAuthorisationError(): boolean {
    return this.status === 401;
  }

  isNotFoundError(): boolean {
    return this.status === 404;
  }

  isServerError(): boolean {
    return this.status > 500;
  }
}

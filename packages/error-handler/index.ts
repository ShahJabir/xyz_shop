export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: Record<string, unknown> | string | number | null;
  constructor(message: string, statusCode: number, isOperational = true, details?: Record<string, unknown> | string | number | null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}

// Not Found Error
export class NotFoundError extends AppError {
  constructor(message = "Resources not found") {
    super(message, 404);
  }
}

//  validation Error
export class ValidationError extends AppError {
  constructor(message = "Invalid request data", details?: Record<string, unknown> | string | number | null) {
    super(message, 400, true, details);
  }
}

//  Authentication Error
export class AuthenticationError extends AppError {
  constructor(message = "Unauthorizes") {
    super(message, 401);
  }
}

//  Forbidden Error
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden access") {
    super(message, 403);
  }
}

// Database Error
export class DatabaseError extends AppError {
  constructor(message = "Database error", details?: Record<string, unknown> | string | number | null) {
    super(message, 500, true, details);
  }
}



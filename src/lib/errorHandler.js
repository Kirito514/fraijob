// Centralized error handling

export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export function handlePrismaError(error) {
  console.error('Prisma Error:', error);
  
  if (error.code === 'P2002') {
    return new AppError('Bu ma\'lumot allaqachon mavjud', 409);
  }
  
  if (error.code === 'P2025') {
    return new AppError('Ma\'lumot topilmadi', 404);
  }
  
  if (error.code === 'P2003') {
    return new AppError('Bog\'liq ma\'lumot topilmadi', 400);
  }
  
  return new AppError('Database xatosi', 500);
}

export function handleJWTError(error) {
  console.error('JWT Error:', error);
  
  if (error.name === 'JsonWebTokenError') {
    return new AppError('Noto\'g\'ri token', 401);
  }
  
  if (error.name === 'TokenExpiredError') {
    return new AppError('Token muddati tugagan', 401);
  }
  
  return new AppError('Authentication xatosi', 401);
}

export function sendErrorResponse(error, res) {
  // Development muhitida to'liq error ma'lumotini yuborish
  if (process.env.NODE_ENV === 'development') {
    return res.status(error.statusCode || 500).json({
      error: error.message,
      stack: error.stack,
      details: error
    });
  }
  
  // Production muhitida faqat xabar yuborish
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }
  
  // Kutilmagan xatolar uchun umumiy xabar
  return res.status(500).json({
    error: 'Tizimda xatolik yuz berdi'
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
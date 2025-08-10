// Simple logging utility

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  info(message, data = null) {
    if (this.isDevelopment) {
      console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data || '');
    }
  }

  error(message, error = null) {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error || '');
  }

  warn(message, data = null) {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, data || '');
    }
  }

  debug(message, data = null) {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, data || '');
    }
  }

  // API request logging
  logRequest(req, res, next) {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      this.info(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    
    if (next) next();
  }

  // Database query logging
  logQuery(query, params = null) {
    if (this.isDevelopment) {
      this.debug(`DB Query: ${query}`, params);
    }
  }
}

export const logger = new Logger();
export default logger;
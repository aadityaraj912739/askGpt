import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import AppError from '../utils/appError.js'

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return next(new AppError('The user belonging to this token does not exist.', 401));
      }

      next()
    } catch (error) {
      return next(new AppError('Not authorized, token failed', 401))
    }
  }

  if (!token) {
    return next(new AppError('Not authorized, no token', 401))
  }
}

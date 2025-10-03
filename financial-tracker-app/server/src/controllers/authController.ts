import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { body, validationResult } from 'express-validator';
import { logUserActivity } from '../services/userActivityService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validation rules
export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
    });

    await user.save();

    // Log user registration activity
    await logUserActivity({
      userId: (user._id as any).toString(),
      action: 'register',
      details: 'New user account created',
      newData: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      req,
    });

    // Generate JWT token
    const userId = (user._id as any).toString();
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Log failed login attempt
      await logUserActivity({
        userId: email, // Use email as identifier for failed attempts
        action: 'failed_login',
        details: `Failed login attempt for email: ${email}`,
        success: false,
        errorMessage: 'User not found',
        req,
      });
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Log failed login attempt
      await logUserActivity({
        userId: (user._id as any).toString(),
        action: 'failed_login',
        details: `Failed login attempt - invalid password`,
        success: false,
        errorMessage: 'Invalid password',
        req,
      });
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Log successful login
    await logUserActivity({
      userId: (user._id as any).toString(),
      action: 'login',
      details: 'User logged in successfully',
      req,
    });

    // Generate JWT token
    const userId = (user._id as any).toString();
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestUserId = (req as any).userId;
    const user = await User.findById(requestUserId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const userId = (user._id as any).toString();
    res.status(200).json({
      user: {
        id: userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

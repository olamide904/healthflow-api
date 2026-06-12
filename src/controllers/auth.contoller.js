import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Guardian from '../models/guardian.model.js';

// Generate JWT

const generateToken = (guardian) => {
  return jwt.sign(
    {
      id:    guardian._id,
      role:  guardian.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};



// Register a new guardian/doctor/nurse
export const registerGuardian = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, specialisation } = req.body;

    // Check if guardian already exists
    const existingGuardian = await Guardian.findOne({ email });
    if (existingGuardian) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create guardian
    const guardian = new Guardian({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      specialisation,
    });
    await guardian.save();

    res.status(201).json({
      message: 'Account created successfully.',
      guardian: {
        id:           guardian._id,
        firstName:    guardian.firstName,
        lastName:     guardian.lastName,
        email:        guardian.email,
        role:         guardian.role,
        specialisation: guardian.specialisation,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login a guardian and return JWT

export const loginGuardian = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check both fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find guardian and Check if guardian exists
    const guardian = await Guardian.findOne({ email }).select('+password');

    if (!guardian) {
      return res.status(401).json({ message: 'User does not exist.' });
    }

     // Check account is active
    if (!guardian.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact support.' });
    }


    // Compare password
    const isMatch = await bcrypt.compare(password, guardian.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
   
   
    // Generate token
    const token = generateToken(guardian);

    res.status(200).json({
      message: 'Login successful.',
      token,
      guardian: {
        id:        guardian._id,
        firstName: guardian.firstName,
        lastName:  guardian.lastName,
        email:     guardian.email,
        role:      guardian.role,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


// Get currently logged in guardian

export const getGuardian = async (req, res, next) => {
  try {
    const guardian = await Guardian.findById(req.user.id);

    if (!guardian) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    res.status(200).json({ guardian });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

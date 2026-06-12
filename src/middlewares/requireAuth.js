import jwt from 'jsonwebtoken';
import Guardian from '../models/guardian.model.js';
import DeviceSession from '../models/deviceSession.model.js';


// Verify JWT — protects all routes that require authentication
export const requireAuth = async (req, res, next) => {
  try {
    // 1. Check token exists in header
    const authHeader = req.header('Authorization');
    if(!authHeader || !authHeader.startsWith('Bearer ') ) 
         return res.status(401).json({ error: 'Access denied, no token' });

    // 2. Extract token
    const token = authHeader.split(' ')[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach decoded payload to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};


// Role guard — restricts routes to specific roles. Usage: requireRole('doctor', 'nurse')
export const requireRoleAuth = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}.`,
      });
    }

    next();
  };
};


// Device auth — for smartwatch requests only
// Devices send a deviceToken instead of a JWT

export const requireDeviceAuth = async (req, res, next) => {
  try {
   const authHeader = req.header('Authorization');
    if(!authHeader || !authHeader.startsWith('Bearer ') ) 
         return res.status(401).json({ error: 'Access denied, no device token' });

const deviceToken = authHeader.split(' ')[1]; 
console.log(deviceToken)

// Look up device by token 
const device = await DeviceSession.findOne({ deviceToken, isActive: true }).select('+deviceToken');
    if (!device) {
      return res.status(401).json({ error: 'Invalid or inactive device token.' });
    }
    console.log(device)

    // Update heartbeat
    device.lastHeartbeatAt = new Date();
    await device.save();

    // Attach device to request
    req.device = device;

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Device authentication error.' });
  }
};

import jwt from 'jsonwebtoken';

export function authenticate(req) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.log('No Authorization header found');
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No token found in Authorization header');
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    console.log('Token decoded:', decoded);
    return decoded;
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return null;
  }
}
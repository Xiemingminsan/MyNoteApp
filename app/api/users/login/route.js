import jwt from 'jsonwebtoken';
import dbConnect from '../../../../dbConnect';
import User from '../../../../models/User';

export async function POST(req) {
  await dbConnect();
  const { username, password } = await req.json();

  // Find the user in the database
  const user = await User.findOne({ username });

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 401 });
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = user.password === password;

  if (!isPasswordValid) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user._id, username: user.username }, 'your_jwt_secret', {
    expiresIn: '1h',
  });

  return new Response(JSON.stringify({ token }), { status: 200 });
}

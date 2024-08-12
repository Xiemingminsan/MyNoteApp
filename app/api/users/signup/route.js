// app/api/users/signup/route.js


import dbConnect from '../../../../dbConnect';
import User from '../../../../models/User';

export async function POST(req) {
  await dbConnect();

  const { username, password } = await req.json();

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Username already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    return new Response(JSON.stringify({ message: 'User created successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

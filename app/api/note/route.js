  // app/api/note/route.js
  import { authenticate } from '../../../auth.js';
  import dbConnect from '../../../dbConnect';
  import Note from '../../../models/Note';

  export async function POST(req) {
    await dbConnect();
    const auth = authenticate(req);
    if (!auth) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const { title, description } = await req.json();

    try {
      const existingNote = await Note.findOne({ title });
      if (existingNote) {
        return new Response(JSON.stringify({ message: 'Note with this title already exists' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const newNote = new Note({ title, description, user: auth.userId});
      await newNote.save();

      return new Response(JSON.stringify({ message: 'Note created successfully' }), {
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

  export async function GET(req) {  
      await dbConnect();
      const auth = authenticate(req);
      if (!auth) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
      try {
        const notes = await Note.find({ user: auth.userId }); // Fetch only the user's notes
        return new Response(JSON.stringify(notes), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({
            message: "Internal Server Error",
            error: error.message,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
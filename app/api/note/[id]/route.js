import dbConnect from "../../../../dbConnect";
import { authenticate } from "../../../../auth";
import Note from "../../../../models/Note";

export async function GET(req, { params }) {
  const { id } = params;
  console.log('Received ID:', id);

  await dbConnect();
  const user = authenticate(req);
  if (!user) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const note = await Note.findOne({ _id: id, userId: user.id }); 
    console.log('Retrieved Note iss:', note);

    if (!note) {
      return new Response(JSON.stringify({ message: 'Note not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(note), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log('Error querying the note:', error.message);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { title, description } = await req.json();

  await dbConnect();
  const user = authenticate(req);
  if (!user) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      { _id: id, userId: user.id },
      { title, description },
      { new: true }
    );

    if (!updatedNote) {
      return new Response(JSON.stringify({ message: 'Note not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Note updated successfully', note: updatedNote }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log('Error updating the note:', error.message);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  await dbConnect();
  const user = authenticate(req);
  if (!user) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const deletedNote = await Note.findByIdAndDelete({ _id: id, userId: user.id });

    if (!deletedNote) {
      return new Response(JSON.stringify({ message: 'Note not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Note deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log('Error deleting the note:', error.message);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

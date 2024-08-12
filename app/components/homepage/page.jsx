"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation"; // Import from next/navigation
import NoteCard from "../notecard/page";

export default function Home() {
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null); // Track the note's ID being edited
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]); // For filtered notes
  const [username, setUsername] = useState(""); // Track the logged-in username

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/components/login"); // Redirect to login if no token found
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username); // Set the username from the token
    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/components/login"); // Redirect if the token is invalid
    }

    const fetchNotes = async () => {
      const notesRes = await fetch("/api/note", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
        },
      });
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData);
        setFilteredNotes(notesData); // Initialize filtered notes with all notes
      } else {
        console.error("Error fetching notes:", notesRes);
      }
    };

    fetchNotes();
  }, [router]);

  useEffect(() => {
    if (search) {
      const normalizedSearch = search.toLowerCase().trim();
      const filtered = notes.filter(
        (note) =>
          note.description.toLowerCase().includes(normalizedSearch) ||
          note.title.toLowerCase().includes(normalizedSearch)
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes); // If search is empty, show all notes
    }
  }, [search, notes]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from local storage
    localStorage.removeItem("username"); // Clear username from local storage
    router.push("/components/login"); // Redirect to login page
  };

  const toggleCreateNote = () => {
    setCurrentNoteId(null); // Clear currentNoteId when creating a new one
    setTitle(""); // Clear the title
    setDescription(""); // Clear the description
    setShowPopup(!showPopup);
  };
  const handleEdit = (id) => {
    console.log("Editing note with ID:", id); // Log the note's _id
    const noteToEdit = notes.find((note) => note._id === id);
    setCurrentNoteId(id); // Track the note's _id being edited
    setTitle(noteToEdit.title); // Set title and description for the popup
    setDescription(noteToEdit.description);
    setShowPopup(true); // Show the edit popup
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!currentNoteId) return; // Safety check

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/note/${currentNoteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
      },
      body: JSON.stringify({ title, description }), // Update both title and description
    });

    if (res.ok) {
      const updatedNotes = notes.map((note) =>
        note._id.toString() === currentNoteId
          ? { ...note, title, description }
          : note
      );
      setNotes([...updatedNotes]); // Update the notes array with the edited note
      setCurrentNoteId(null); // Clear the currentNoteId
      setTitle(""); // Clear the title
      setDescription(""); // Clear the description
      setShowPopup(false); // Close the popup
      alert("Note updated successfully!");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/note/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
      },
    });

    if (res.ok) {
      const updatedNotes = notes.filter((note) => note._id !== id);
      setNotes(updatedNotes); // Remove the note from state
      setFilteredNotes(updatedNotes); // Update filtered notes as well
      alert("Note deleted successfully!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    console.log("Token from local storage:", token);
    const res = await fetch("/api/note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
      },
      body: JSON.stringify({ title, description }),
    });

    const data = await res.json();
    console.log(data.message);

    if (res.ok) {
      setTitle("");
      setDescription("");
      toggleCreateNote();
      alert("Note created successfully!");

      // Fetch the notes again after creation to update the state
      const notesRes = await fetch("/api/note", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
        },
      });
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData);
        setFilteredNotes(notesData); // Update filtered notes with all notes
      } else {
        console.error("Error fetching notes:", notesRes);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 p-4 w-full flex justify-between items-center">
        <div className="text-black font-semibold">My Notes App</div>
        <div className="flex items-center space-x-4">
          <input
            className="p-2 border border-gray-300 rounded-md text-black"
            type="search"
            placeholder="Search Notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Update search state
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Search
          </button>
        </div>
        <div className="text-right">
          <div className="font-l text-blue-900"> Greetings- {username}</div>{" "}
          {/* Display logged-in username */}
          <button
            onClick={handleLogout} // Logout button functionality
            className="bg-red-500 text-white px-4 py-2 rounded-md mt-2"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Body Content */}
      <div className="container mt-4">
        <h1 className="text-red-900 mb-4">Your Notes</h1>
        <h1 className="text-black mb-4">What do you have in mind today?</h1>

        <div className="flex flex-wrap">
          {filteredNotes.length === 0 ? (
            <p>No notes available</p>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note._id} // Ensure you're using the correct key
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Plus Button */}
      <button
        className="fixed bottom-5 left-5 w-12 h-12 bg-blue-500 text-white rounded-full flex justify-center items-center text-2xl"
        onClick={toggleCreateNote}
      >
        +
      </button>

      {/* Create/Edit Note Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 border border-gray-300 shadow-lg rounded-lg w-96">
            <h5 className="font-semibold text-lg mb-4 text-black">
              {currentNoteId ? "Edit Note" : "Create Note"}
            </h5>
            <form onSubmit={currentNoteId ? handleSubmitEdit : handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                  rows="5"
                  placeholder="Your note..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  {currentNoteId ? "Save Changes" : "Save Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

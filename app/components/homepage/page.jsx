"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import NoteCard from "../notecard/page";

export default function Home() {
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [username, setUsername] = useState("");

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/components/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/components/login");
    }

    const fetchNotes = async () => {
      const notesRes = await fetch("/api/note", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData);
        setFilteredNotes(notesData);
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
      setFilteredNotes(notes);
    }
  }, [search, notes]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/components/login");
  };

  const toggleCreateNote = () => {
    setCurrentNoteId(null);
    setTitle("");
    setDescription("");
    setShowPopup(!showPopup);
  };

  const handleEdit = (id) => {
    console.log("Editing note with ID:", id);
    const noteToEdit = notes.find((note) => note._id === id);
    setCurrentNoteId(id);
    setTitle(noteToEdit.title);
    setDescription(noteToEdit.description);
    setShowPopup(true);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!currentNoteId) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/note/${currentNoteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      const updatedNotes = notes.map((note) =>
        note._id.toString() === currentNoteId
          ? { ...note, title, description }
          : note
      );
      setNotes([...updatedNotes]);
      setCurrentNoteId(null);
      setTitle("");
      setDescription("");
      setShowPopup(false);
      alert("Note updated successfully!");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/note/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const updatedNotes = notes.filter((note) => note._id !== id);
      setNotes(updatedNotes);
      setFilteredNotes(updatedNotes);
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
        Authorization: `Bearer ${token}`,
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

      const notesRes = await fetch("/api/note", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData);
        setFilteredNotes(notesData);
      } else {
        console.error("Error fetching notes:", notesRes);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Navbar */}

      <nav className="bg-white border-b border-gray-200 p-4 w-full flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">My Notes App</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">
              Greetings- {username}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="mt-2 flex justify-center">
        <input
          className="p-2 border border-gray-300 rounded-l-lg text-black w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="search"
          placeholder="Search Notes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-custom-blue hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg">
          Search
        </button>
      </div>

      {/* Body Content */}
      <div className="container mt-4 px-4 md:px-0">
        <h1 className="text-custom-blue mb-4">Your Notes</h1>
        <h1 className="text-black mb-4 ">What do you have in mind today?</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredNotes.length === 0 ? (
            <p>No notes available</p>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

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

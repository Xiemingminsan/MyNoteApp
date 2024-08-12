"use client";

import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function NoteCard({ note, onEdit, onDelete }) {
  console.log(note); // Inspect the note object to ensure it has an id

  return (
    <div
      className="card text-black shadow-sm border mb-3 p-3 flex"
      style={{
        backgroundColor: "#f8f9fa", // Slightly darker than white
        width: "18rem", // Set a fixed width for horizontal layout
        borderRadius: "8px",
        marginRight: "1rem", // Add margin to the right for spacing between cards
      }}
    >
      <div className="flex flex-col">
        <h5 className="card-title font-bold text-black mb-2">
          Title - {note.title || "Untitled Note"}
        </h5>

        <p className="card-text text-black mb-2">
          {note.description || "No content available"}
        </p>

        <div className="flex justify-between">
          <button
            className="btn btn-outline-dark btn-sm mr-2"
            onClick={() => onEdit(note._id)} // Pass the note's ID to the onEdit function
          >
            <FaEdit /> Edit
          </button>
          <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => onDelete(note._id)} // Pass the note's ID to the onDelete function
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

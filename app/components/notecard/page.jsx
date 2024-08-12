"use client";

import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function NoteCard({ note, onEdit, onDelete }) {
  // Check if the note object exists and has the necessary properties
  if (!note || !note._id) {
    return (
      <div className="text-center text-gray-500">Note data unavailable</div>
    );
  }

  return (
    <div className="bg-white text-black shadow-lg border mb-4 p-4 rounded-lg w-full max-w-sm">
      <div className="flex flex-col">
        <h5 className="text-lg font-bold text-gray-800 mb-3">
          {note.title || "Untitled Note"}
        </h5>

        <p className="text-gray-600 mb-4">
          {note.description || "No content available"}
        </p>

        <div className="flex justify-between">
          <button
            className="flex items-center text-sm text-blue-500 hover:custom-blue"
            onClick={() => onEdit(note._id)} // Pass the note's ID to the onEdit function
          >
            <FaEdit className="mr-2" /> Edit
          </button>
          <button
            className="flex items-center text-sm text-red-500 hover:text-red-700"
            onClick={() => onDelete(note._id)} // Pass the note's ID to the onDelete function
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

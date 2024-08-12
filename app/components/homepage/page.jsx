"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import NoteCard from "../notecard/page";

export default function Home() {
  // ... existing state management and useEffects

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 p-4 w-full flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div className="text-black font-semibold">My Notes App</div>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            className="p-2 border border-gray-300 rounded-md text-black w-full md:w-auto"
            type="search"
            placeholder="Search Notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full md:w-auto">
            Search
          </button>
        </div>
        <div className="text-right flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="font-l text-blue-900"> Greetings- {username}</div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md w-full md:w-auto"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Body Content */}
      <div className="container mt-4 px-4 md:px-0">
        <h1 className="text-red-900 mb-4 text-center md:text-left">
          Your Notes
        </h1>
        <h1 className="text-black mb-4 text-center md:text-left">
          What do you have in mind today?
        </h1>

        <div className="flex flex-wrap justify-center md:justify-start">
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

      {/* Plus Button */}
      <button
        className="fixed bottom-5 left-5 w-12 h-12 bg-blue-500 text-white rounded-full flex justify-center items-center text-2xl"
        onClick={toggleCreateNote}
      >
        +
      </button>

      {/* Create/Edit Note Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-8 border border-gray-300 shadow-lg rounded-lg w-full max-w-sm md:w-96">
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

import React, {useEffect, useState } from 'react';

interface HomePageProps {
	children: React.ReactNode;
}

function HomePage({ children }: HomePageProps) {

	let [notes, setNotes] = useState<string[]>([]);
	let [currentNote, setCurrentNote] = useState<string>('');


	useEffect(() => {
		getNotes();
	});



	const getNotes = () => {
		fetch('http://localhost:3000/getNotes')
		.then((response) => response.json())
		.then((data) => {
			setNotes(data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
	}


	// Function to handle adding a new note
	const addNote = () => {
		if (currentNote.trim() !== '') {
		fetch('http://localhost:3000/addNote', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ note: currentNote }), // Send the note data in the request body
		})
		.then((response) => response.json())
		.then((data) => {
			setNotes(data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
		setCurrentNote('');
		}
	};


	// Function to handle deleting a note
	const deleteNote = (index: number) => {
		fetch('http://localhost:3000/removeNote', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ index: index }), // Send the note data in the request body
		})
		.then((response) => response.json())
		.then((data) => {
			setNotes(data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
		setCurrentNote('');
	};

	

	return (
    <div className="homepage">
      <h1>My Notes</h1>
      <div className="note-input">
        <textarea
          placeholder="Write your note here..."
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
        />
        <button onClick={addNote}>Add Note</button>
      </div>
      <div className="note-list">
        {notes.map((note, index) => (
			<div key={index} className="post-it">
				<p><strong>Note</strong></p>
				<p>{note}</p>
				<button className="delete-button" onClick={() => deleteNote(index)}>
				&#10006; {/* HTML entity for "x" symbol */}
				</button>
			</div>
        ))}
      </div>
    </div>
  );

};	




export default HomePage;
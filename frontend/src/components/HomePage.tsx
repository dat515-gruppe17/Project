import { SyntheticEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';


interface HomePageProps {
	children: React.ReactNode;
}

type Note = {
	id: number;
	note: string;
};
	

function HomePage({ children }: HomePageProps) {

	let [newNoteInput, setNewNoteInput] = useState('');

	const queryClient = useQueryClient();
	const Notes = useQuery<Array<Note>>(['notes'], 
		() => {
			return fetch('http://localhost:3000/getNotes')
			.then((response) => response.json())
			.then((data) => data)
			.catch((error) => {
			console.error('Error:', error);
		});
		}, {
		placeholderData: [],
	});
	const addMutation = useMutation((formData: string) => {
		console.log(formData)
		return fetch('http://localhost:3000/addNote', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ note: newNoteInput})})
			.then((response) => response.json())
		},
		{
			onSuccess: (data) => {
				queryClient.setQueryData(['notes'], () => data);
				setNewNoteInput('');
			}
		}
	);

	const delMutation = useMutation((id: number) => {
		return fetch(`http://localhost:3000/removeNote?id=${id}`)
			.then((response) => response.json())
		},
		{
			onSuccess: (data) => {
				queryClient.setQueryData(['notes'], () => data);
			}
		}
	);

	const onSubmit = (event: SyntheticEvent) => {
		event.preventDefault();
		console.log(event.target)
		addMutation.mutate(newNoteInput);
	};

	const onDelete = (id: number) => {
		delMutation.mutate(id);
	};

	if (!Notes.data) return (<div>Loading...</div>);
	
	const notes = Notes.data.map((note) => (
		<div key={note.id} className="post-it">
			<p><strong>Note</strong></p>
			<p>{note.note}</p>
			<button className="delete-button" onClick={() => onDelete(note.id)}>
			&#10006; {/* HTML entity for "x" symbol */}
			</button>
		</div>
	));
	

	return (
    <div className="homepage">
      <h1>My Notes</h1>
      <form className="note-input" onSubmit={onSubmit}>
        <textarea
		  name="note"
          placeholder="Write your note here..."
		  value={newNoteInput}
		  onChange={(event) => setNewNoteInput(event.target.value)}
        />
        <button type="submit">Add Note</button>
      </form>
      <div className="note-list">
        {notes}
      </div>
    </div>
  );

};	




export default HomePage;
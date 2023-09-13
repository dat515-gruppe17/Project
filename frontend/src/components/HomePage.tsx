import { SyntheticEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';


type Note = {
	id: number;
	note: string;
};
	

function HomePage() {

	let [newNoteInput, setNewNoteInput] = useState('');

	const queryClient = useQueryClient();
	const Notes = useQuery<Array<Note>>(['notes'], 
		() => {
			return fetch('http://localhost:8080/getNotes')
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
		return fetch('http://localhost:8080/addNote', {
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
		return fetch(`http://localhost:8080/removeNote?id=${id}`)
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
	const randomRotations = ['rotate-[-7deg]', 'rotate-[-6deg]', 'rotate-[-5deg]', 'rotate-[-4deg]', 'rotate-[-3deg]', 'rotate-[-2deg]', 'rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[2deg]', 'rotate-[3deg]', 'rotate-[4deg]', 'rotate-[5deg]', 'rotate-[6deg]', 'rotate-[7deg]'];
	const notes = Notes.data.map((note) => {
		
		const rotation = randomRotations[Math.floor(Math.random() * randomRotations.length)];
		return (
		<div key={note.id} className={`col-span-1 w-60 h-60 relative bg-yellow-200 drop-shadow-xl m-2 p-2 rounded-bl-[45px] ${rotation}`}>
			<p><strong>Note</strong></p>
			<p>{note.note}</p>
			<button className="delete-button" onClick={() => onDelete(note.id)}>
			&#10006; {/* HTML entity for "x" symbol */}
			</button>
		</div>
	)});
	

	return (
    <div className="flex flex-col items-center w-full">
      <h1 className='text-2xl font-bold text-center'>My Notes</h1>
      <form className="p-2 flex w-96 content-center items-center" onSubmit={onSubmit}>
        <textarea
		className='border-2 rounded w-full h-20'
		  name="note"
          placeholder="Write your note here..."
		  value={newNoteInput}
		  onChange={(event) => setNewNoteInput(event.target.value)}
        />
        <button type="submit" className='border-2 rounded w-32 h-10'>Add Note</button>
      </form>
      <div className="grid grid-cols-4">
        {notes}
      </div>
    </div>
  );

};	




export default HomePage;
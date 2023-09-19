import { SyntheticEvent, useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { parseFilterArgs } from 'react-query/types/core/utils';


type Note = {
	id: number;
	title: string;
  	note: string;
 	color: string;
	rotation: number;
	xFraction: number;
	yFraction: number;
};

type NoteProps = {
	title: string;
  	note: string;
 	color: string;
	rotation: number;
};


type NotePos = {
	id: number;
	xFraction: number;
	yFraction: number;
};
	




function HomePage() {
	
	const isDragging = useRef<{ [key: number]: boolean }>({});
	let [newNoteInput, setNewNoteInput] = useState('');
	
	const queryClient = useQueryClient();
	const Notes = useQuery<Array<Note>>(['notes'], 
		async () => {
			return fetch('http://localhost:8080/getNotes')
			.then((response) => response.json())
			.then((data) => data)
			.catch((error) => {
			console.error('Error:', error);
		});
		}, {
		placeholderData: [],
	});
	
	
	
	
	
	const addMutation = useMutation(async () => {
		const randomColors = ['bg-yellow-200', 'bg-custom-blue', 'bg-custom-green','bg-custom-purple'];
		const randomRotations = [-5, -6, -3, -4, -3, -2, -1, 1, 2, 3, 4, 5,];
		const color = randomColors[Math.floor(Math.random() * randomColors.length)];
		const rotation = randomRotations[Math.floor(Math.random() * randomRotations.length)];

		const formData: NoteProps  = {
			note: newNoteInput,
			title: 'Note',
			color: color,
			rotation: rotation,
		};

		return await fetch('http://localhost:8080/addNote', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formData)})
			.then((response) => response.json())
		},
		{
			onSuccess: (data) => {
				queryClient.setQueryData(['notes'], () => data);
				setNewNoteInput('');
			}
		}
	);


	const delMutation = useMutation(async (id: number) => {
		return await fetch(`http://localhost:8080/removeNote?id=${id}`)
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
		addMutation.mutate();
	};

	const onDelete = (id: number) => {
		delMutation.mutate(id);
	};

	

	
	function MoveNote(e: MouseEvent, draggableDiv: HTMLElement, offset: [number,number] = [0,0]) {
		const mouseX = e.clientX;
		const mouseY = e.clientY;
		draggableDiv.style.left = (mouseX + offset[0]) + 'px';
		draggableDiv.style.top  = (mouseY + offset[1]) + 'px';
	}

	async function updateNotePos (noteData: NotePos) {
		return await fetch('http://localhost:8080/moveNote', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(noteData)
		});
	}


	function dragStart(draggableDiv: HTMLElement, id: number) {
		let offset: [number,number] = [0,0];


		draggableDiv.addEventListener('mousedown', function(e) {
			offset = [
				draggableDiv.offsetLeft - e.clientX,
				draggableDiv.offsetTop - e.clientY
			]
		});
	
		document.addEventListener('mousemove', (e: MouseEvent) => {
			if (isDragging.current[id]) {
				MoveNote(e, draggableDiv, offset);
			}
		});

		document.addEventListener('mouseup', () => {
			if (!isDragging.current[id]) {
				return;
			}

			isDragging.current[id] = false;
			
			// Get the center position of the node
			const rect = draggableDiv.getBoundingClientRect();
			const centerX = rect.left //+ rect.width / 2;
			const centerY = rect.top //+ rect.height / 2;

			// Get the window size
			const windowWidth = window.innerWidth;
  			const windowHeight = window.innerHeight;

			 // Calculate the fractions
			const xFraction = centerX / windowWidth;
			const yFraction = centerY / windowHeight;
			
			updateNotePos({
				id: id,
				xFraction: xFraction,
				yFraction: yFraction,
			});
		});
	}

	
	

	if (!Notes.data) return (<div>Loading...</div>);

	useEffect(() => {
		Notes.data.map((note) => {
			const draggableDiv = document.getElementById(note.id.toString());
			if (draggableDiv) {
				dragStart(draggableDiv, note.id);
			}
		});
	}, [Notes.data]);


	//const randomRotations = ['rotate-[-5deg]', 'rotate-[-6deg]', 'rotate-[-3deg]', 'rotate-[-4deg]', 'rotate-[-3deg]', 'rotate-[-2deg]', 'rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[2deg]', 'rotate-[3deg]', 'rotate-[4deg]', 'rotate-[5deg]', 'rotate-[6deg]', 'rotate-[7deg]'];
	const notes = Notes.data.map((note) => {
		//const rotation = randomRotations[Math.floor(Math.random() * randomRotations.length)];
		const color = note.color;
		const rotation = 'rotate-[' + note.rotation.toString() + 'deg]';
		const xFraction = note.xFraction;
		const yFraction = note.yFraction;


		const noteStyle: any = {};

		// get size of window
		if (xFraction && yFraction) {
			noteStyle['left'] = xFraction * window.innerWidth;
			noteStyle['top'] = yFraction * window.innerHeight;
			noteStyle['position'] = 'absolute';
		}
		
			
		return (
		<div key={note.id} className={`${color} col-span-1 w-60 h-60 relative drop-shadow-xl m-2 p-2 rounded-bl-[45px] ${rotation}`}
			id = {note.id.toString()}
			style={noteStyle}
			onMouseDown={(e) => {
				const draggableDiv = e.currentTarget as HTMLElement;
				const offset: [number,number] = [draggableDiv.offsetLeft - e.clientX,draggableDiv.offsetTop - e.clientY]
				draggableDiv.style.position = 'absolute';
				MoveNote(e.nativeEvent, draggableDiv, offset);
				isDragging.current[note.id] = true;
			}}
			>
			<p className={`text-center font-bold text-2xl`} >{note.title}</p>
			<p className={`font-Reenie`} >{note.note}</p>

			<button 
				className="delete-button absolute right-0 top-0" 
				onMouseDown={(e) => {
					e.stopPropagation(); // Prevent event propagation to the div
					onDelete(note.id)
					isDragging.current[note.id] = false;
				}}
			>
			&#10006; {/* HTML entity for "x" symbol */}
			</button>
		</div>
		)
	});



	


	
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
  )};
  

  






export default HomePage;
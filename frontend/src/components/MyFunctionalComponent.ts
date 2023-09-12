import React from 'react';

interface MyFunctionalComponentProps {
	name: string;
	description: string;
}

const MyFunctionalComponent: React.FC<MyFunctionalComponentProps> = (props) => {
	return (
		<div>
		<h1>Hello, { props.name }! < /h1>
		< p > { props.description } < /p>
		< /div>
	);
};

export default MyFunctionalComponent;

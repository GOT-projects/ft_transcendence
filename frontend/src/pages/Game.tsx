import React, { useState } from 'react';


const Game = () => {
	
	const [count, setCount] = useState(0); 
	return (
		<div>
			<p>{count}</p>
		</div>
	)
}

export default Game;

import React from 'react'
import './newTournament.css'

const newTournament = () => {
	return (
		<div className="newTournament">
			<form>
				<div className="topBlock">
					<input type="text" />
					<select>
						<option>Tournament Game</option>
						<option>Tournament Game</option>
						<option>Tournament Game</option>
					</select>
					<input type="text" />
				</div>
				<p>Rules</p>
				<div>
					<input type="text" />
					<input type="text" />
					<input type="text" />
					<input type="text" />
					<input type="text" />
					<input type="text" />
				</div>
				<div>
					<button>Create</button>
					<button>Cancel</button>
				</div>
			</form>
		</div>
	)
}

export default newTournament

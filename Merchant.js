// Merchant class - buys, stores and sells stuff, cannot fight

// selling specific items, doesnt work yet needs more thought
function selltrash() {
	for (let i = 0; i < 42; i++) {
		let item = character.items[i];
		if (!item) continue; 
		if (item.name == "ringsj" || item.name == "hpamulet" || item.name == "hpbelt") {
			let sellernpc = find_npc("Gabriel");
			if(!is_in_range(sellernpc)) {
				return;
			}
			sell(i, 1)
		}
    }
}


// passive  regeneration
function regenerate() {
	// passive hp regen unless character is missing more than 100 mana
	if (character.hp < character.max_hp && can_use("regen_hp") && character.mp > character.max_mp - 100) {
		set_message("Regen HP");
		use_skill("regen_hp");
		return;
	}
	// passive mp regen
	if (character.mp < character.max_mp && can_use("regen_mp")) {
		set_message("Regen MP");
		use_skill("regen_mp");
		return;
	}
}

//get nearby players
function playersearch() {
	let playerlist = [] // create empty list
	// loop through entities around me
	for(let ppl_around_me of Object.values(parent.entities)) { 
		if(!is_player(ppl_around_me)) { // if entity is not a player, skip them
			continue;
		}
	playerlist.push(ppl_around_me); // put every looped player into the list
	}
	return playerlist; // return list when function is called
}

//Mass Produce skill
function mass_produce() {
	if(character.level < 30) {
		return;
	}
	if(!character.s.massproduction) {
		set_message("Mass Prod.");
		use_skill("massproduction", character);
		return;
	}
	/* // mechanic to read other players buff, if they dont have it, buff them
	// the massproduction skill seems to be self cast only :(
	let players_around = playersearch(); // call function and save value in variable
	if(can_use("massproduction") && character.mp >= character.max_mp - 100) {
		for(let target_player of players_around) { // loop through players
			if(target_player.s.massproduction) { // if player has buff, skip them
				continue;
			}
			set_message("Mass Prod.");
			use_skill("massproduction", target_player);
		}
	}
	*/
}

setInterval(function(){
	
	mass_produce();
	
	regenerate();
	
},1000/4); // Loops every 1/4 seconds.

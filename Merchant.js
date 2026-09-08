/*
	if (quantity("hpot0") < 100 ) {
		buy_with_gold("hpot0", 1000);
	}
	if (quantity("mpot0") < 100 ) {
		buy_with_gold("mpot0", 1000);
	}
	
	let mpot_loc = locate_item("mpot0");
	let hpot_loc = locate_item("hpot0");
	
	if (character.gold < 200000 || mpot_loc == -1 || hpot_loc == -1 || quantity("mpot0") < 800 || quantity("hpot0") < 800) return;
	
	let halfhpots = Math.floor(quantity("hpot0") / 0.33);
	let halfmpots = Math.floor(quantity("mpot0") / 0.33);
	send_item("Gulrot", hpot_loc, halfhpots);
	send_item("Gulrot", mpot_loc, halfmpots);
	send_item("Fenikkel", hpot_loc, halfhpots);
	send_item("Fenikkel", mpot_loc, halfmpots);
	send_item("Alruner", hpot_loc, halfhpots);
	send_item("Alruner", mpot_loc, halfmpots);
*/


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

//Mass Produce skill
function mass_produce() {
	if(character.level < 30) {
		return;
	}
	if(can_use("massproduction") && character.mp >= character.max_mp * 0.90) {
		set_message("Mass Prod.");
		use_skill("massproduction", character);
		return;
	}
}

setInterval(function(){

	mass_produce();
	
	regenerate();
	
},1000/4); // Loops every 1/4 seconds.

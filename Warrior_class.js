let solo_mode = false;

let attack_mode = true;

// summon other characters and invite to party
function summonfriends() {
	if(solo_mode) {
		return;
	}
	let sufen = get_player("Fenikkel");
	let sual = get_player("Alruner");
	
	if(character.party && character.party !== character.name) return;

	if (sufen == null || sual == null) { 
		start_character("Fenikkel", "Fenikkel");
		start_character("Alruner", "Alruner");
	} else {
		if (!sufen.party || !sual.party) {
			send_party_invite("Fenikkel");
			send_party_invite("Alruner");
		}
	}
}

// potion and regeneration since they share cooldown
function drink_potion() {
	// if 33% hp, use a health potion
	if (character.hp < character.max_hp / 3 && can_use("use_hp")) {
		set_message("Drink Potion");
		use_skill('use_hp');
		return;
	}
	// if 50% mana, use mana potion
	if (character.mp < character.max_mp / 2 && can_use("use_mp")) {
		set_message("Drink Potion");
		use_skill('use_mp');
		return;
	}
	// passive hp regen unless character has less than 90% of mana
	if (character.hp < character.max_hp - 50 && can_use("regen_hp") && character.mp > character.max_mp - 100) {
		set_message("Regen HP");
		use_skill("regen_hp");
		return;
	}
	// passive mp regen
	if (character.mp < character.max_mp - 100 && can_use("regen_mp")) {
		set_message("Regen MP");
		use_skill("regen_mp");
		return;
	}
}

// Give Kaal Gold and Items
function Gkaal() {
	if (character.gold > 60000 && get_player("Kaal")) {
		send_gold("Kaal", 50000);
	}
	
		if (get_player("Kaal")) { 
		for (let i = 0; i < 42; i++) {
        let item = character.items[i];
        if (!item) continue; 
        if (item.name == "hpot0" || item.name == "mpot0") continue;
        send_item("Kaal", i, item.q || 1);
    	}
	}
}
// Checks who is in party and their stats (names, hp, mana, etc...)
function whoarewe() {
	let who_is_in_party = [] // empty list as placeholder
	if (character.party == null) return who_is_in_party;
	let party_names=Object.keys(get_party()); // extracts party member names
	for (let name of party_names) { 		// loops through party_names
		let memberstats = get_player(name); // names get into a variable
		if (!memberstats) continue; // if None, continue without crash
		who_is_in_party.push(memberstats); // put party into the placeholder
	}
	return who_is_in_party; // returns each members stats to function
}

// single target taunt, shields ANY partymember in range
function taunting() {
	let party_names = Object.keys(get_party()); // gets party names
	for (let name of party_names) { 		// loops through names
   		let memberstats = get_player(name); // put names in variable
    	if (!memberstats) continue;  // failsafe if names is none
    	let monster = get_nearest_monster({ target: memberstats }); 
		// variable for nearest monster that targets a party member
    	if (!monster) continue; // failsafe if no monster attacks them
    	if (monster.target == memberstats.name && monster.target != character.name) { // does a monster attack a partymember except me?
        	if (!is_in_range(monster, "taunt")) { // if not in range, walk to monster
            	move(
                	character.x + (monster.x - character.x) / 2,
                	character.y + (monster.y - character.y) / 2
            	);
        	}
		if(can_use("taunt")) {
			set_message(`Taunt ${monster.name}`); 
        	use_skill("taunt", monster);
		}	// taunt monster before it reaches party member
    	}
	}
}

// seek nearest new target / prioritize phoenix
function seekmonster() {
	let target=get_targeted_monster();
	if(target && target.rip) {
		target = null
	}
	if(!target || target.mtype !== "phoenix") {
		let is_pho = get_nearest_monster({
		type: "phoenix",
		})
		if(is_pho) {
			set_message(`Found: ${is_pho.name}`);
			change_target(is_pho);
			return is_pho;
		}
	} 
	if(target && !target.rip) {
	   return target;
	}
	if(!target) {
		target = get_nearest_monster({
		min_xp:100,
		max_att:200,
		max_distance:20,
		path_check:true
		})
		if(target) {
			set_message(`Found: ${target.name}`)
			change_target(target);
			return target;
		}
	}
	return target;
}

// attack current target
function standard_attack() {
	let target = seekmonster();
	if(!target) return;
	if(!is_in_range(target)) {
		move(
			character.x+(target.x-character.x)/2,
			character.y+(target.y-character.y)/2
			);
		// Walk half the distance
	}
	else if(can_attack(target)) {
		set_message(`Atk ${target.name}`);
		attack(target);
	}
	if (target && target.rip) {
		change_target(null);
		clear_target();
	}
}

// charge enemy
function chargesk() {
	let target = character.target;
	if(!target) {
		return;
	}
	if(can_use("charge") && !is_in_range(target)) {
		set_message(`Charge ${target.name}!`);
		use_skill("charge");
		return;
	}
}

// Main Loop
setInterval(function(){
	
	Gkaal();
	
	drink_potion();
	
	taunting();
	
	loot();

	if(!attack_mode || character.rip) return;
	
	
	// battle and tank loops
	
	seekmonster();
	
	//charge to enemy
	chargesk();
	
	standard_attack();

},1000/4); // Loops every 1/4 seconds.


setInterval(function(){ // summon other characters and send party invite
	summonfriends();
}, 1000 * 15);

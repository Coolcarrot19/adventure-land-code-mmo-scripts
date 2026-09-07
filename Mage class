// Gulrot is my warrior and Kaal my merchant, currently they are hardcoded rather than dynamic.

let attack_mode = false;

let follow_mode = true;

// these are all functions for the main loop. The main loop is at the bottom.

// join party - Gulrot
function summonparty() {
	if (character.party != null) {
		return;
	}
	accept_party_invite("Gulrot");
	set_message("Waiting for Gulrot");
}

// Checks who is in party and their stats (names, hp, mana, etc...)
function whoarewe() {
	let who_is_in_party = [] // empty list as placeholder
	if (character.party == null) return who_is_in_party;
	let party_names=Object.keys(get_party()); // extracts party member names
	for (let name of party_names) { 		// loops through party_names
		let memberstats = get_player(name); // put stats of name in variable
		if (!memberstats) continue; // if None, continue without crash
		who_is_in_party.push(memberstats); // put party into the placeholder
	}
	return who_is_in_party; // returns each members stats to function
}


//switching follow/battle mechanic
function updatecfmode() {
	let leader = get_player("Gulrot");
	if (leader == null) { return; }
	let leader_actual_target = get_target_of(leader);
	if(leader) {
		if(leader_actual_target && !leader_actual_target.rip) {
			follow_mode = false
			attack_mode = true
		} else {
			follow_mode = true
			attack_mode = false
		}
	}
	if (follow_mode == true && distance(character, leader) > 15) {
		set_message("Following");
		xmove(
			character.x+(leader.x-character.x) * 0.8,
			character.y+(leader.y-character.y) * 0.8
			);
	}
}

// sending items and gold to Kaal if online and near
function send_to_Kaal() {
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

// potion and regeneration
function drink_potion() {
	// if 33% hp, use a health potion
	if (character.hp < character.max_hp / 3 && can_use("use_hp")) {
		set_message("Drink Potion");
		use_skill('use_hp');
		return;
	}
	// if 50% mana, use mana potion
	if (character.mp < character.max_mp -300 && can_use("use_mp")) {
		set_message("Drink Potion");
		use_skill('use_mp');
		return;
	}
	// passive hp regen unless character has 100 mana less than max
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

// In group standard attack
	
function ltattack() {
	let leader = get_player("Gulrot");
   	let target = get_target_of(leader);
	if (!target || target.rip) return;
	if(!is_in_range(target))
	{
		move(
			character.x+(target.x-character.x)/2,
			character.y+(target.y-character.y)/2
			);
		// Walk half the distance
	}
	else if(can_attack(target))
	{
		if (leader && leader.target && !is_on_cooldown("attack")) {
			if (target && can_attack(target)) {
				set_message("Attacking");
        		attack(target);
			}
		}
	}
}

// reflective shield
function refl_shield() {
	if(character.level < 60) {
		return;
	}
	let group = whoarewe();
	let leader = get_player("Gulrot");
	if (!group) return;
	group.sort(function(a, b) {		// sort stats, compare two characters
		return (a.hp / a.max_hp) - (b.hp / b.max_hp); // sort characters by hp%
	});
	let member = group[0]; // least hp% character is priority
	if (member.hp < member.max_hp / 2 && can_use("reflection")) {
		set_message("Refl. Shield!");
		use_skill("reflection", member);
		return;
	}
	else if(!leader) {
		return;
	}
	if(can_use("reflection") && leader.hp < leader.max_hp) {
		set_message("Refl. Shield!");
		use_skill("reflection", leader);
		return;
	}
}


// in group mana burst
function igmanaburst() {
	let leader = get_player("Gulrot");
   	let target = get_target_of(leader);
	if (!target || target.rip) return;
	if(!is_in_range(target)) {
		move(
			character.x+(target.x-character.x)/2,
			character.y+(target.y-character.y)/2
			);
		// Walk half the distance
	}
	else if (can_use("burst") && target.hp <= character.mp * 0.555) {
		set_message("Bursting!");
		use_skill("burst");
	}
}
		


setInterval(function(){ 
	summonparty();
}, 1000 * 10);


//mainloop
setInterval(function(){
	
	updatecfmode();
	
	send_to_Kaal();
	
	drink_potion();
	
	loot();
	
	if(!attack_mode || character.rip) return;
	
	// 20% reflection on either < 50% hp or Gulrot.
	refl_shield()
	
	// use in group mana burst on leaders target
	igmanaburst();
	
	// use standard attack on leader target
	ltattack();

},1000/4); // Loops every 1/4 seconds.


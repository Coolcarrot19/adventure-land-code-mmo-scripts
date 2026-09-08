Adventure Land - Multi-Class Automation (JavaScript)

A structured, modular repository containing my custom automation scripts for **"Adventure Land - The Code MMORPG"**. Each character class runs on its own dedicated codebase, functioning together as a synchronized party.

About the Project
Instead of manual inputs, the characters are fully controlled via JavaScript. My scripts handle high-frequency, real-time decision-making, positioning, and tactical resource management to optimize combat efficiency.

Coding Background & Focus
* **Python Foundation:** I originally started my programming journey with Python. As I transition into JavaScript, you might occasionally spot some pythonic logic structures or unique formatting choices.
* **Core Architecture Concepts Used:**
  * **The DRY Principle (Don't Repeat Yourself):** Shared mechanics like potion consumption (`drink_potion`), pathing, and gold-banking (`send_to_Kaal`) are modularly reused across classes.
  * **Guard Clauses:** Used extensively to prevent deeply nested `if-else` blocks, keeping the code clean, fast, and easy to maintain.
  * **Data Sorting & Math Filters:** Sorting party tables dynamically by HP percentages to prioritize targets and casting high-impact skills based on precise mathematical thresholds.

Repository Structure & Classes

# `warrior.js` (Party Leader & Tank)
* **Multi-Boxing Management:** Automatically acts as the lobby host, ensuring party members (`Fenikkel`, `Alruner`) are booted up via the game API and invited to the group.
* **Smart Taunting AI:** Scans team health profiles to locate any monster targeting vulnerable squishy targets, calculates the optimal path, and uses `taunt` to pull aggro.
* **Bank-Bot Automation:** Automatically screens inventory slots (up to 42 slots), filtering out vital potions while safely shipping excess loot and gold to the merchant (`Kaal`).

# `priest.js` (The Brains / Support)
* **Dynamic Healing Array:** Automatically runs a sorting algorithm (`.sort()`) on the party array to detect which member has the lowest proportional health, prioritizing them for high-efficiency single heals.
* **Tactical Boss Management:** Evaluates enemy max HP mathematically before casting `curse`, preventing wasteful mana spending on low-tier minions.
* **State Machine Mechanics:** Toggles between automated combat and rigid follow-mechanics depending on the leader's combat activity status.

# `mage.js` (Tactical Damage Dealer)
* **Mathematical Finisher Logics:** Evaluates target health against current mana values (`target.hp <= character.mp * 0.555`), guaranteeing that high-cost burst skills are only executed when they secure an immediate kill.
* **Double-Layer Defensive Grid:** Incorporates safety boundaries checking for character level limits before attempting to deploy `reflection` shields onto vulnerable teammates or the main tank.

import {characterTopic} from './guide-characters.en.js';
export const topics = [
  {
    "id": "turn",
    "title": "Your turn: 4 + 1 actions",
    "key": "Finish one character’s actions before switching to your other character. Then draw 2 player cards and resolve Shadow cards.",
    "bullets": [
      "In multiplayer games, each player controls 2 characters. Choose one to take up to 4 actions and the other to take up to 1. Either can go first; you cannot split the allowance 3 + 2 or alternate between them.",
      "Repeat actions if you wish; each use counts separately. You may stop early. If you have only one character, that character gets up to 4 actions.",
      "Both characters share your hand and symbol tokens. Character abilities can modify the standard actions. Frodo & Sam count as one character; Merry & Pippin also count as one.",
      "After actions, draw 2 player cards together, then draw and resolve Shadow cards one at a time equal to the current threat rate. Play passes clockwise."
    ],
    "appendix": false
  },
  {
    "id": "symbols",
    "title": "Symbols and shared resources",
    "key": "Spend a symbol by discarding a matching card or returning a matching token to the supply.",
    "bullets": [
      "A card’s region does not restrict where you may spend its symbol. Region matching matters for Fellowship and certain abilities, not ordinary symbol payments.",
      "Keep hands faceup. The hand limit is 7 player cards per player, including events; tokens do not count. Other players’ hands are separate from yours.",
      "Tokens are limited by the supply. If a gain cannot be fulfilled, you do not gain the missing token."
    ],
    "appendix": false,
    "table": {
      "headers": [
        "Symbol",
        "Common uses"
      ],
      "rows": [
        [
          "Friendship (purple hands)",
          "1 to Muster; some paths and objectives"
        ],
        [
          "Valor (crossed swords)",
          "1 removes a Shadow troop after a battle roll; 3 to Capture"
        ],
        [
          "Stealth (green cloak)",
          "1 to avoid the search when Frodo Travels; some paths"
        ],
        [
          "Resistance (gold ring)",
          "1 rerolls one search/battle die; 5 to attempt to destroy the Ring"
        ]
      ]
    }
  },
  {
    "id": "travel",
    "title": "Travel and bringing companions",
    "key": "One action moves to one connected location. You may bring friendly troops and willing characters from your starting location.",
    "bullets": [
      "Normal paths, special paths, and battle lines all connect locations. Characters may Travel along battle lines in either direction; arrows restrict Shadow advances only.",
      "The acting character pays the symbols on a special path once for the whole group. Friendly troops cannot Travel by themselves.",
      "Whenever Frodo Travels or is brought along by another character’s Travel action, the acting character must also spend 1 Stealth or roll a search at the destination. This is additional to any special-path cost.",
      "Moving into a location with both armies does not itself cause a battle. An Attack action or an effect instructing a battle is needed."
    ],
    "appendix": false,
    "image": "travel.png",
    "caption": "Travel can carry friendly troops. Special paths charge their shown symbols; battle lines allow Travel in either direction."
  },
  {
    "id": "search",
    "title": "Search rolls",
    "key": "Roll one black search die per Nazgûl in Frodo’s region plus one per Shadow troop in his location, up to 7 dice.",
    "bullets": [
      "Regions contain several locations. Nazgûl affect their entire region; Shadow troops count only at Frodo’s exact location. When traveling, check the destination.",
      "If the count is zero, do not roll. The Eye of Sauron is not an extra die by itself.",
      "After rolling, any character in Frodo’s location may spend 1 Resistance to reroll one die. Further payments can reroll again.",
      "Putting on the Ring uses Frodo’s printed ability: lose 1 hope, move the Eye to his region, then search ignoring local Shadow troops but not Nazgûl. Follow the character card’s timing."
    ],
    "appendix": false,
    "table": {
      "headers": [
        "Result",
        "Effect"
      ],
      "rows": [
        [
          "Slip By (blank)",
          "No effect"
        ],
        [
          "Weary (tree)",
          "Lose 1 hope"
        ],
        [
          "Exposed (framed tree)",
          "Lose 1 hope; ignore in a haven"
        ],
        [
          "Recall (tower)",
          "Move 1 Nazgûl from Frodo’s region to Mordor if present; no effect if Frodo is in Mordor"
        ]
      ]
    },
    "image": "search.png",
    "caption": "Three Shadow troops at the destination and one Nazgûl in its region mean four search dice."
  },
  {
    "id": "fellowship",
    "title": "Fellowship: transfer a card",
    "key": "At the same location as another player’s character, spend one action to give or take one card matching your current region.",
    "bullets": [
      "Both players must agree. Being in the same region but different locations is not sufficient.",
      "This action transfers a card, not a symbol token. Your own two characters already share a hand.",
      "The receiving player must immediately return to the 7-card limit by discarding or playing an event if necessary."
    ],
    "appendix": false
  },
  {
    "id": "prepare",
    "title": "Prepare: bank a symbol",
    "key": "At a haven, spend an action and discard a region card to gain one token matching the symbol on that card.",
    "bullets": [
      "In multiplayer, the card’s region need not match your location. The matching token must be available in the supply or you cannot Prepare.",
      "The token is outside your 7-card hand limit, but cannot be given to another player with Fellowship.",
      "Solo exception: you must also be in the region printed on the discarded card."
    ],
    "appendix": false
  },
  {
    "id": "muster",
    "title": "Muster friendly troops",
    "key": "At a muster location, spend an action and 1 Friendship to add one friendly troop matching that location’s color.",
    "bullets": [
      "Muster locations show a Dwarven, Elven, Rohirrim, or Gondor symbol. You cannot normally Muster at white or red locations.",
      "Take the troop from its supply and place it with your character. If that color’s supply is empty, you cannot Muster.",
      "Friendly troops can share a location with Shadow troops; Mustering does not itself initiate a battle."
    ],
    "appendix": false
  },
  {
    "id": "battle",
    "title": "Attack and battle dice",
    "key": "An Attack action requires your character, friendly troops, and Shadow troops in the same location. Move the Eye there, then roll.",
    "bullets": [
      "Player Attack: choose 1 to 3 white battle dice, no more than the number of friendly troops present. One Attack resolves one roll, not repeated rounds until an army is eliminated.",
      "Shadow-card or Skies Darken battle: roll one die per Shadow troop in that location, up to 3. Do not move the Eye for this battle.",
      "After rolling, any characters at the battle location may spend Resistance to reroll (1 per die) and Valor to remove Shadow troops (1 per troop). These payments are not extra actions.",
      "The current player chooses which friendly colors are removed. Remove only troops available; ignore excess losses. Armies may still coexist after a battle."
    ],
    "appendix": false,
    "table": {
      "headers": [
        "Result",
        "Effect"
      ],
      "rows": [
        [
          "Rout (red troop)",
          "Remove 1 Shadow troop"
        ],
        [
          "Exchange (both troops)",
          "Remove 1 Shadow and 1 friendly troop"
        ],
        [
          "Overrun (framed friendly troop)",
          "Remove 1 friendly troop; ignore in a haven"
        ],
        [
          "Nazgûl! (winged figure)",
          "If any Nazgûl are in the region, remove 2 friendly troops; otherwise no effect"
        ]
      ]
    },
    "image": "battle.png",
    "caption": "With three friendly troops, Arwen may choose one, two, or three battle dice. The two Nazgûl make a Nazgûl result dangerous."
  },
  {
    "id": "capture",
    "title": "Capture and protect havens",
    "key": "Capture costs one action and 3 Valor: your character must be at a Shadow stronghold with at least one friendly troop and no Shadow troops.",
    "bullets": [
      "Turn the stronghold into a haven: cover a printed stronghold with a haven token, or remove the stronghold token from a former haven. Move the Eye to the region and gain 2 hope.",
      "Captured Moria, Isengard, Dol Guldur, and Umbar no longer receive the troop added by their Shadow cards. The card’s remaining special orders still resolve.",
      "After a battle, action, or other effect, a haven containing Shadow troops but no friendly troops immediately becomes a stronghold and costs 3 hope. A character alone does not defend it.",
      "Havens ignore Exposed search results and Overrun battle results, not all bad results. Enemy troops may still advance into them."
    ],
    "appendix": false,
    "image": "capture.png",
    "caption": "Gimli and a friendly troop capture empty Moria: it becomes a haven, the Eye shifts to the Misty Mountains, and hope rises by two."
  },
  {
    "id": "draw",
    "title": "Draw cards and play events",
    "key": "After actions, draw two player cards together. Resolve any Skies Darken cards, then enforce the 7-card hand limit.",
    "bullets": [
      "If the player deck is exhausted, lose 1 hope for each card you cannot draw. This is not an automatic loss unless hope reaches zero.",
      "Playing an event costs no action. Most can be played on any player’s turn, but cannot interrupt a search, battle, card, or ability while it resolves unless explicitly allowed.",
      "You can play an event after one Shadow card is fully resolved and before the next is drawn. Discard events after use; the player playing the card chooses how to use it."
    ],
    "appendix": false
  },
  {
    "id": "darken",
    "title": "Skies Darken",
    "key": "Resolve all four steps in order. Remove the card afterward; do not draw a replacement.",
    "bullets": [
      "1. The Shadow Grows: move the threat marker forward one space. Read the printed threat rate; this determines the Shadow-card count later this turn.",
      "2. I See You!: if the Eye is already in Frodo’s region, lose 2 hope. Otherwise move it to that region.",
      "3. Under Cover of Darkness: add 3 Shadow troops at the indicated location. Lose 1 hope per missing troop if the supply runs out. If friendly troops are there, resolve a Shadow-initiated battle.",
      "4. The Danger Intensifies: shuffle only the Shadow discard pile and put it on top of the Shadow deck.",
      "If both drawn cards are Skies Darken, completely resolve the four steps for one, then repeat all four for the other. Neither is replaced."
    ],
    "appendix": false
  },
  {
    "id": "shadow",
    "title": "Which half of a Shadow card?",
    "key": "Flip one card, then inspect the new top card’s back: red flag means Advance; black banner means Reinforce.",
    "bullets": [
      "Resolve only the corresponding half of the flipped card, not both. Use the newly revealed deck back, not the back of the card you just drew.",
      "Repeat one card at a time until you have resolved the number shown by the current threat rate. Keep these cards in the resolve area; discard them together after this step.",
      "The Drums of War and The Wheels of Saruman are special Shadow cards. Follow their printed instructions instead of Advance/Reinforce.",
      "Only the top Shadow-card back is public. You may inspect either discard pile, but not hidden card backs deeper in the Shadow deck."
    ],
    "appendix": false
  },
  {
    "id": "advance",
    "title": "Advance: move a whole battle line",
    "key": "Move every Shadow troop on the indicated battle line forward one location, starting with the frontmost group.",
    "bullets": [
      "Move all groups before resolving battles. Each troop advances only once, even if its starting location contains friendly troops.",
      "Troops already at the end do not advance, but still battle there if friendly troops are present. Troops off the indicated line do not move.",
      "Then resolve battles at locations containing both armies, from front to back. These battles use Shadow-troop counts, up to 3 dice, and do not move the Eye.",
      "Check for lost havens. A haven with Shadow troops and no friendly troops becomes a stronghold and loses 3 hope."
    ],
    "appendix": false,
    "image": "advance.png",
    "caption": "Follow the indicated colored line, not every connected path. Move frontmost groups first so no troop moves twice."
  },
  {
    "id": "reinforce",
    "title": "Reinforce and Nazgûl orders",
    "key": "Add one Shadow troop at the indicated location, resolve a battle if needed, then execute the special order.",
    "bullets": [
      "There is no per-location troop limit. If the supply cannot provide a Shadow troop, lose 1 hope for each missing troop.",
      "If the indicated stronghold was captured and is now a haven, skip adding that troop, but still resolve the rest of the card.",
      "Nazgûl occupy regions, not individual locations. When an order offers equally valid outcomes, the current player chooses."
    ],
    "appendix": false,
    "details": [
      {
        "title": "Move the Eye",
        "text": "Move the Eye to Frodo’s region. If it is already there, roll a search instead."
      },
      {
        "title": "Move 2 closer",
        "text": "Select the 2 Nazgûl closest to Frodo, excluding those already in his region. Move each one region closer, one at a time."
      },
      {
        "title": "Deploy 3 to the Eye",
        "text": "Move 3 Nazgûl directly to the Eye’s region, one at a time, taking from Mordor first. If Mordor is empty, take from the largest group outside the destination, recalculating after each move. If the Eye is in Mordor, recall 3 there instead, one at a time from the largest group outside Mordor."
      }
    ]
  },
  {
    "id": "finish",
    "title": "Objectives, hope and the final search",
    "key": "Complete every other selected objective before Frodo attempts to destroy the One Ring. Hope reaching zero means immediate defeat.",
    "bullets": [
      "Each objective card gives its own setup, requirements, and completion reward. Resolve its “When Completed” effect, then turn it facedown. Check character requirements during setup.",
      "At Mount Doom, Frodo spends an action and 5 Resistance to attempt the final objective. Roll a search using the usual enemies, plus one extra die for each hope missing from the track. Maximum: 7 dice.",
      "Example: with 3 hope left, add 5 dice before applying the 7-die cap. After the final search, at least 1 hope must remain to win.",
      "Capturing a stronghold gains 2 hope. Objectives and some abilities can also restore hope, but never beyond the top of the track."
    ],
    "appendix": false,
    "table": {
      "headers": [
        "Cause",
        "Hope lost"
      ],
      "rows": [
        [
          "Weary anywhere; Exposed outside a haven",
          "1 per result"
        ],
        [
          "Skies Darken: Eye already with Frodo",
          "2"
        ],
        [
          "A haven falls",
          "3"
        ],
        [
          "Missing Shadow troop / missing player-card draw",
          "1 per missing piece/card"
        ]
      ]
    }
  },
  {
    "id": "setup",
    "title": "Setup and difficulty",
    "key": "Choose objectives first, include their required characters, and prepare the decks for your player count and difficulty.",
    "bullets": [
      "Place hope and threat markers on the printed starting dots. Put the two special Shadow cards in the discard pile, then shuffle the other Shadow cards together despite their different backs.",
      "Place starting troops as printed on the board: 3 Dwarven, 4 Elven, 3 Rohirrim, 5 Gondor, and 18 Shadow troops. Draw 9 Shadow cards, adding 1 Shadow troop to each indicated red location; ignore all other card effects during setup. Discard those 9 cards.",
      "Place the Eye in Eriador. Place 9 Nazgûl: 2 Eriador, 1 Rhudaur, 1 Misty Mountains, 1 Gondor, and 4 Mordor. Place each selected character at its printed starting location.",
      "Shuffle the selected random events with all 48 region cards and deal starting hands. Divide the remaining player cards into as-even-as-possible piles, one per Skies Darken card. Shuffle one Skies Darken into each pile, then stack the piles with larger piles on top.",
      "The player holding the lowest-numbered region card starts; the first-game suggestion is the player controlling Frodo instead."
    ],
    "appendix": true,
    "table": {
      "headers": [
        "Players",
        "Events included",
        "Starting hand each"
      ],
      "rows": [
        [
          "1",
          "5",
          "4"
        ],
        [
          "2",
          "6",
          "4"
        ],
        [
          "3",
          "6",
          "3"
        ],
        [
          "4",
          "7",
          "2"
        ],
        [
          "5",
          "9",
          "2"
        ]
      ]
    },
    "details": [
      {
        "title": "Difficulty",
        "text": "Introductory: 4 Skies Darken / 4 objectives. Standard: 5 / 4. Heroic: 5 / 5. Epic: 6 / 5. Legendary: 6 / 6. Objective totals include Destroy the One Ring."
      },
      {
        "title": "First-game objectives",
        "text": "Attain the Blessing of the Elves; “Saruman, Your Staff Is Broken”; Challenge Sauron; Destroy the One Ring. Follow each objective’s setup instructions."
      },
      {
        "title": "First-game characters",
        "text": "Player 1: Frodo & Sam / Legolas. Player 2: Merry & Pippin / Éowyn. Player 3: Arwen / Aragorn. Player 4: Gandalf / Boromir. Player 5: Gimli / Éomer. Use the pairs needed for your player count."
      },
      {
        "title": "Required-character limit",
        "text": "If randomly selected objectives require more than 4 characters in a two-player game or 5 in solo, reshuffle the objectives and draw a new set."
      }
    ]
  },
  {
    "id": "solo",
    "title": "Solo rules",
    "key": "Control Frodo & Sam plus four other characters; all five share one hand and token pool.",
    "bullets": [
      "Place the four other characters in a row, with the solo token on the leftmost. That character gets up to 4 actions. Before or after all of those actions, Frodo & Sam may take 1 action.",
      "Draw 2 player cards and resolve Shadow cards as usual, then move the solo token one character to the right. After the fourth character, cycle back to the first. Frodo never receives the solo token or a four-action turn.",
      "Do not use the Fellowship action. Prepare requires both a haven and a card matching the character’s current region.",
      "Use 5 random event cards and a starting hand of 4. For a first solo game, the suggested four companions are Merry & Pippin, Éowyn, Legolas, and Gandalf."
    ],
    "appendix": true
  }
];
export const questions = [
  {
    "id": "q-turn",
    "topic": "turn",
    "prompt": "How may you split your normal actions?",
    "options": [
      "3 with each character",
      "Up to 4 with one and 1 with the other, without alternating",
      "Any split totaling 5"
    ],
    "answer": 1,
    "explanation": "Finish one character before switching; a 3 + 2 split is not allowed."
  },
  {
    "id": "q-symbols",
    "topic": "symbols",
    "prompt": "Must a card’s region match your location to spend its symbol?",
    "options": [
      "Always",
      "Only outside a haven",
      "No, unless a specific rule says otherwise"
    ],
    "answer": 2,
    "explanation": "Ordinary symbol payments ignore region; Fellowship has a separate region requirement."
  },
  {
    "id": "q-travel",
    "topic": "travel",
    "prompt": "Another character brings Frodo along by Travel. Who pays 1 Stealth to avoid the search?",
    "options": [
      "The character doing the Travel action",
      "Only Frodo",
      "Nobody; carrying Frodo is exempt"
    ],
    "answer": 0,
    "explanation": "The acting character pays, in addition to any special-path cost."
  },
  {
    "id": "q-search",
    "topic": "search",
    "prompt": "Frodo’s region has 2 Nazgûl; his location has 3 Shadow troops. How many search dice?",
    "options": [
      "3",
      "5",
      "6 because of the Eye"
    ],
    "answer": 1,
    "explanation": "Count region-wide Nazgûl plus local Shadow troops; the Eye adds no die."
  },
  {
    "id": "q-fellowship",
    "topic": "fellowship",
    "prompt": "Which normal Fellowship transfer is legal?",
    "options": [
      "A token to a character elsewhere in the region",
      "Any event card to someone at your location",
      "One region-matching card to another player with a character at your location"
    ],
    "answer": 2,
    "explanation": "Both players agree, share an exact location, and transfer one matching region card."
  },
  {
    "id": "q-prepare",
    "topic": "prepare",
    "prompt": "In multiplayer, where can you normally Prepare?",
    "options": [
      "At any haven with the matching token available",
      "At any location",
      "Only at a haven in the discarded card’s region"
    ],
    "answer": 0,
    "explanation": "Matching the card’s region is an additional solo restriction."
  },
  {
    "id": "q-muster",
    "topic": "muster",
    "prompt": "What does a normal Muster cost?",
    "options": [
      "1 Valor",
      "1 action and 1 Friendship",
      "No action if a troop is available"
    ],
    "answer": 1,
    "explanation": "Add one troop of the muster location’s color from the supply."
  },
  {
    "id": "q-battle",
    "topic": "battle",
    "prompt": "A Shadow card triggers battle with 2 friendly and 4 Shadow troops. How many dice?",
    "options": [
      "2",
      "4",
      "3"
    ],
    "answer": 2,
    "explanation": "Shadow-initiated battles count Shadow troops, capped at 3."
  },
  {
    "id": "q-capture",
    "topic": "capture",
    "prompt": "Can a character alone protect a haven containing Shadow troops?",
    "options": [
      "No; at least one friendly troop must remain",
      "Yes, any character can",
      "Only Frodo can"
    ],
    "answer": 0,
    "explanation": "After an action or effect, a haven with Shadow troops and no friendly troops falls, costing 3 hope."
  },
  {
    "id": "q-draw",
    "topic": "draw",
    "prompt": "The player deck is empty when you must draw two cards. What happens?",
    "options": [
      "Immediate defeat regardless of hope",
      "Lose 2 hope",
      "Reshuffle the discard pile"
    ],
    "answer": 1,
    "explanation": "Lose one hope per missing card; defeat occurs if hope reaches zero."
  },
  {
    "id": "q-darken",
    "topic": "darken",
    "prompt": "After resolving Skies Darken, do you replace it with another player card?",
    "options": [
      "Yes, always",
      "Only if your hand has fewer than 7 cards",
      "No"
    ],
    "answer": 2,
    "explanation": "Remove it from the game without drawing a replacement."
  },
  {
    "id": "q-shadow",
    "topic": "shadow",
    "prompt": "Which back selects the half of a flipped Shadow card?",
    "options": [
      "The new top card of the deck",
      "The card you just flipped",
      "The top discarded card"
    ],
    "answer": 0,
    "explanation": "New top back: red flag means Advance; black banner means Reinforce."
  },
  {
    "id": "q-advance",
    "topic": "advance",
    "prompt": "A troop advances into a location further along the same battle line. Does it advance again on this card?",
    "options": [
      "Yes, until blocked",
      "No, each troop advances once",
      "Only if there are no friendly troops"
    ],
    "answer": 1,
    "explanation": "Move frontmost groups first so every troop moves exactly once."
  },
  {
    "id": "q-reinforce",
    "topic": "reinforce",
    "prompt": "A Reinforce card names a captured stronghold that is now a haven. What happens?",
    "options": [
      "Ignore the entire card",
      "Add the troop anyway",
      "Skip the troop placement, but resolve the remaining instructions"
    ],
    "answer": 2,
    "explanation": "Capturing blocks that reinforcement, not the card’s special order."
  },
  {
    "id": "q-finish",
    "topic": "finish",
    "prompt": "Frodo has 3 hope and no enemies present at Mount Doom. How many dice for the final search?",
    "options": [
      "5",
      "0",
      "3"
    ],
    "answer": 0,
    "explanation": "Five hope is missing from the eight-space hope track, adding five dice even without enemies."
  }
];

topics.push(characterTopic);

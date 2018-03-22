/** Solitaire (obviously)
 *
 * By kleinesfilmröllchen
 * Enjoy reading throug this ES6 mess!
 */

//Buffer for "invisible" cards
let invisibleBuffer;

//The stacks that are used temporarily
const stacks = new Array(STACK_COUNT);
//The final stacks the cards need to go on
let finalStacks = new Array(4).fill(0);
//The stack from which cards are drawn
const drawStack = new Stack();
//the stack where cards are drawn onto
const openStack = new Stack();

//The stack which is used by the mouse to carry cards around
let carrierStack = new Stack();
let carrierStackX = 0,
	carrierStackY = 0;
//Mouse position in relation to the cards that were picked up
let mouseDeltaX = 0,
	mouseDeltaY = 0;

//Minimum y position for the working stacks
let workingStackStartY = 0;

//Stores whether the mouse was pressed in the last frame
let mouseWasPressed = false;
//stores whether cards have already been picked up
let alreadyPickedUp = false;
let prevMouseX = 0,
	prevMouseY = 0;

//stores last time draw was called
let lastTime = 0;

function preload() {
	languageData = loadJSON(`data/${loadLang()}.json`);
	//languageData = loadJSON(`data/en.json`);
}

function setup() {
	//setup language stuff
	document.getElementById("tease").innerHTML = languageData["tease"];
	document.getElementById("explanation").innerHTML = languageData["explanation"];
	document.getElementById("by").innerHTML = languageData["by"];
	document.getElementById("win").innerHTML = languageData["win"];
	//set document language for acessibility
	document.documentElement.setAttribute("lang", loadLang());
	let stuff = document.getElementsByClassName("game-name");
	for (let i = 0; i < stuff.length; ++i) {
		stuff[i].innerHTML = languageData["game-name"];
	}

	//smartphone detection stuff
	if (IS_MOBILE) {

	}
	createCanvas(700, 500);
	document.body.appendChild(document.createElement("DIV"));

	workingStackStartY = CARD_SIZE * 1.5 + CARD_SPACING * 2;
	pixelDensity(1);

	angleMode(DEGREES);

	////prepare invisible buffer
	invisibleBuffer = createGraphics(CARD_SIZE, CARD_SIZE * 1.5);
	console.log(invisibleBuffer.width, CARD_SIZE, invisibleBuffer.height, CARD_SPACING);
	invisibleBuffer.pixelDensity(1);
	invisibleBuffer.background(0, 0);
	//card rectangle
	invisibleBuffer.fill(255);
	invisibleBuffer.stroke(0);
	invisibleBuffer.strokeWeight(4);
	invisibleBuffer.rectMode(CORNERS);
	invisibleBuffer.rect(0, 0, CARD_SIZE, CARD_SIZE * 1.5, CORNER_SIZE, CORNER_SIZE, CORNER_SIZE, CORNER_SIZE);
	invisibleBuffer.strokeWeight(1);
	//draw a stripe pattern to indicate backside
	for (let position = 0; position <= CARD_SIZE * 2.5; position += STRIPE_SPACING) {
		//clip to card
		let x = Math.min(position, CARD_SIZE);
		let y = Math.min(position, CARD_SIZE * 1.5);
		invisibleBuffer.line(x, position - x, position - y, y);
	}

	// Setup Stacks

	//All options for cards
	let cardOptions = [
		1, 2, 3, 4, 5, 6, 7, 8, 9,
		10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
		20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
		30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
		40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
		50, 51, 52
	];

	//first stack has two cards, and stack size will be increasing
	let stackSize = 1;
	//for every stack
	for (let i = 0; i < stacks.length; ++i) {
		//cards for this stack
		let cards = [];
		for (let j = 0; j < stackSize; ++j) {
			//get a random card from the options
			let value = random(cardOptions);
			//get the values associated with this index
			let cardProperties = fromValueToCardProperties(value);

			//create card with chosen value and color
			let card = new Card(cardProperties[0], cardProperties[1]);

			//remove the card option
			cardOptions.splice(cardOptions.indexOf(value), 1);

			cards.push(card);
		}
		//new stack at that location
		stacks[i] = new Stack(cards);

		++stackSize;
	}

	//preparate draw stack and open stack
	drawStack.onlyTopCard = openStack.onlyTopCard = true;
	while (cardOptions.length > 0) {
		let val = random(cardOptions);
		cardProperties = fromValueToCardProperties(val);
		drawStack.add(new Card(cardProperties[0], cardProperties[1]));
		cardOptions.splice(cardOptions.indexOf(val), 1);
	}

	//preparate final stacks
	finalStacks = finalStacks.map(e => {
		let stack = new Stack([]);
		stack.onlyTopCard = true;
		return stack;
	});

	lastTime = millis();

	//card options is not needed anymore, as all cards have been distributed
}

//slower mouse checks for correct detection of click & drag
function mouseCheck() {
	mouseWasPressed = mouseIsPressed;
	prevMouseX = mouseX;
	prevMouseY = mouseY;
}
setInterval(mouseCheck, 40);

function draw() {
	//calculate elapsed time
	let elapsedTime = millis() - lastTime;

	//nice modern Solitaire-blue
	background(26, 104, 222);

	////Draw final stacks
	translate(FINAL_POS, CARD_SPACING);
	finalStacks.forEach((stack, index) => {
		stack.draw(elapsedTime);
		translate(CARD_SIZE + CARD_SPACING, 0);
	});
	resetMatrix();

	////Draw draw stack and open stack
	translate(CARD_SPACING, CARD_SPACING);
	drawStack.draw(elapsedTime);
	translate(CARD_SIZE + CARD_SPACING, 0);
	openStack.draw(elapsedTime);
	resetMatrix();

	////Draw working stacks
	push();
	//get spacing
	translate(CARD_SPACING, workingStackStartY);
	textSize(CARD_SPACING * 2);

	stacks.forEach((stack, index) => {
		stack.draw(elapsedTime);
		//translate right for spacing
		translate(CARD_SIZE + CARD_SPACING, 0);
		//working stack collision bounds
		/*
		if (stack.contains(mouseX, mouseY, index)) {
			const leftX = minX(index);
			const rightX = maxX(index);
			for (let i = 0; i < stack.length(); i++) {
				const upperY = minY(i, stack.length());
				const lowerY = maxY(i, stack.length());
				if (mouseX >= leftX && mouseX <= rightX &&
					mouseY >= upperY && mouseY <= lowerY) {
					//console.log(stack.cards[i]);
					push();
					resetMatrix();
					noFill();
					stroke(0, 255, 0);
					rect(leftX, upperY, rightX, lowerY);
					pop();
				}
			}
		}*/
	});
	pop();

	resetMatrix();

	////Draw mouse carrier stack
	if (!carrierStack.isEmpty()) {
		translate(carrierStackX, carrierStackY);
		carrierStack.draw(elapsedTime);
	}
	resetMatrix();

	////Win condition: every final stack has king as top card
	if (finalStacks.every(stack => stack.cards[0] ? stack.cards[0].value == 12 : false)) {
		document.getElementById("win").hidden = false;
		noLoop();
	}

	lastTime = millis();
}

function mousePressed() {
	////turning cards
	let turned = false;
	stacks.forEach((stack, index) => {
		//if mouse in stack bounds
		if (stack.contains(mouseX, mouseY, index)) {
			//unhide topmost card if not visible
			if (!stack.cards[0].isVisible) {
				stack.cards[0].isVisible = true;
				turned = true;
				return;
			}
		}
	});
	//no movement or mouse action if card turning performed
	if (turned) return false;

	//for mouse stuff (see function end)
	let actionPerformed = false;

	//// turn draw stack and pickup from open stack
	let drawMinX = CARD_SPACING,
		drawMinY = CARD_SPACING,
		drawMaxX = drawMinX + CARD_SIZE,
		drawMaxY = drawMinY + CARD_SIZE * 1.5;
	//300th bounds check -_-
	if (mouseX >= drawMinX && mouseX <= drawMaxX &&
		mouseY >= drawMinY && mouseY <= drawMaxY) {

		//always is action
		actionPerformed = true;

		//if draw stack empty: restore draw stack from open stack
		if (drawStack.isEmpty()) {
			const cards = openStack.remove(openStack.length());
			//reverse card order to get original order again
			if (cards instanceof Array) {
				cards.reverse();
				//make cards flipped again
				cards.forEach(card => {
					card.isVisible = false;
					/*card.animation = new Animation(
						createVector(drawMaxX + CARD_SPACING, drawMinY),
						createVector(drawMinX, drawMinY),
						ANIMATION_TIME);*/
				});
			} else {
				cards.isVisible = false;
				/*cards.animation = new Animation(
					createVector(drawMaxX + CARD_SPACING, drawMinY),
					createVector(drawMinX, drawMinY),
					ANIMATION_TIME);*/
			}
			console.log(cards, "restoring from open stack");
			drawStack.add(cards);
		} else {
			//remove 3 cards: "Windows" solitaire mode
			// COMBAK: adjustable amount of cards removed?
			let c = drawStack.remove(3);
			//reverse fixes errors with card order
			if (c instanceof Array) {
				c.reverse();
				c = c.map(e => {
					e.isVisible = true;
					console.log(drawMaxX, drawMinY);
					/*e.animation = new Animation(
						createVector(drawMinX, drawMinY),
						createVector(drawMaxX + CARD_SPACING, drawMinY),
						ANIMATION_TIME);*/
					return e;
				});
			} else {
				c.isVisible = true;
				/*c.animation = new Animation(
					createVector(drawMinX, drawMinY),
					createVector(drawMaxX + CARD_SPACING, drawMinY),
					ANIMATION_TIME);*/
			}
			console.log(c, "drawn from draw stack");

			openStack.add(c);
		}
	}
	//open stack pickup
	if (!alreadyPickedUp) {
		drawMinX += CARD_SIZE + CARD_SPACING;
		drawMaxX += CARD_SIZE + CARD_SPACING;
		if (mouseX >= drawMinX && mouseX <= drawMaxX &&
			mouseY >= drawMinY && mouseY <= drawMaxY) {

			actionPerformed = true;

			const c = openStack.remove(1);
			console.log(c, "picked up from open stack");

			carrierStack.add(c);
			carrierStack.oldCardX = drawMinX;
			carrierStack.oldCardY = drawMinY;
			carrierStack.oldCardLocation = OPEN_STACK;
			//store mouse position in relation to card position
			mouseDeltaX = mouseX - drawMinX;
			mouseDeltaY = mouseY - drawMinY;
		}
	}

	////new mouse press: calculate cards to pick up
	if (!alreadyPickedUp) {
		stacks.forEach((stack, index) => {
			//left and right bounds are the same in one stack
			const leftX = minX(index);
			const rightX = maxX(index);

			//figure out the card that was pressed
			for (let cardIndex = 0; cardIndex < stack.length(); cardIndex++) {
				const card = stack.cards[cardIndex];
				const upperY = minY(cardIndex, stack.length());
				const lowerY = maxY(cardIndex, stack.length());

				//if mouse is in card bounds and card is visible
				if (mouseX >= leftX && mouseX <= rightX &&
					mouseY >= upperY && mouseY <= lowerY &&
					card.isVisible) {

					actionPerformed = true;

					//add all cards to the carrier stack that are in front of this card
					const pickupCards = stack.remove(cardIndex + 1);
					console.log(pickupCards, "picked up at", cardIndex);

					carrierStack.add(pickupCards);
					carrierStack.oldCardLocation = index;
					carrierStack.oldCardX = leftX;
					carrierStack.oldCardY = upperY;

					//store mouse position in relation to card position: difference between mouse position and top left card corner
					mouseDeltaX = mouseX - leftX;
					mouseDeltaY = mouseY - upperY;

					break;
				}
			}
		});
	}

	//set already picked up indicator at some later point
	setTimeout(() => alreadyPickedUp = true, 100);

	// Certain users (especially mobile) should or must be able to resize and
	// scroll using the mouse/touches/similar. Therefore, we can't prevent
	// default mouse clicking and releasing at any time.
	// Solution: check if mouse was used and only if it was, prevent default behavior.
	return !actionPerformed;
}

function mouseDragged() {
	//set carrier stack position
	carrierStackX = mouseX - mouseDeltaX;
	carrierStackY = mouseY - mouseDeltaY;
}

function mouseReleased() {
	//dropping cards on stacks
	function dropCardsOnStack(stack, xpos, ypos) {
		const dropCards = carrierStack.remove(carrierStack.length());
		console.log(dropCards, "dropped");
		stack.add(dropCards);

		//animation setup: target is given
		if (dropCards instanceof Array) {
			dropCards.forEach((card, index) => {
				//calculate original vector and target vector
				let target = createVector(xpos,
					ypos + index * CARD_SPACING * 2);
				let original = createVector(carrierStackX,
					carrierStackY + index * CARD_SPACING * 2);
				card.animation = new Animation(original, target, ANIMATION_TIME);
			});
		} else {
			let target = createVector(xpos, ypos);
			let original = createVector(carrierStackX, carrierStackY);
			dropCards.animation = new Animation(original, target, ANIMATION_TIME);
		}
	}

	//no empty stack: cards are currently picked up
	if (!carrierStack.isEmpty()) {
		////figure out stack under mouse
		let success = stacks.find((stack, index) => {
			//if stack contains mouse
			if (stack.contains(mouseX, mouseY, index)) {
				const lastCCard = carrierStack.cards[carrierStack.length() - 1];
				const firstSCard = stack.cards[0];

				//stack is empty and lowest card to drop is a king
				if (stack.isEmpty()) {
					if (lastCCard.value == 12) {
						dropCardsOnStack(stack, window.minX(index), workingStackStartY);
						return true;
					}
				} else //colors differ with the lowest new card one value below the old top card
					if (firstSCard.isVisible && colorDiffer(lastCCard.color, firstSCard.color) &&
						lastCCard.value + 1 == firstSCard.value) {

						dropCardsOnStack(stack,
							window.minX(index),
							window.minY(-1, stack.length()));
						return true;
					} else {
						console.log("move invalid");
					}
			}
			return false;
		}); //end of carrier stack check

		////check final stacks
		const minY = CARD_SPACING,
			maxY = minY + CARD_SIZE * 1.5;

		if (carrierStack.length() == 1) {
			finalStacks.forEach((stack, index) => {
				const minX = FINAL_POS + (CARD_SIZE + CARD_SPACING) * index;
				const maxX = minX + CARD_SIZE + CARD_SPACING;
				//if in bounds
				if (mouseX >= minX && mouseX <= maxX &&
					mouseY <= maxY && mouseY >= minY) {
					const finalCCard = carrierStack.cards[carrierStack.length() - 1];
					const firstSCard = stack.cards[0];
					//if stack is empty and last card is ace
					if (stack.isEmpty()) {
						if (finalCCard.value == 13) {
							dropCardsOnStack(stack, minX, minY);
							success = true;
						}
					} else //color same and final value is one higher than first stack value or first stack value is ace and final value is 2
						if (finalCCard.color === firstSCard.color &&
							(finalCCard.value - 1 == firstSCard.value || (finalCCard.value == 1 && firstSCard.value == 13))) {
							dropCardsOnStack(stack, minX, minY);
							success = true;
						}
				}
			});
		}

		//no success: return cards to old location
		if (!success) {
			let dropCards = carrierStack.remove(carrierStack.length());
			//removed from open stack: always only one card
			if (carrierStack.oldCardLocation === OPEN_STACK) {
				openStack.add(dropCards);
				//animation
				dropCards.animation = new Animation(
					createVector(carrierStackX, carrierStackY),
					createVector(carrierStack.oldCardX, carrierStack.oldCardY),
					ANIMATION_TIME / 2);
			} else {
				stacks[carrierStack.oldCardLocation].add(dropCards);

				//array: separate animation positions for every card
				if (dropCards instanceof Array) {
					dropCards.forEach((card, index) => {
						//calculate original vector and target vector
						let target = createVector(carrierStack.oldCardX,
							carrierStack.oldCardY + index * CARD_SPACING * 2);
						let original = createVector(carrierStackX,
							carrierStackY + index * CARD_SPACING * 2);
						card.animation = new Animation(original, target,
							ANIMATION_TIME / 2);
					});
				} else {
					//simple card: position only for this card
					dropCards.animation = new Animation(
						createVector(carrierStackX, carrierStackY),
						createVector(carrierStack.oldCardX, carrierStack.oldCardY),
						ANIMATION_TIME / 2);
				}
			}
		}
	}

	alreadyPickedUp = false;
}

//Quick acessors for stack (x) and card (y) bounds
var minX = index => CARD_SPACING + index * (CARD_SIZE + CARD_SPACING);
var maxX = index => minX(index) + CARD_SIZE;
var minY = (index, count) => workingStackStartY + (count - (index + 1)) * CARD_SPACING * 2;
var maxY = (index, count) => minY(index, count) + CARD_SIZE * 1.5;

//Converts a value into card information
function fromValueToCardProperties(value) {
	//return as two-dimensional array
	let returner = new Array(2);

	//color
	if (value <= 13 && value >= 1) {
		returner[1] = cCol.DIAMONDS;
	} else if (value > 13 && value <= 26) {
		returner[1] = cCol.CLUBS;
	} else if (value > 26 && value <= 39) {
		returner[1] = cCol.HEARTS;
	} else if (value > 39 && value <= 52) {
		returner[1] = cCol.SPADES;
	}

	//real card "value"
	let realVal;
	switch (returner[1]) {
		case cCol.DIAMONDS:
			realVal = value;
			break;
		case cCol.CLUBS:
			realVal = value - 13;
			break;
		case cCol.HEARTS:
			realVal = value - 26;
			break;
		case cCol.SPADES:
			realVal = value - 39;
			break;

			//Shouldn't happen
		default:
			console.error(`You did something wrong with card color creation, and ${returner[1]} is not a color.`);
	}
	returner[0] = realVal;

	return returner;
}

//returns true if one of the colors is a black color and the other one a red color
const colorDiffer = (col1, col2) =>
	//color one red and color two black
	((col1 === cCol.DIAMONDS || col1 === cCol.HEARTS) && (col2 === cCol.CLUBS || col2 === cCol.SPADES)) ||
	//color two red and color one black
	((col2 === cCol.DIAMONDS || col2 === cCol.HEARTS) && (col1 === cCol.CLUBS || col1 === cCol.SPADES));

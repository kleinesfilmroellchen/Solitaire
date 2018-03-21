//One stack of cards
class Stack {
	constructor(cards) {
		//array of cards - top card is last
		this.cards = cards;
		//determines if at drawing only the top card is shown
		this.onlyTopCard = false;
	}

	length() {
		return this.cards ? this.cards.length : 0;
	}

	remove(count) {
		if (count === 1) {
			//remove topmost card
			return this.cards.shift();
		} else if (count > 1) {
			let returner = [];
			for (let i = 0; i < count; i++) {
				//empty while removing: might be a bug
				if (this.isEmpty()) {
					console.warn(languageData["w stack remove"] + count);
					return returner;
				}
				//add current first card to beginning of returner
				returner.push(this.cards.shift());
			}
			return returner;
		} else {
			throw languageData["e stack remove"] + count;
		}
	}

	add(card) {
		if (!this.cards) {
			this.cards = [];
		}
		//if array add whole array
		if (card instanceof Array) {
			card.reverse();
			for (let c of card) {
				this.cards.unshift(c);
			}
		} else if (card instanceof Card) {
			//if card add one card
			this.cards.unshift(card);
		} else {
			throw languageData["e stack add"];
		}
	}

	draw(elapsedTime) {
		//only if cards are undefined or null: draw "empty stack" outline
		if (this.isEmpty()) {
			noFill();
			stroke(0, 100);
			rect(0, 0, CARD_SIZE, CARD_SIZE * 1.5);
			return;
		}
		//draw only last (top card)
		if (this.onlyTopCard) {
			//if first card in animation also draw second card
			if (this.cards[0].animation && this.cards[1]) {
				this.cards[1].draw(elapsedTime);
			}
			this.cards[0].draw(elapsedTime);
		} else {
			//Draw in reverse order: last card is at the top
			let translateCounter = 0;
			for (let i = this.cards.length - 1; i >= 0; i--) {
				this.cards[i].draw(elapsedTime);
				//translate down
				translate(0, CARD_SPACING * 2);
				++translateCounter;
			}
			//pop somehow doesn't work: has the same effect
			translate(0, -CARD_SPACING * translateCounter * 2);
			//pop();
		}
	}

	//returns the first visible card
	firstVisible() {
		return this.cards.find(card => card.isVisible);
	}

	firstVisibleIndex() {
		return this.cards.indexOf(this.firstVisible());
	}

	//only returns true if cards array has contents
	isEmpty() {
		return this.length() <= 0;
	}

	contains(x, y, index) {
		return x >= minX(index) && x <= maxX(index) &&
			y >= workingStackStartY && y <= maxY(0, this.length());
	}
}

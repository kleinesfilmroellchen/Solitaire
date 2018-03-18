//Represents a playing card
class Card {
	constructor(val, col) {
		this.value = val;
		this.color = col;
		this.isVisible = false;
		this.animation = null;
	}

	//Draws itself from current (0|0)
	draw(elapsedTime) {
		//if animation move to animation location
		if (this.animation) {
			push();
			resetMatrix();
			translate(this.animation.currentPos.x, this.animation.currentPos.y);
		}

		push();
		//draw background rectangle
		fill(255);
		stroke(0);
		//thicker stroke if not visible
		strokeWeight(this.isVisible ? 1 : 2);
		rectMode(CORNERS);
		rect(0, 0, CARD_SIZE, CARD_SIZE * 1.5, CORNER_SIZE, CORNER_SIZE, CORNER_SIZE, CORNER_SIZE);

		if (!this.isVisible) {
			strokeWeight(1);
			//draw a stripe pattern to indicate backside
			for (let position = 0; position <= CARD_SIZE * 2.5; position += STRIPE_SPACING) {
				//clip to card
				let x = Math.min(position, CARD_SIZE);
				let y = Math.min(position, CARD_SIZE * 1.5);
				line(x, position - x, position - y, y);
			}
			//prevent front side drawing
			return;
		}

		//set drawing color
		switch (this.color) {
			case cCol.DIAMONDS:
			case cCol.HEARTS:
				fill(255, 0, 0);
				stroke(225, 0, 0);
				break;

			case cCol.CLUBS:
			case cCol.CROSSES:
				stroke(0, 0, 0);
				fill(0, 0, 0);
				break;
		}

		//Draw symbols
		strokeWeight(1);
		switch (this.color) {
			case cCol.DIAMONDS:
				beginShape();
				vertex(0.5 * CARD_SIZE, (1 / 3 * 1.5) * CARD_SIZE);
				vertex(2 / 3 * CARD_SIZE, 0.5 * 1.5 * CARD_SIZE);
				vertex(0.5 * CARD_SIZE, (2 / 3 * 1.5) * CARD_SIZE);
				vertex(1 / 3 * CARD_SIZE, 0.5 * 1.5 * CARD_SIZE);
				endShape(CLOSE);
				break;
			case cCol.HEARTS:
				beginShape();
				vertex(1 / 3 * CARD_SIZE, (1 / 3 * 1.5) * CARD_SIZE);
				vertex(2 / 3 * CARD_SIZE, (1 / 3 * 1.5) * CARD_SIZE);
				vertex(0.5 * CARD_SIZE, (2 / 3 * 1.5) * CARD_SIZE);
				endShape(CLOSE);
				break;
			case cCol.CLUBS:
				rectMode(CENTER);
				rect(0.5 * CARD_SIZE, 0.5 * 1.5 * CARD_SIZE, 0.1 * CARD_SIZE, 0.25 * CARD_SIZE);
				beginShape();
				vertex(0.5 * CARD_SIZE, 0.25 * 1.5 * CARD_SIZE);
				vertex(2 / 3 * CARD_SIZE, 0.5 * 1.5 * CARD_SIZE);
				vertex(1 / 3 * CARD_SIZE, 0.5 * 1.5 * CARD_SIZE);
				endShape(CLOSE);
				break;
			case cCol.CROSSES:
				rectMode(CENTER);
				rect(0.5 * CARD_SIZE, 1.5 * 0.5 * CARD_SIZE, 1 / 6 * CARD_SIZE, 1 / 3 * 1.5 * CARD_SIZE);
				rect(0.5 * CARD_SIZE, 1.5 * 0.5 * CARD_SIZE, 1 / 3 * 1.5 * CARD_SIZE, 1 / 6 * CARD_SIZE);
				break;
		}

		//Value
		let valueText = valToString(this.value);

		//right top text
		textAlign(RIGHT, TOP);
		text(valueText, CARD_SIZE - 2, 2);

		//bottom left text
		push();
		translate(0, CARD_SIZE * 1.5);
		rotate(180);
		textAlign(RIGHT, TOP);
		text(valueText, -2, 0);
		pop();

		pop();

		if (this.animation) {
			pop();
			this.animation.update(elapsedTime);
			if (this.animation.finished()) {
				this.animation = null;
			}
		}
	}
}

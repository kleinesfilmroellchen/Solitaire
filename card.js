//Represents a playing card
class Card {
	constructor(val, col) {
		this.value = val;
		this.color = col;
		this.isVisible = false;
		this.animation = null;
		this.normalBuffer = createGraphics(CARD_SIZE, CARD_SIZE * 1.5);

		//draw preparation
		this.normalBuffer.pixelDensity(1);
		this.normalBuffer.angleMode(DEGREES);
		this.normalBuffer.background(0, 0);
		//draw background rectangle
		this.normalBuffer.fill(255);
		this.normalBuffer.stroke(0);
		this.normalBuffer.strokeWeight(4);
		this.normalBuffer.rectMode(CORNERS);
		this.normalBuffer.rect(0, 0, CARD_SIZE, CARD_SIZE * 1.5, CORNER_SIZE, CORNER_SIZE, CORNER_SIZE, CORNER_SIZE);

		//set drawing color
		this.normalBuffer.textAlign(CENTER, CENTER);
		this.normalBuffer.textSize(50);
		this.normalBuffer.strokeWeight(1);
		switch (this.color) {
			case cCol.DIAMONDS:
			case cCol.HEARTS:
				this.normalBuffer.fill(255, 0, 0);
				this.normalBuffer.stroke(225, 0, 0);
				break;

			case cCol.CLUBS:
			case cCol.SPADES:
				this.normalBuffer.stroke(0, 0, 0);
				this.normalBuffer.fill(0, 0, 0);
				break;
		}

		//Draw symbols: lucky for us, there are unicode symbols for the colors!
		let symbol = "";
		switch (this.color) {
			case cCol.DIAMONDS:
				symbol = "♦";
				break;
			case cCol.HEARTS:
				symbol = "♥";
				break;
			case cCol.CLUBS:
				symbol = "♣"
				break;
			case cCol.SPADES:
				symbol = "♠";
				break;
		}
		//draw actual symbol text
		this.normalBuffer.text(symbol, CARD_SIZE / 2, 1 / 2 * 1.5 * CARD_SIZE);

		//Value
		let valueText = valToString(this.value);

		this.normalBuffer.textAlign(RIGHT, TOP);
		this.normalBuffer.textSize(16);

		//right top text
		this.normalBuffer.text(valueText, CARD_SIZE - 4, 2);

		//bottom left text
		this.normalBuffer.translate(0, CARD_SIZE * 1.5);
		this.normalBuffer.rotate(180);
		this.normalBuffer.textAlign(RIGHT, TOP);
		this.normalBuffer.text(valueText, -4, 2);
	}

	//Draws itself from current (0|0)
	draw(elapsedTime) {
		//if animation move to animation location
		if (this.animation) {
			push();
			resetMatrix();
			translate(this.animation.currentPos.x, this.animation.currentPos.y);
		}

		//draw buffers on screen using image
		if (this.isVisible) {
			image(this.normalBuffer, 0, 0, CARD_SIZE, CARD_SIZE * 1.5);
		} else {
			//invisible buffer is global
			image(invisibleBuffer, 0, 0, CARD_SIZE, CARD_SIZE * 1.5);
		}

		if (this.animation) {
			pop();
			this.animation.update(elapsedTime);
			if (this.animation.finished()) {
				this.animation = null;
			}
		}
	}
}

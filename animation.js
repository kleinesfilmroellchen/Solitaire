class Animation {
	constructor(startPos, endPos, time) {
		this.startPos = startPos;
		this.endPos = endPos;
		this.animationTime = time;
		this.currentTime = 0;
		this.currentPos = this.startPos;

		console.log(this);
	}

	update(elapsedTime) {
		//increase current time but cap to total animation time
		this.currentTime = Math.min(this.currentTime + elapsedTime, this.animationTime);
		//find current position by interpolation
		//console.log(this.currentTime / this.animationTime);
		p5.Vector.lerp(this.startPos, this.endPos, this.currentTime / this.animationTime, this.currentPos);
	}

	finished() {
		return this.currentTime >= this.animationTime;
	}
}

class PitchShift extends AudioWorkletProcessor {
	
	static get parameterDescriptors() {
		return [];
	}

	constructor(options) {
		super(options); 

		this.l = 2048*3;
		this.d = new Float32Array(this.l);
		this.r = 0;

		this.s1 = 0;
		this.c  = 0;
	}

	process (inputs, outputs, parameters) {

		let lOut	= outputs[0][0];
		let rOut	= outputs[0][1];
		let lIn     = inputs[0][0];
		let rIn     = inputs[0][1];

		let i = 0;

		while (i < 128) {
			let s = (lIn[i] + rIn[i])/2;

			this.d[this.r] = s;

			let out1 = Math.sin(Math.PI*this.s1/this.l)                       * this.d[(this.r+1+~~this.s1             )%this.l];
			let out2 = Math.sin(Math.PI*((this.s1 + this.l/2)%this.l)/this.l) * this.d[(this.r+1+~~(this.s1 + this.l/2))%this.l];

			lOut[i] = rOut[i] = out1 + out2;

			this.s1 += this.c;
			this.s1 %= this.l;

			this.r ++;
			this.r %=this.l;
			i++;
		}


		return true;
	}
}

registerProcessor('PitchShift', PitchShift);
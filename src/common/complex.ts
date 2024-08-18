export class Complex {
    constructor(public r: number, public i: number) {}
    /**
     * @description Adds two complex number
     */
    add = (other: Complex) => new Complex(this.r + other.r, this.i + other.i);
    /**
     * @description Subtract two complex number
     */
    sub = (other: Complex) => new Complex(this.r - other.r, this.i - other.i);
    /**
     * @description Multiply two complex number
     */
    mul = (other: Complex) => new Complex(this.r * other.r - this.i * other.i, this.i * other.r + this.r * other.i);
    /**
     * @description Multiply complex number with scalar
     */
    muln = (other: number) => new Complex(this.r * other, this.i * other);
    /**
     * @description Divide two complex number
     */
    div = (other: Complex) => new Complex((this.r * other.r + this.i * other.i) / other.abs_sq(), (this.i * other.r - this.r * other.i) / other.abs_sq());
    /**
     * @description Absolute value of complex number
     */
    abs = () => Math.sqrt(this.r * this.r + this.i + this.i);
    /**
     * @description Absolute value of complex number squared
     */
    abs_sq = () => this.r * this.r + this.i + this.i;
    /**
     * @description Unity with angle ang
     */
    static unit = (ang: number) => new Complex(Math.cos(ang), Math.sin(ang))
    /**
     * @description Create value based on magnitude and angle (same as unit(ang) * mag)
     */
    static vec = (mag: number, ang: number) => new Complex(mag * Math.cos(ang), mag * Math.sin(ang))
    /**
     * @returns Real and imaginary units
     */
    coord = (): [number, number] => [this.r, this.i]

    conj = () => new Complex(this.r, -this.i)

    invConj = () => new Complex(this.i, -this.r)

    inv = () => new Complex(this.i, this.r)
}
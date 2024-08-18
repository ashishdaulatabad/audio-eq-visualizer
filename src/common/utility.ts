export default {
    /**
     * @brief Pad for timer
     * @param number
     * @returns
     */
    padder(number: number) {
        return number < 10 ? '0' + number : number.toString()
    },
    padderString(number: string) {
        return number.length <= 1 ? '0' + number : number
    },

    timerSec(timeInSeconds: number) {
        const [min, sec] = [Math.floor(timeInSeconds / 60), Math.floor(timeInSeconds) % 60];
        return `${this.padder(min)}:${this.padder(sec)}`
    },

    linearToCubic(number: number, peak: number = 256, factor: number = 1): number {
        const real = number / (peak * factor);
        return real * real * real * peak;
    },

    linearToPower(number: number, power: number, peak: number = 256, factor: number = 1): number {
        const real = number / (peak * factor);
        return Math.pow(real, power) * peak;
    },

    linearToSquare(number: number, peak: number = 256, factor: number = 1): number {
        const real = number / (peak * factor);
        return real * real * peak;
    }
}

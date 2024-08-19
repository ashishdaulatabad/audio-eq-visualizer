import { Complex } from "../common/complex";
import utility from "../common/utility";

export function createBarCircleEq() {
    return {
        buffer: new Float32Array(0),
        angleInit: 0,
        backgroundColor: '#121314',
        textColor: '#d8dceb',
        lineType: 'Default',
        radius: 100,
        bandRanges: [
            [20, 260],
            [260, 500],
            [500, 2000],
            [2000, 5000],
            [5000, 15000],
        ],
        frequencyIncr: 0,
        volumeScaling: 0,
        barCircleFactor: 0,
    }
}

export function barCircleFormation(
    canvasContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    options: {
        buffer: Float32Array,
        textColor: string,
        backgroundColor: string,
        width: number,
        height: number,
        circleBarCount: number,
        lineType: string,
        bandRanges: Array<[number, number]>,
        frequencyIncr: number,
        volumeScaling: number,
        barCircleFactor: number,
        radius: number,
        angleInit: number
    }
) {
    const buffer = options.buffer;
    const [centerX, centerY] = [options.width / 2, options.height / 2];
    const anglePerBar = (2 * Math.PI) / (options.bandRanges.length * options.circleBarCount);

    let theta = options.angleInit;

    const change = Complex.unit(anglePerBar);
    const arcLength = options.radius * anglePerBar;
    let unitAng = Complex.unit(theta);
    let angle = Complex.vec(options.radius, theta);

    canvasContext.lineWidth = arcLength - arcLength / 10;
    canvasContext.lineCap = 'round';
    let i = 0;

    for (const [startRange, endRange] of options.bandRanges) {
        const totalBands = (endRange - startRange) / options.frequencyIncr;
        const indexIncrement = totalBands / options.circleBarCount;
        let perBandValue = 0;

        for (; perBandValue < options.circleBarCount; ++perBandValue, i += indexIncrement) {
            const v = buffer[Math.floor(i)] + 128.0;

            if (v > 0) {
                const y =
                    utility.linearToPower(v, 4, 256, options.volumeScaling) *
                    options.barCircleFactor;
                const normal = unitAng.muln(y);
                const [xc, yc] = angle.coord();
                const [xb, yb] = normal.coord();
                canvasContext.moveTo(xc + centerX, yc + centerY);
                canvasContext.lineTo(xc + centerX + xb, yc + centerY + yb);
            }

            angle = angle.mul(change);
            unitAng = unitAng.mul(change);
            theta += anglePerBar;
        }
    }

    canvasContext.stroke();
}

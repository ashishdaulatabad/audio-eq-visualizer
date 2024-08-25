import { Complex } from "../common/complex";
import utility from "../common/utility";

export type BarCircleOptions = {
    type: 'BarCircle',
    circleBarCount: number,
    lineType: string,
    bandRanges: Array<[number, number]>,
    frequencyIncr: number,
    volumeScaling: number,
    barCircleFactor: number,
    radius: number,
    fn: (c: CanvasRenderingContext2D, _: any) => void
    angleInit: number,
    timeStamp: number,
    angularVelocity: number,
}

export function createBarCircleEq(frequencyIncr: number): BarCircleOptions {
    return {
        type: 'BarCircle',
        angleInit: 0,
        lineType: 'Default',
        radius: 175,
        circleBarCount: 20,
        bandRanges: [
            [20, 260],
            [260, 500],
            [500, 2000],
            [2000, 5000],
            [5000, 15000],
        ],
        fn: barCircleFormation,
        frequencyIncr,
        volumeScaling: 0.5,
        barCircleFactor: 3.0,
        timeStamp: performance.now(),
        angularVelocity: 2 * Math.PI / 100,
    }
}

export function barCircleFormation(
    canvasContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    options: BarCircleOptions & {
        buffer: Float32Array,
        analyser: AnalyserNode,
        width: number,
        height: number,
    }
) {
    options.analyser.getFloatFrequencyData(options.buffer);
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
    const currentTimestamp = performance.now();

    canvasContext.beginPath();
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
    options.angleInit += ((currentTimestamp - options.timeStamp) / 1000) * options.angularVelocity;
    options.timeStamp = currentTimestamp;

    canvasContext.stroke();
}

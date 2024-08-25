import { Complex } from "../common/complex";
import utility from "../common/utility";

export type WaveCircleOptions = {
    type: 'WaveCircle',
    angleInit: number,
    lineType: string,
    radius: number,
    bandRanges: Array<[number, number]>,
    waveCounts: number,
    frequencyIncr: number,
    volumeScaling: number,
    fn: (c: CanvasRenderingContext2D, _: any) => void,
    barCircleFactor: number,
    timeStamp: number,
    angularVelocity: number,
}

export function createOptionsForWaveCircle(frequencyIncr: number): WaveCircleOptions {
    return {
        type: 'WaveCircle',
        angleInit: 0,
        lineType: 'Normal',
        radius: 175,
        bandRanges: [
            [20, 260],
            [260, 500],
            [500, 2000],
            [2000, 5000],
            [5000, 15000],
        ],
        fn: waveCircleFormation,
        waveCounts: 24,
        frequencyIncr,
        volumeScaling: 0.5,
        barCircleFactor: 2.25,
        timeStamp: performance.now(),
        angularVelocity: 2 * Math.PI / 100,
    }
}

export function waveCircleFormation(
    canvasContext: CanvasRenderingContext2D,
    options: WaveCircleOptions & {
        buffer: Float32Array,
        width: number,
        analyser: AnalyserNode,
        height: number,
    }
) {
    options.analyser.getFloatFrequencyData(options.buffer);
    const [centerX, centerY] = [options.width / 2, options.height / 2];
    const anglePerBar = (2 * Math.PI) / (options.bandRanges.length * options.waveCounts);
    let theta = options.angleInit;

    let angle = Complex.vec(options.radius, theta);
    const change = Complex.unit(anglePerBar);
    let unitAng = Complex.unit(theta);
    canvasContext.lineWidth = 2;

    let i = 0;
    let firstPoint = null;
    let prevPoints = [0, 0];
    const currentTimestamp = performance.now();
    canvasContext.beginPath();

    for (const [startRange, endRange] of options.bandRanges) {
        const totalBands = (endRange - startRange) / options.frequencyIncr;
        const indexIncrement = totalBands / options.waveCounts;
        let perBandValue = 0;

        for (; perBandValue < options.waveCounts; ++perBandValue, i += indexIncrement) {
            const v = options.buffer[Math.ceil(i)] + 128.0;

            const y =
                utility.linearToPower(v, 4, 256, options.volumeScaling) *
                options.barCircleFactor;

            const normal = unitAng.muln(y);
            const [xc, yc] = angle.coord();
            const [xb, yb] = normal.coord();

            if (firstPoint === null) {
                firstPoint = [xc + centerX + xb, yc + centerY + yb];
                canvasContext.moveTo(xc + centerX + xb, yc + centerY + yb);
            } else {
                canvasContext.quadraticCurveTo(
                    prevPoints[0],
                    prevPoints[1],
                    xc + centerX + xb,
                    yc + centerY + yb,
                );
            }

            prevPoints = [xc + centerX + xb, yc + centerY + yb];

            angle = angle.mul(change);
            unitAng = unitAng.mul(change);
            theta += anglePerBar;
        }
    }
    options.angleInit += ((currentTimestamp - options.timeStamp) / 1000) * options.angularVelocity;
    options.timeStamp = currentTimestamp;

    canvasContext.stroke();
}

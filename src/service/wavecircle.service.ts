import { Complex } from "../common/complex";
import utility from "../common/utility";
import { withDocumentDim, Dim } from "./util.service";

export type WaveCircleOptions = {
    type: 'Wave Circle',
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
} & Dim

export function createOptionsForWaveCircle(frequencyIncr: number, isCircleSpike?: boolean): WaveCircleOptions {
    return withDocumentDim({
        type: 'Wave Circle',
        angleInit: 0,
        lineType: 'Normal',
        radius: isCircleSpike ? 225 : 175,
        bandRanges: [
            [20, 260],
            [260, 500],
            [500, 2000],
            [2000, 5000],
            [5000, 15000],
        ],
        fn: isCircleSpike ? circleSpikeFormation : waveCircleFormation,
        waveCounts: 24,
        frequencyIncr,
        volumeScaling: 0.5,
        barCircleFactor: isCircleSpike ? 1.75 : 2.25,
        timeStamp: performance.now(),
        angularVelocity: 2 * Math.PI / 100,
    });
}

export function waveCircleFormation(
    canvasContext: CanvasRenderingContext2D,
    options: WaveCircleOptions & {
        buffer: Float32Array,
        analyser: AnalyserNode,
    }
) {
    options.analyser.getFloatFrequencyData(options.buffer);
    const [centerX, centerY] = [options.width / 2, options.height / 2];
    const anglePerBar = (2 * Math.PI) / (options.bandRanges.length * options.waveCounts);
    let theta = options.angleInit;

    let angle = Complex.vec(options.height / 4, theta);
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

export function circleSpikeFormation(
    canvasContext: CanvasRenderingContext2D,
    options: WaveCircleOptions & {
        buffer: Float32Array,
        width: number,
        analyser: AnalyserNode,
        height: number,
    }
) {
    options.analyser.getFloatFrequencyData(options.buffer);
    const centerX = options.width / 2,
          centerY = options.height / 2,
          anglePerBar = Math.PI / (options.bandRanges.length * options.waveCounts);

    let theta = options.angleInit;
    canvasContext.lineWidth = 3;

    let i = 0, firstPoint = null, prevPoints = [0, 0, 0, 0], arrayIndex = 0;
    const currentTimestamp = performance.now();
    canvasContext.beginPath();

    const values: Float32Array = new Float32Array(options.bandRanges.length * options.waveCounts);

    for (const [startRange, endRange] of options.bandRanges) {
        const totalBands = (endRange - startRange) / options.frequencyIncr;
        const indexIncrement = totalBands / options.waveCounts;
        let perBandValue = 0;

        for (; perBandValue < options.waveCounts; ++perBandValue, i += indexIncrement) {
            const v = options.buffer[Math.ceil(i)] + 128.0;
            values[arrayIndex++] = utility.linearToPower(v, 4, 256, options.volumeScaling) * options.barCircleFactor;
        }
    }

    const spectrum = new Float32Array(values.length * 2);
    spectrum.subarray(0, values.length).set(values);
    spectrum.subarray(values.length).set(values.reverse());

    const averageBass = spectrum
        .subarray(0, 2 * options.waveCounts)
        .reduce((prev, curr) => prev + curr, 0) / (2 * options.waveCounts);
    
    const radius = Math.min(options.width, options.height) / 4;
    let angle = Complex.vec(radius + utility.linearToPower(averageBass, 2, 256, 1), theta),
        change = Complex.unit(anglePerBar),
        unitAng = Complex.unit(theta);

    canvasContext.lineWidth = 3;

    for (const y of spectrum) {
        const normal = unitAng.muln(y);
        const [xc, yc] = angle.coord();
        const [xb, yb] = normal.coord();

        if (firstPoint === null) {
            firstPoint = [xc + centerX, yc + centerY, xb, yb];
        } else {
            canvasContext.moveTo(prevPoints[0] + prevPoints[2], prevPoints[1] + prevPoints[3]);
            canvasContext.quadraticCurveTo(
                prevPoints[0] + prevPoints[2],
                prevPoints[1] + prevPoints[3],
                xc + centerX + xb,
                yc + centerY + yb,
            );

            canvasContext.moveTo(prevPoints[0] - prevPoints[2], prevPoints[1] - prevPoints[3]);
            canvasContext.quadraticCurveTo(
                prevPoints[0] - prevPoints[2],
                prevPoints[1] - prevPoints[3],
                xc + centerX - xb,
                yc + centerY - yb,
            );
            canvasContext.moveTo(xc + centerX + xb, yc + centerY + yb);
            canvasContext.lineTo(
                xc + centerX - xb,
                yc + centerY - yb,
            );
        }

        prevPoints = [xc + centerX, yc + centerY, xb, yb];

        angle = angle.mul(change);
        unitAng = unitAng.mul(change);
        theta += anglePerBar;
    }

    canvasContext.moveTo(prevPoints[0] + prevPoints[2], prevPoints[1] + prevPoints[3]);

    canvasContext.quadraticCurveTo(
        // @ts-expect-error
        prevPoints[0] + prevPoints[2], prevPoints[1] + prevPoints[3], firstPoint[0] + firstPoint[2], firstPoint[1] + firstPoint[3],
    );

    canvasContext.moveTo(prevPoints[0] - prevPoints[2], prevPoints[1] - prevPoints[3]);
    canvasContext.quadraticCurveTo(
        // @ts-expect-error
        prevPoints[0] - prevPoints[2], prevPoints[1] - prevPoints[3], firstPoint[0] - firstPoint[2], firstPoint[1] - firstPoint[3],
    );
    
    options.angleInit += ((currentTimestamp - options.timeStamp) / 1000) * options.angularVelocity;
    options.timeStamp = currentTimestamp;

    canvasContext.stroke();
}

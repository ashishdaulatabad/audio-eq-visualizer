import { Complex } from "../common/complex";
import utility from "../common/utility";

export function applyTransformation(
    canvasContext: CanvasRenderingContext2D,
    renderingFns: Array<(_: CanvasRenderingContext2D, _1: any) => void>,
    optionsArray: any[]
) {
    renderingFns.forEach((callbackfn, index) => callbackfn(canvasContext, optionsArray[index]));
}

export function complement(rgb: string) {
    const split = ~parseInt(rgb.split('#')[1], 16);
    const correction = 0x00_FF_FF_FF & split;
    return '#' + [
        utility.padderString((correction >> 16).toString(16)),
        utility.padderString(((correction >> 8) & 0xFF).toString(16)),
        utility.padderString((correction & 0xFF).toString(16))
    ].join('');
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

export function waveCircleFormation(
    canvasContext: CanvasRenderingContext2D,
    options: {
        buffer: Float32Array,
        angleInit: number,
        backgroundColor: string,
        textColor: string,
        lineType: string,
        radius: number,
        width: number,
        height: number,
        bandRanges: Array<[number, number]>,
        waveCounts: number,
        frequencyIncr: number,
        volumeScaling: number,
        barCircleFactor: number
    }
) {
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

    for (const [startRange, endRange] of options.bandRanges) {
        const totalBands = (endRange - startRange) / options.frequencyIncr;
        const indexIncrement = totalBands / options.waveCounts;
        let perBandValue = 0;

        for (; perBandValue < options.waveCounts; ++perBandValue, i += indexIncrement) {
            const v = options.buffer[Math.ceil(i)] + 128.0;

            const y =
                utility.linearToPower(v, 4, 256, options.volumeScaling) *
                options.barCircleFactor;
            // Should be
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

    canvasContext.stroke();
}

export function waveFormation(
    canvasContext: CanvasRenderingContext2D,
    options: {
        width: number,
        height: number,
        buffer: Uint8Array,
    }
) {
    const base = options.height, base_2 = base / 2;
    const buffer = options.buffer;
    const sliceWidth = options.width / options.buffer.length;
    let x = 0;
    const v = buffer[0] / 128 - 1.0, y = base_2 + v * 256;
    canvasContext.moveTo(0, y);

    for (let i = 1; i < buffer.length; i++) {
        const v = buffer[i] / 128 - 1.0;
        const y = base_2 + v * 256;

        canvasContext.lineTo(x, y);
        x += sliceWidth;
    }

    canvasContext.stroke();
}

export function createRandomParticleSeeding(
    length: number,
    xScale: number,
    yScale: number,
    xVelScale: number,
    yVelScale: number,
    xAccelScale: number,
    yAccelScale: number,
): { timeStamp: number, buffer: Array<[number, number, number, number, number, number]> } {
    return {
        timeStamp: performance.now(),
        buffer: Array.from({ length }, (_, index) => [
            Math.random() * xScale,
            Math.random() * yScale,
            Math.random() * ((index & 3) > 1 ? -1 : 1) * xVelScale,
            Math.random() * ((index & 3) <= 1 ? -1 : 1) * yVelScale,
            Math.random() * ((index & 1) ? -1 : 1) * xAccelScale,
            Math.random() * ((index & 1) ? 1 : -1) * yAccelScale,
        ])
    };
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function applyParticleTransformation(
    canvasContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    options: {
        textColor: string,
        backgroundColor: string,
        width: number,
        height: number,
        axScale: number,
        ayScale: number,
        positionalSeeds: {
            timeStamp: number,
            buffer: Array<[number, number, number, number, number, number]>
        },
    }
) {
    canvasContext.fillStyle = options.textColor;
    const currentTimeStamp = performance.now();

    const timeChange = (currentTimeStamp - options.positionalSeeds.timeStamp) / 1000;
    for (let index = 0; index < options.positionalSeeds.buffer.length; ++index) {
        let [x, y, vx, vy, ax, ay] = options.positionalSeeds.buffer[index];
        canvasContext.fillRect(x, y, 1, 1);
        [ax, ay] = Complex.vec(options.axScale + options.ayScale, 2 * Math.random() * Math.PI).coord();

        vx += ax * timeChange;
        vx = clamp(vx, -50, 50);
        vy += (ay * timeChange);
        vy = clamp(vy, -50, 50);

        x += vx * timeChange;
        y += vy * timeChange;

        if (x < 0) {
            x += options.width;
        } else if (x > options.width) {
            x -= options.width;
        }

        if (y < 0) {
            y += options.height;
        } else if (y > options.height) {
            y -= options.height;
        }

        options.positionalSeeds.buffer[index] = [x, y, vx, vy, ax, ay];
    }

    options.positionalSeeds.timeStamp = currentTimeStamp;
    canvasContext.stroke();
}

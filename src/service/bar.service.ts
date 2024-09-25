import utility from "../common/utility";
import { withDocumentDim, Dim } from "./util.service";

const color = (magnitude: number) => {
    if (magnitude < 200) return 'rgb(135 255 66)';
    if (magnitude < 275) return 'rgb(255 192 98)';
    return 'rgb(255 75 99)';
};

export type BarOptions = {
    type: 'Bar',
    bandBarCount: number,
    lineType: string,
    bandRanges: Array<[number, number]>,
    frequencyIncr: number,
    volumeScaling: number,
    barFactor: number,
    mirrored?: boolean,
    fn: (c: CanvasRenderingContext2D, _: any) => void,
} & Dim

export function createOptionsForBar(frequencyIncr: number, mirrored?: boolean): BarOptions {
    return withDocumentDim<BarOptions>({
        type: 'Bar',
        bandBarCount: 16,
        lineType: 'Normal',
        bandRanges: [
            [20, 260],
            [260, 500],
            [500, 2000],
            [2000, 5000],
            [5000, 15000],
        ],
        frequencyIncr,
        volumeScaling: 0.4,
        barFactor: 3.0,
        mirrored,
        fn: barFormation
    });
}

function drawRetroForBar(
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    width: number,
    toY: number,
) {
    const magnitude = Math.abs(toY - fromY);
    const block = 25,
        padding = 8;
    context.lineCap = 'square';
    let ix = fromX,
        iy = fromY;

    for (
        let iter = 0, rBlock = 0;
        rBlock < magnitude;
        rBlock += block, iter += 1
    ) {
        context.fillStyle = color(rBlock);
        context.fillRect(ix, iy, width, block - padding);
        iy -= block;
    }
}

function drawLineForBar(
    lineType: string,
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    width: number,
    toY: number,
) {
    context.moveTo(fromX, fromY);
    switch (lineType) {
        case 'Normal':
            context.fillRect(fromX, fromY, context.lineWidth, toY - fromY);
            break;

        case 'Retro':
            drawRetroForBar(context, fromX, fromY, width, toY);
            break;
    }
}

export function barFormation(
    canvasContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    options: BarOptions & {
        buffer: Float32Array,
        analyser: AnalyserNode,
        width: number,
        height: number,
    }
) {
    options.analyser.getFloatFrequencyData(options.buffer);
    const buffer = options.buffer;
    const sliceWidth = options.width / (options.bandBarCount * 5);
    canvasContext.lineWidth = sliceWidth - sliceWidth / 10;
    const base = options.height;
    canvasContext.lineCap = 'square';

    canvasContext.beginPath();
    let x = 0, i = 0;

    if (!options.mirrored) {
        for (const [startRange, endRange] of options.bandRanges) {
            const totalBands = (endRange - startRange) / options.frequencyIncr;
            const indexIncrement = totalBands / options.bandBarCount;
            let perBandValue = 0;

            for (; perBandValue < options.bandBarCount; ++perBandValue, i += indexIncrement) {
                const v = buffer[Math.floor(i)] + 128.0;

                if (v > 0) {
                    const y = base - utility.linearToPower(v, 4, 256, options.volumeScaling) * options.barFactor;
                    drawLineForBar(options.lineType, canvasContext, x, base, canvasContext.lineWidth, y);
                }

                x += sliceWidth;
            }
        }
    } else {
        const base = (options.height / 2) + 50;
        const tempFill = canvasContext.strokeStyle;

        for (const [startRange, endRange] of options.bandRanges) {
            const totalBands = (endRange - startRange) / options.frequencyIncr;
            const indexIncrement = totalBands / options.bandBarCount;
            let perBandValue = 0;

            for (; perBandValue < options.bandBarCount; ++perBandValue, i += indexIncrement) {
                const v = buffer[Math.floor(i)] + 128.0;

                if (v > 0) {
                    const y = utility.linearToPower(v, 4, 256, options.volumeScaling) * (options.barFactor / 1.65);
                    canvasContext.fillStyle = tempFill;
                    drawLineForBar(options.lineType, canvasContext, x, base, canvasContext.lineWidth, base - y); 
                    canvasContext.fillStyle = tempFill + "90";
                    drawLineForBar(options.lineType, canvasContext, x, base, canvasContext.lineWidth, base + y);
                }

                x += sliceWidth;
            }
        }
    }

    canvasContext.stroke();
}

import { Complex } from "../common/complex";
import utility from "../common/utility";
import { Dim, withDocumentDim } from "./util.service";

export function applyTransformation(
    canvasContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    optionsArray: any[],
) {
    optionsArray.forEach((option) => option.fn(canvasContext, option));
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

export type ParticleOptions = {
    type: 'Particle',
    timeStamp: number,
    length: number,
    fn: (c: CanvasRenderingContext2D, _: any) => void,
    isSpiral: boolean,
    checkSpiral: (event: InputEvent) => void,
    buffer: {
        x: Float32Array,
        y: Float32Array,
        vx: Float32Array,
        vy: Float32Array,
        ax: Float32Array,
        ay: Float32Array
    };
} & Dim

export function createRandomParticleSeeding(
    length: number,
    xScale: number,
    yScale: number,
    xVelScale: number,
    yVelScale: number,
    xAccelScale: number,
    yAccelScale: number,
): ParticleOptions {
    return withDocumentDim({
        type: 'Particle',
        timeStamp: performance.now(),
        length,
        fn: applyParticleTransformation,
        isSpiral: false,
        checkSpiral: function (event: InputEvent) {
            this.isSpiral = (event.target as HTMLInputElement).checked;
        },
        buffer: {
            x: new Float32Array(length).map(_ => (Math.random() * xScale)),
            y: new Float32Array(length).map(_ => (Math.random() * yScale)),
            vx: new Float32Array(length).map(_ =>(Math.random() * xVelScale)),
            vy: new Float32Array(length).map(_ => (Math.random() * yVelScale)),
            ax: new Float32Array(length).map(_ => (Math.random() * xAccelScale)),
            ay: new Float32Array(length).map(_ => (Math.random() * yAccelScale)),
        },
    });
}

const clamp = (value: number, min: number, max: number) => (
    Math.min(Math.max(value, min), max)
)

export function applyParticleTransformation(
    canvasContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    options: ParticleOptions & {
        textColor: string,
    }
) {
    canvasContext.fillStyle = options.textColor;
    canvasContext.beginPath();
    const currentTimeStamp = performance.now();

    const timeChange = (currentTimeStamp - options.timeStamp) / 1000;
    for (let index = 0; index < options.length; ++index) {
        let [x, y, vx, vy, ax, ay] = [
            options.buffer.x[index],
            options.buffer.y[index],
            options.buffer.vx[index],
            options.buffer.vy[index],
            options.buffer.ax[index],
            options.buffer.ay[index],
        ];
        if (options.isSpiral) {
            canvasContext.fillRect(x, y, 1 + (vx > 0 ? 1 : 0), 1 + (vx > 0 ? 1 : 0));
            [ax, ay] = Complex.vec(8, Math.random() * Math.PI).coord();
        } else {
            canvasContext.fillRect(x, y, 1, 1);
            [ax, ay] = Complex.vec(16, 2 * Math.random() * Math.PI).coord();
        }

        vx += ax * timeChange;
        vx = clamp(vx, -20, 20);
        vy += ay * timeChange;
        vy = clamp(vy, -20, 20);

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

        options.buffer.x[index] = x;
        options.buffer.y[index] = y;
        options.buffer.vx[index] = vx;
        options.buffer.vy[index] = vy;
        options.buffer.ax[index] = ax;
        options.buffer.ay[index] = ay;
    }

    options.timeStamp = currentTimeStamp;
    canvasContext.stroke();
}

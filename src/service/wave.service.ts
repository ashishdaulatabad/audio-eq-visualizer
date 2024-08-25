export type WaveOptions = {
    type: 'Wave',
    fn: (c: CanvasRenderingContext2D, _: any) => void
}

export function createOptionsForWave(): WaveOptions {
    return {
        type: 'Wave',
        fn: waveFormation
    };
}

export function waveFormation(
    canvasContext: CanvasRenderingContext2D,
    options: WaveOptions & {
        width: number,
        height: number,
        analyser: AnalyserNode,
        buffer: Uint8Array,
    }
) {
    canvasContext.lineWidth = 2;
    options.analyser.getByteTimeDomainData(options.buffer);
    const base = options.height, base_2 = base / 2;
    const buffer = options.buffer;
    const sliceWidth = options.width / options.buffer.length;
    let x = 0;
    const v = buffer[0] / 128 - 1.0, y = base_2 + v * 256;
    canvasContext.beginPath();
    canvasContext.moveTo(0, y);

    for (let i = 1; i < buffer.length; i++) {
        const v = buffer[i] / 128 - 1.0;
        const y = base_2 + v * 512;

        canvasContext.lineTo(x, y);
        x += sliceWidth;
    }

    canvasContext.stroke();
}

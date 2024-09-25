import init, * as wasm from "wasm-eq-visualizer";
import { withDocumentDim, Dim } from "./util.service";

export type ChromeAbbr = {
    offCanvas: OffscreenCanvas,
    context: OffscreenCanvasRenderingContext2D,
    outCanvas: OffscreenCanvas,
    outContext: OffscreenCanvasRenderingContext2D,
    r: ImageData,
    g: ImageData,
    b: ImageData,
} & Dim;

init({ module_or_path: './wasm_eq_visualizer_bg.wasm' });

export function resizeBuffer(
    data: ChromeAbbr,
    width: number,
    height: number
) {
    data.outCanvas.width = width;
    data.outCanvas.height = height;
    data.offCanvas.width = width;
    data.offCanvas.height = height;

    data.r = data.context.createImageData(width, height);
    data.g = data.context.createImageData(width, height);
    data.b = data.context.createImageData(width, height);
}

export function createBufferForChromaticAbberation(
    width: number,
    height: number,
): ChromeAbbr {
    const offCanvas = new OffscreenCanvas(width, height);
    const context = offCanvas.getContext('2d', { willReadFrequently: true }) as OffscreenCanvasRenderingContext2D;
    const outCanvas = new OffscreenCanvas(width, height);
    const outContext = outCanvas.getContext('2d', { willReadFrequently: true }) as OffscreenCanvasRenderingContext2D;

    return withDocumentDim({
        offCanvas,
        context,
        outCanvas,
        outContext,
        r: context.createImageData(width, height),
        g: context.createImageData(width, height),
        b: context.createImageData(width, height),
    }, (currConfig: ChromeAbbr & Dim) => {
        currConfig.offCanvas.width = currConfig.width;
        currConfig.offCanvas.height = currConfig.height;

        currConfig.outCanvas.width = currConfig.width;
        currConfig.outCanvas.height = currConfig.height;
    });
}

export function chromaticAbberationTransform(
    canvasContext: OffscreenCanvasRenderingContext2D,
    options: {
        width: number,
        height: number,
        rxDrift: number,
        ryDrift: number,
        gxDrift: number,
        gyDrift: number,
        bxDrift: number,
        byDrift: number,
        channelData: ChromeAbbr
    }
) {
    const imageData = canvasContext.getImageData(0, 0, options.width, options.height);
    wasm.apply_particle_transformation_for_canvas_2d(
        imageData,
        options.width,
        options.height,
        options.rxDrift,
        options.ryDrift,
        options.gxDrift,
        options.gyDrift,
        options.bxDrift,
        options.byDrift,
        options.channelData.context,
        options.channelData.offCanvas,
        options.channelData.outContext
    );
}

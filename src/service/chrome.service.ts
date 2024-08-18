import init, * as wasm from "wasm-eq-visualizer";

export type ChromeAbbr = {
    offCanvas: OffscreenCanvas,
    context: OffscreenCanvasRenderingContext2D,
    outCanvas: OffscreenCanvas,
    outContext: OffscreenCanvasRenderingContext2D,
    r: ImageData,
    g: ImageData,
    b: ImageData,
}

if (init) {
    init({ module_or_path: './wasm_eq_bg.wasm' });
}

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

    return {
        offCanvas,
        context,
        outCanvas,
        outContext,
        r: context.createImageData(width, height),
        g: context.createImageData(width, height),
        b: context.createImageData(width, height),
    }
}

export function driftColorChannels(
    contents: Uint8ClampedArray,
    channel: number,
    width: number,
    height: number,
    xDrift: number,
    yDrift: number
) {
    // Shifting contents of row first
    // for (let row = 0; row < )
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
    // const imageData = canvasContext.getImageData(0, 0, options.width, options.height);
    // wasm.apply_particle_transformation_for_canvas_2d(
    //     imageData,
    //     options.width,
    //     options.height,
    //     options.rxDrift,
    //     options.ryDrift,
    //     options.gxDrift,
    //     options.gyDrift,
    //     options.bxDrift,
    //     options.byDrift,
    //     options.channelData.context,
    //     options.channelData.offCanvas,
    //     options.channelData.outContext
    // );

    // wasm.create_new_canvas_for_chrome_transformation(
    //     imageData,
    //     options.width,
    //     options.height,
    //     options.rxDrift,
    //     options.ryDrift,
    //     options.gxDrift,
    //     options.gyDrift,
    //     options.bxDrift,
    //     options.byDrift,
    //     options.channelData.context,
    //     options.channelData.offCanvas,
    //     options.channelData.outContext,
    //     options.channelData.r,
    //     options.channelData.g,
    //     options.channelData.b
    // );

    // const canvasImage = canvasContext.getImageData(0, 0, options.width, options.height);
    // const channelData = options.channelData;
    // options.channelData.outContext.globalCompositeOperation = 'screen';
    // options.channelData.outContext.clearRect(0, 0, options.width, options.height);
    // out_context.set_global_composite_operation("screen")?;
    // out_context.clear_rect(0.0, 0.0, width, height);
    // const {
    //     rxDrift, ryDrift, gxDrift, gyDrift, bxDrift, byDrift, width, height
    // } = options;
    // let clamped_data = imageData.data;
    // let length = width * height;

    // let [r_index, r_stride] = ryDrift < length ?
    //     [length - 1, -1] :
    //     [0, 1];
    // let [g_index, g_stride] = gyDrift < length ?
    //     [length - 1, -1] :
    //     [0, 1];
    // let [b_index, b_stride] = byDrift < length ?
    //     [length - 1, -1] :
    //     [0, 1];

    // let get_index = (index: number, col_drift: number) => {
    //     return col_drift > 0 ? width - 1 - index : index
    // };

    // for (let i = 0; i < clamped_data.length;  i += 4) {
    //     let [rrow, rcol] = [r_index / width, r_index % width];
    //     let [rdrow, rdcol] = [rrow - ryDrift, rcol - rxDrift];

    //     if (rdrow >= 0 && rdrow < height && rdcol >= 0 && rdcol < width) {
    //         clamped_data[(rrow * width + get_index(rcol, rxDrift)) << 2] =
    //             clamped_data[(rdrow * width + get_index(rdcol, rxDrift)) << 2];
    //     } else {
    //         clamped_data[(rrow * width + get_index(rcol, rxDrift)) << 2] = 0;
    //     }

    //     let [grow, gcol] = [g_index / width, g_index % width];
    //     let [gdrow, gdcol] = [grow - gyDrift, gcol - gxDrift];
    //     if (gdrow >= 0 && gdrow < height && gdcol >= 0 && gdcol < width) {
    //         clamped_data[((grow * width + get_index(gcol, gxDrift)) << 2) + 1] =
    //             clamped_data[((gdrow * width + get_index(gdcol, gxDrift)) << 2) + 1];
    //     } else {
    //         clamped_data[((grow * width + get_index(gcol, gxDrift)) << 2) + 1] = 0;
    //     }

    //     let [brow, bcol] = [b_index / width, b_index % width];
    //     let [bdrow, bdcol] = [brow - byDrift, bcol - bxDrift];
    //     if (bdrow >= 0 && bdrow < height && bdcol >= 0 && bdcol < width) {
    //         clamped_data[((brow * width + get_index(bcol, bxDrift)) << 2) + 2] =
    //             clamped_data[((bdrow * width + get_index(bdcol, bxDrift)) << 2) + 2];
    //     } else {
    //         clamped_data[((brow * width + get_index(bcol, bxDrift)) << 2) + 2] = 0;
    //     }
    //     r_index += r_stride;
    //     g_index += g_stride;
    //     b_index += b_stride;
    // }

    // let new_image = ImageData::new_with_u8_clamped_array(Clamped(&clamped_data.0), width as u32)?;

    // options.channelData.context.putImageData(imageData, 0, 0);
    // options.channelData.outContext.drawImage(options.channelData.offCanvas, 0, 0);
    // mid_context.put_image_data(&new_image, 0.0, 0.0)?;
    // out_context.draw_image_with_offscreen_canvas(&mid_canvas, 0.0, 0.0)?;

    // const canvasImage = canvasContext.getImageData(0, 0, options.width, options.height);
    // const channelData = options.channelData;
    // options.channelData.outContext.globalCompositeOperation = 'screen';
    // options.channelData.outContext.clearRect(0, 0, options.width, options.height);
    // const rdata = channelData.r.data;
    // const gdata = channelData.g.data;
    // const bdata = channelData.b.data;
    // const idata = canvasImage.data;

    // for (let index = 0, pIndex = 0; index < idata.length; index += 4, ++pIndex) {
    //     rdata[index] = idata[index];
    //     gdata[index + 1] = idata[index + 1];
    //     bdata[index + 2] = idata[index + 2];
    //     rdata[index + 3] = idata[index + 3];
    //     gdata[index + 3] = idata[index + 3];
    //     bdata[index + 3] = idata[index + 3];
    // }

    // // options.channelData.context.clearRect(0, 0, options.width, options.height);
    // options.channelData.context.putImageData(channelData.r, options.rxDrift, options.ryDrift);
    // options.channelData.outContext.drawImage(options.channelData.offCanvas, 0, 0);

    // // options.channelData.context.clearRect(0, 0, options.width, options.height);
    // options.channelData.context.putImageData(channelData.g, options.gxDrift, options.gyDrift);
    // options.channelData.outContext.drawImage(options.channelData.offCanvas, 0, 0);

    // // options.channelData.context.clearRect(0, 0, options.width, options.height);
    // options.channelData.context.putImageData(channelData.b, options.bxDrift, options.byDrift);
    // options.channelData.outContext.drawImage(options.channelData.offCanvas, 0, 0);
}

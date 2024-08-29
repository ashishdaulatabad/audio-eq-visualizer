import { el } from "../common/domhelper";

export function initializeWebgl(
    canvas: HTMLCanvasElement,
) {
    let gl = canvas.getContext('webgl');

    if (gl === null) {
        const newCanvas = el('canvas').get<HTMLCanvasElement>();
        gl = newCanvas.getContext('webgl') as WebGLRenderingContext;
        canvas.replaceWith(newCanvas);
    }

    gl.clearColor(0, 0, 0, 1);

    gl.clear(gl.COLOR_BUFFER_BIT);
}

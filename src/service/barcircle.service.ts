import { Complex } from "../common/complex";
import {linearToPower} from "../common/utility";
import { withDocumentDim, Dim } from "./util.service";

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
  mirrored?: boolean,
  angularVelocity: number,
}

export function createBarCircleEq(frequencyIncr: number, mirrored?: boolean): BarCircleOptions & Dim {
  return withDocumentDim<BarCircleOptions>({
    type: 'BarCircle',
    angleInit: 0,
    lineType: 'Default',
    radius: 200,
    circleBarCount: 25,
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
    barCircleFactor: 3.2,
    timeStamp: performance.now(),
    mirrored,
    angularVelocity: 2 * Math.PI / 100,
  });
}

export function barCircleFormation(
  canvasContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  options: BarCircleOptions & {
    buffer: Float32Array<ArrayBuffer>,
    analyser: AnalyserNode,
    width: number,
    height: number,
  }
) {
  const {
    analyser,
    bandRanges,
    mirrored,
    circleBarCount,
    frequencyIncr,
    volumeScaling,
    barCircleFactor,
    angleInit,
    width,
    height,
    buffer,
    timeStamp,
    angularVelocity
  } = options;

  analyser.getFloatFrequencyData(buffer);
  const centerX = width / 2, centerY = height / 2;
  const anglePerBar = (mirrored ? 1 : 2) * Math.PI / (bandRanges.length * circleBarCount);

  let theta = angleInit;

  const radius = Math.min(width, height) / 4;
  // TODO: Using normal maths instead of complex numbers for performance.
  const change = Complex.unit(anglePerBar);
  const arcLength = radius * anglePerBar;
  let unitAng = Complex.unit(theta);
  let angle = Complex.vec(radius, theta);

  canvasContext.lineWidth = arcLength - arcLength / 10;
  canvasContext.lineCap = 'round';
  let i = 0;
  const currentTimestamp = performance.now();

  canvasContext.beginPath();
  canvasContext.lineWidth = arcLength - arcLength / 10;

  for (const [startRange, endRange] of bandRanges) {
    const totalBands = (endRange - startRange) / frequencyIncr;
    const indexIncrement = totalBands / circleBarCount;
    let perBandValue = 0;

    for (; perBandValue < circleBarCount; ++perBandValue, i += indexIncrement) {
      const v = buffer[Math.floor(i)] + 128.0;

      if (v > 0) {
        const l = linearToPower(v, 4, 256, options.volumeScaling)
        const y = l * barCircleFactor;
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
  options.angleInit += ((currentTimestamp - timeStamp) / 1000) * angularVelocity;
  options.timeStamp = currentTimestamp;

  canvasContext.stroke();
}

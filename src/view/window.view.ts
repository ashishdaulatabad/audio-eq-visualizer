import { el } from '../common/domhelper';
import { GlobalAudioService } from '../service/global.service';
import { Subscriber } from '../common/subscriber';
import utility from '../common/utility';
import { Complex } from '../common/complex';
import {
    applyParticleTransformation,
    barCircleFormation,
    complement,
    createRandomParticleSeeding,
    waveCircleFormation,
    waveFormation
} from '../service/transformation.service';
import { barFormation } from '../service/bar.service';
import { ChromeAbbr, chromaticAbberationTransform, createBufferForChromaticAbberation, resizeBuffer } from '../service/chrome.service';

export class WindowView {
    totalBars: number = 30;
    barWidth: number = 20;
    fileName: string | null = null;
    strokeWidth: number = 2;
    backColor: string = 'rgb(10 12 14)';
    textColor: string = 'rgb(216 220 235)';
    seekPadding: number = 200;
    barFactor = 2;
    barCircleFactor = 1;
    peakValue = 256;
    volumeScaling = 0.4;
    particleAccelScale = 10;
    radius = 150;
    frequencyBandRanges: Array<[number, number]> = [
        [20, 260],
        [260, 500],
        [500, 2000],
        [2000, 5000],
        [5000, 15000],
    ];

    prevTimer = performance.now();
    width: number = document.documentElement.clientWidth;
    height: number = document.documentElement.clientWidth;
    seed: {
        timeStamp: number,
        buffer: Array<[number, number, number, number, number, number]>
    } = {
        timeStamp: 0,
        buffer: []
    };
    timer: number = 0.0;
    bandBarCount = 18;
    circleBarCount = 24;
    waveCounts = 25;
    angleChange = 0.01;
    transformationsFns: any[] = [];
    channelData: ChromeAbbr;
    optionsArray: any[] = [];
    currentEq: any = {};

    mainDOM: HTMLDivElement;
    // @ts-expect-error
    buffer: Uint8Array;
    frequencyBuffer: Float32Array = new Float32Array(1);
    canvas: HTMLCanvasElement;
    offscreenCanvas: OffscreenCanvas;
    offContext: OffscreenCanvasRenderingContext2D;
    // @ts-expect-error
    analyser: AnalyserNode;
    canvasContext: CanvasRenderingContext2D;
    // @ts-expect-error
    webGLContext: WebGLRenderingContext;
    // Buffer Length
    bufferLength: number = 0;
    // FFT Size
    fftSize: number = 16384;
    /// Wave
    animationFrame: number | null = 0;
    /// seekbar
    seekbarAnimationFrame: number | null = 0;
    /// Canvas Bar
    // @ts-expect-error
    progressBar: HTMLImageElement;
    sourceBuffer: AudioBuffer;
    bufferSourceNode: AudioBufferSourceNode;
    // current mode
    currentMode: string = 'Wave';
    // frequency increment
    frequencyIncr = 0;
    // Font
    fontSize = 30;
    eqOptionDOM: HTMLElement;
    eqStyleDOM: HTMLElement;
    seekbarDOM: HTMLElement;
    seekBarThumb: HTMLElement;
    fps: HTMLElement;
    embedDOM: HTMLIFrameElement | null = null;
    mediaElement: MediaElementAudioSourceNode | null = null;
    totalTimer: number = 0;
    seekbarLength: number = 0;
    audioContextTimer: number = 0;
    offsetTimer: number = 0;
    lineType: string = 'Retro'; // Retro
    prevTime: number | null = null;
    youtubePlayer: any = null;
    isGradient: boolean = false;

    constructor(
        private audioService: GlobalAudioService,
        private subscriber: Subscriber,
    ) {
        [this.seekBarThumb, this.seekbarDOM] = this.constructSeekbar();
        [this.canvas, this.canvasContext] = this.buildCanvas();
        this.fps = this.initializeFpsCounter();
        this.eqOptionDOM = this.buildOptions();
        this.eqStyleDOM = this.buildEqOptions();
        this.mainDOM = this.initializeAudio(this.canvas, this.seekbarDOM, this.fps);
        this.seed = createRandomParticleSeeding(256, this.width, this.height, 1, 1, 2, 2);

        this.channelData = createBufferForChromaticAbberation(this.width, this.height);
        this.offscreenCanvas = new OffscreenCanvas(this.width, this.height);
        this.offContext = this.offscreenCanvas.getContext('2d', { willReadFrequently: true }) as OffscreenCanvasRenderingContext2D;

        this.subscriber.subscribeToEvent('contextcreated', () => {
            this.analyser = this.initializeAnalyzerWave();

            if (!this.audioService.isPaused()) {
                this.requestAnimation();
            }
        });

        [this.sourceBuffer, this.bufferSourceNode] = this.setSourceNode(
            new AudioBuffer({ length: 1, sampleRate: 48000 }),
        );

        this.subscriber.subscribeToEvent(
            'musicchanged',
            (data: { title: string; buffer: AudioBuffer }) => {
                const fileSplit = data.title.split('.');
                fileSplit.pop();
                this.fileName = fileSplit.join('.');
                [this.sourceBuffer, this.bufferSourceNode] = this.setSourceNode(
                    data.buffer,
                );
                this.timer = this.audioService.useAudioContext().currentTime;
                this.run();
            },
        );

        this.subscriber.subscribeToEvent(
            'palette',
            (data: [string, string, boolean]) => {
                [this.backColor, this.textColor, this.isGradient] = data;
                this.resetCanvas(this.canvasContext);
            },
        );
    }

    initializeFpsCounter() {
        return el('div')
            .mcls('absolute', 'w-32', 'bg-gray-800/40', 'top-0', 'text-gray-200')
            .innerHtml('0')
            .get();
    }

    getAllAttachableViews(): HTMLElement[] {
        return [this.eqOptionDOM, this.eqStyleDOM];
    }

    setSourceNode(
        buffer: AudioBuffer,
        startAt: number | null = null,
    ): [AudioBuffer, AudioBufferSourceNode] {
        if (this.sourceBuffer) {
            this.bufferSourceNode.stop();
            this.bufferSourceNode.disconnect();
        }

        const sourceBuffer = buffer;
        const bufferSourceNode = this.audioService
            .useAudioContext()
            .createBufferSource();

        bufferSourceNode.buffer = buffer;
        this.audioService.makeConnection(bufferSourceNode);
        this.setDurationAndTimeDetails(sourceBuffer);

        if (!startAt) {
            this.offsetTimer = 0;
            bufferSourceNode.start();
        } else {
            this.offsetTimer = startAt;
            bufferSourceNode.start(0, startAt);
        }

        return [sourceBuffer, bufferSourceNode];
    }

    setDurationAndTimeDetails(sourceBuffer: AudioBuffer) {
        this.totalTimer = sourceBuffer.duration;
        this.audioContextTimer =
            this.audioService.useAudioContext().currentTime;
    }

    onPlayerPausedOrResumed() {
        if (this.audioService.paused) {
            this.audioService.resume();
        } else {
            this.audioService.pause();
        }
    }

    setTitle(canvasContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        canvasContext.font = 'bold ' + this.fontSize + 'px Helvetica Neue';
        canvasContext.fillStyle = this.textColor;
        canvasContext.fillText(`Playing Now:`, 30, 100);

        canvasContext.font = this.fontSize + 'px Helvetica Neue';
        canvasContext.fillStyle = this.textColor;
        canvasContext.fillText(
            this.fileName ?? 'None (Drag and Drop .mp3/.wav file.)',
            30,
            100 + this.fontSize + 10,
        );

        if (this.audioService.audioContext) {
            const timerPos = 100 + this.fontSize + 10;
            canvasContext.font = '300 ' + this.fontSize + 'px Helvetica Neue';
            canvasContext.fillStyle = this.textColor;

            const time =
                this.audioService.useAudioContext().currentTime -
                this.audioContextTimer +
                this.offsetTimer;
            canvasContext.fillText(
                utility.timerSec(time),
                30,
                timerPos + this.fontSize + 10,
            );
            canvasContext.fillStyle = this.backColor;
        }
    }

    getView() {
        return this.mainDOM;
    }

    initializeAudio(...dom: HTMLElement[]) {
        return el('div')
            .mcls('eq', 'relative')
            .inners(...dom)
            .get<HTMLDivElement>();
    }

    static constructTitle(titleName: string) {
        const title = el('span')
            .mcls('text-[18px]', 'font-serif', 'text-gray-100', 'block', 'items-center', 'flex')
            .inner([
                el('span')
                    .mcls('relative', 'top-[2px]', 'block', 'self-center', 'w-avail', 'font-bold')
                    .innerText(titleName),
                el('button').mcls('min-h-8', 'min-w-8', 'rounded-[1rem]', 'bg-gray-300', 'border-[0]', 'ml-4', 'self-end')
            ])
            .get();

        return title;
    }

    moveSeekbarClick(evt: MouseEvent) {
        const time = (evt.offsetX / this.seekbarLength) * this.totalTimer;
        this.bufferSourceNode.stop();

        cancelAnimationFrame(this.seekbarAnimationFrame as number);

        el(this.seekBarThumb).styleAttr({ width: evt.offsetX + 'px' });
        [this.sourceBuffer, this.bufferSourceNode] = this.setSourceNode(
            this.sourceBuffer,
            time,
        );
        this.requestSeekbarAnimation();
    }

    constructSeekbar(): [HTMLElement, HTMLElement] {
        const width = document.documentElement.clientWidth;
        this.seekbarLength = width - 100;

        const seekBarThumb = el('span')
            .mcls('seekbar-thumb', 'block', 'relative', 'bg-gray-100', 'rounded-[8px]', 'w-2', 'h-2', 'min-w-2', 'min-h-2', 'self-center')
            .mcls('transition-all', 'duration-[40ms]')
            .get();

        const seekbarDOM = el('div')
            .mcls('seekbar', 'absolute', 'min-h-12', 'rounded-[24px]', 'bg-gray-700/70', 'flex', 'align-center')
            .mcls('backdrop-blur-[2px]', 'shadow-md', 'transition-shadow', 'duration-100', 'hover:shadow-lg')
            .styleAttr({
                width: this.seekbarLength + 'px',
                bottom: '50px',
                left: '50px',
            })
            .inner([
                el('div')
                    .mcls('tracker', 'bg-gray-400/60', 'w-avail', 'max-h-2', 'min-h-2', 'self-center', 'rounded-md', 'mx-4', 'flex')
                    .mcls('cursor-pointer')
                    .inner([seekBarThumb])
                    .evt('click', this.moveSeekbarClick.bind(this)),
            ])
            .get();

        return [seekBarThumb, seekbarDOM];
    }

    onOptionSelected(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const type = target.getAttribute('data-type') as string;

        if (type !== this.currentMode) {
            cancelAnimationFrame(this.animationFrame as number);
            this.changeMode(type);
        }
    }

    onEqStyleSelected(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const type = target.getAttribute('data-type') as string;

        if (type !== this.lineType) {
            cancelAnimationFrame(this.animationFrame as number);
            this.lineType = type;
            this.changeMode(this.currentMode);
        }
    }

    constructOptions() {
        return el('div')
            .mcls('options', 'flex', 'flex-col')
            .inner(
                ['Bar', 'BarCircle', 'WaveCircle', 'Wave'].map((type) =>
                    el('button')
                        .mcls('border-0', 'transition-all', 'duration-300', 'ease-in-out', 'hover:bg-gray-100/30', 'rounded-[3px]')
                        .mcls('text-gray-100', 'p-2')
                        .attr('data-type', type)
                        .evt('click', this.onOptionSelected.bind(this))
                        .innerText(type)
                        .get(),
                ),
            )
            .get();
    }

    constructEqTypeOptions() {
        return el('div')
            .mcls('options', 'flex', 'flex-col')
            .inner(
                ['Retro', 'Normal'].map((type) =>
                    el('button')
                        .mcls('border-0', 'transition-all', 'duration-300', 'ease-in-out', 'hover:bg-gray-100/30', 'rounded-[3px]')
                        .mcls('text-gray-100', 'p-2')
                        .attr('data-type', type)
                        .evt('click', this.onEqStyleSelected.bind(this))
                        .innerText(type)
                        .get(),
                ),
            )
            .get();
    }

    buildOptions() {
        const styleDom = WindowView.constructTitle('Visualizer Type');
        const eqOptions = el('div')
            .mcls('bg-gray-600/30', 'backdrop-blur-[2px]', 'transition-all', 'duration-200', 'ease-in-out', 'w-avail', 'top-10', 'right-[300px]', 'rounded-[3px]', 'p-2', 'pr-0', 'text-center')
            .mcls('max-h-72', 'overflow-y-scroll', 'scrollbar-thumb', 'flex', 'flex-col', 'shadow-md')
            .inner([styleDom, this.constructOptions()])
            .get();

        const list = eqOptions.children[1] as HTMLElement;
        const button = styleDom.children[1] as HTMLElement;
        el(button).evt('click', (_) => el(list).tcls('collapsed'));

        return eqOptions;
    }

    buildEqOptions() {
        const styleDom = WindowView.constructTitle('Visualizer Style');
        const eqOptions = el('div')
            .mcls('bg-gray-600/30', 'backdrop-blur-[2px]', 'transition-all', 'duration-200', 'ease-in-out', 'w-avail', 'top-10', 'right-[300px]', 'rounded-[3px]', 'p-2', 'pr-0', 'text-center')
            .mcls( 'max-h-72', 'overflow-y-scroll', 'scrollbar-thumb', 'flex', 'flex-col', 'shadow-md')
            .inner([styleDom, this.constructEqTypeOptions()])
            .get();

        const list = eqOptions.children[1] as HTMLElement;
        const button = styleDom.children[1] as HTMLElement;
        el(button).evt('click', (_) => el(list).tcls('collapsed'));

        return eqOptions;
    }

    resetCanvas(canvasContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        if (this.isGradient) {
            const gradient = canvasContext.createLinearGradient(0, this.height / 2, this.width, this.height / 2);
            gradient.addColorStop(0, this.backColor);
            gradient.addColorStop(1, this.textColor);
            canvasContext.fillStyle = gradient;
        } else {
            canvasContext.fillStyle = this.backColor;
        }
        canvasContext.fillRect(0, 0, this.width, this.height);
        canvasContext.lineWidth = this.strokeWidth;

        if (!(canvasContext instanceof OffscreenCanvasRenderingContext2D)) {
            this.setTitle(canvasContext);
        }

        if (this.isGradient) {
            const gradient = canvasContext.createLinearGradient(0, this.height / 2, this.width, this.height / 2);
            gradient.addColorStop(1, this.backColor);
            gradient.addColorStop(0, this.textColor);
            canvasContext.strokeStyle = gradient;
        } else {
            canvasContext.strokeStyle = this.textColor;
        }
        canvasContext.beginPath();
    }

    buildCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;

        const canvas = el('canvas')
            .mcls('wave')
            .attr('width', this.width.toString())
            .attr('height', this.height.toString())
            .get<HTMLCanvasElement>();

        const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;

        this.resetCanvas(canvasContext);
        return [canvas, canvasContext];
    }

    initializeAnalyzerWave() {
        this.fftSize = 16384;
        const analyser = this.audioService.useAudioContext().createAnalyser();

        analyser.fftSize = this.fftSize;
        this.bufferLength = analyser.frequencyBinCount;
        this.buffer = new Uint8Array(analyser.frequencyBinCount);

        analyser.getByteTimeDomainData(this.buffer);
        this.audioService.connectGainTo(analyser);

        return analyser;
    }

    setBufferSize() {
        const frequency = this.sourceBuffer.sampleRate / 2.0;
        return frequency / this.bufferLength;
    }

    initializeAnalyzerBar() {
        this.fftSize = 4096;
        const analyser = this.audioService.useAudioContext().createAnalyser();

        analyser.fftSize = this.fftSize;
        this.bufferLength = analyser.frequencyBinCount;
        this.frequencyBuffer = new Float32Array(analyser.frequencyBinCount);
        this.frequencyIncr = this.setBufferSize();

        analyser.getFloatFrequencyData(this.frequencyBuffer);
        this.audioService.connectGainTo(analyser);

        return analyser;
    }

    setFps() {
        const currentTimer = performance.now();
        el(this.fps)
            .innerHtml(`${Math.round(1000 / (currentTimer - this.prevTimer))} FPS`);
        this.prevTimer = currentTimer;
    }

    setResize() {
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;

        this.seekbarLength = this.width - 100;
        resizeBuffer(this.channelData, this.width, this.height);
        el(this.seekbarDOM).styleAttr({ width: this.width - 100 + 'px' });

        el(this.canvas)
            .mcls('wave')
            .attr('width', this.width.toString())
            .attr('height', this.height.toString())
            .get<HTMLCanvasElement>();

        this.resetCanvas(this.canvasContext);
    }

    requestBarWaveCircleFormAnimation() {
        this.setFps();
        this.barCircleFormation();
        this.animationFrame = requestAnimationFrame(
            this.requestBarWaveCircleFormAnimation.bind(this),
        );
        return this.animationFrame;
    }

    requestBarWaveFormAnimation() {
        this.setFps();
        this.barFormation();
        this.animationFrame = requestAnimationFrame(
            this.requestBarWaveFormAnimation.bind(this),
        );
        return this.animationFrame;
    }

    requestWaveFormAnimation() {
        this.setFps();
        this.waveFormation();
        this.animationFrame = requestAnimationFrame(
            this.requestWaveFormAnimation.bind(this),
        );
        return this.animationFrame;
    }

    requestWaveCircleFormAnimation() {
        this.setFps();
        this.waveCircleFormation();
        this.animationFrame = requestAnimationFrame(
            this.requestWaveCircleFormAnimation.bind(this),
        );
        return this.animationFrame;
    }

    moveSeekbar() {
        const currentTime =
            this.audioService.useAudioContext().currentTime -
            this.audioContextTimer +
            this.offsetTimer;
        const position = (currentTime / this.totalTimer) * this.seekbarLength;

        el(this.seekBarThumb).styleAttr({ width: position + 'px' });
    }

    seekbarAnimation() {
        this.moveSeekbar();
    }

    requestSeekbarAnimation() {
        this.seekbarAnimation();
        this.seekbarAnimationFrame = requestAnimationFrame(
            this.requestSeekbarAnimation.bind(this),
        );
        return this.seekbarAnimationFrame;
    }

    requestAnimation() {

        switch (this.currentMode) {
            case 'Bar':
                return this.requestBarWaveFormAnimation();

            case 'Wave':
                return this.requestWaveFormAnimation();

            case 'WaveCircle':
                return this.requestWaveCircleFormAnimation();

            case 'BarCircle':
            default:
                return this.requestBarWaveCircleFormAnimation();
        }
    }

    waveFormation() {
        this.analyser.getByteTimeDomainData(this.buffer);
        this.resetCanvas(this.canvasContext);
        this.setTitle(this.canvasContext);

        waveFormation(this.canvasContext, {
            buffer: this.buffer,
            height: this.height,
            width: this.width
        })

        applyParticleTransformation(this.canvasContext, {
            textColor: this.textColor,
            backgroundColor: this.backColor,
            width: this.width,
            height: this.height,
            axScale: this.particleAccelScale,
            ayScale: this.particleAccelScale,
            positionalSeeds: this.seed
        });
    }

    barFormation() {
        this.analyser.getFloatFrequencyData(this.frequencyBuffer);
        this.resetCanvas(this.canvasContext);
        this.setTitle(this.canvasContext);

        barFormation(this.canvasContext, {
            buffer: this.frequencyBuffer,
            backgroundColor: this.backColor,
            barFactor: this.barFactor,
            width: this.width,
            height: this.height,
            bandBarCount: this.bandBarCount,
            lineType: this.lineType,
            frequencyIncr: this.frequencyIncr,
            bandRanges: this.frequencyBandRanges,
            textColor: this.textColor,
            volumeScaling: this.volumeScaling
        });

        applyParticleTransformation(this.canvasContext, {
            textColor: this.textColor,
            backgroundColor: this.backColor,
            width: this.width,
            height: this.height,
            axScale: this.particleAccelScale,
            ayScale: this.particleAccelScale,
            positionalSeeds: this.seed
        });
    }

    setInitialAngle() {
        if (!this.audioService.isPaused()) {
            if (!this.prevTime) {
                this.prevTime = performance.now();
                this.angleChange = 0;
            } else {
                const timeChange = performance.now() - this.prevTime;
                this.angleChange += (2 * Math.PI) / (timeChange * 2000);
                this.prevTime = performance.now();
            }

            if (this.angleChange >= 2 * Math.PI) {
                this.angleChange -= 2 * Math.PI;
            }
        }

        return this.angleChange;
    }

    barCircleFormation() {
        this.analyser.getFloatFrequencyData(this.frequencyBuffer);
        this.resetCanvas(this.canvasContext);
        this.resetCanvas(this.offContext);
        this.setTitle(this.offContext);

        barCircleFormation(this.offContext, {
            angleInit: this.setInitialAngle(),
            backgroundColor: this.backColor,
            textColor: this.textColor,
            lineType: this.lineType,
            bandRanges: this.frequencyBandRanges,
            buffer: this.frequencyBuffer,
            barCircleFactor: this.barCircleFactor,
            circleBarCount: this.circleBarCount,
            frequencyIncr: this.frequencyIncr,
            height: this.height,
            radius: this.radius,
            width: this.width,
            volumeScaling: this.volumeScaling
        });

        applyParticleTransformation(this.offContext, {
            textColor: this.textColor,
            backgroundColor: this.backColor,
            width: this.width,
            height: this.height,
            axScale: this.particleAccelScale,
            ayScale: this.particleAccelScale,
            positionalSeeds: this.seed
        });

        // chromaticAbberationTransform(this.offContext, {
        //     height: this.height,
        //     width: this.width,
        //     rxDrift: 1,
        //     ryDrift: 0,
        //     gxDrift: -1,
        //     gyDrift: 2,
        //     bxDrift: 1,
        //     byDrift: 2,
        //     channelData: this.channelData,
        // });

        this.canvasContext.drawImage(this.offscreenCanvas, 0, 0);
    }

    waveCircleFormation() {
        this.analyser.getFloatFrequencyData(this.frequencyBuffer);
        this.resetCanvas(this.canvasContext);
        this.setTitle(this.canvasContext);

        waveCircleFormation(this.canvasContext, {
            angleInit: this.setInitialAngle(),
            backgroundColor: this.backColor,
            textColor: this.textColor,
            lineType: this.lineType,
            bandRanges: this.frequencyBandRanges,
            buffer: this.frequencyBuffer,
            barCircleFactor: this.barCircleFactor,
            waveCounts: this.waveCounts,
            frequencyIncr: this.frequencyIncr,
            height: this.height,
            radius: this.radius,
            width: this.width,
            volumeScaling: this.volumeScaling
        });

        applyParticleTransformation(this.canvasContext, {
            textColor: this.textColor,
            backgroundColor: this.backColor,
            width: this.width,
            height: this.height,
            axScale: this.particleAccelScale,
            ayScale: this.particleAccelScale,
            positionalSeeds: this.seed
        });
    }

    changeMode(mode: string) {
        this.currentMode = mode;

        switch (this.currentMode) {
            case 'Bar':
                this.analyser = this.initializeAnalyzerBar();
                break;

            case 'Wave':
                this.analyser = this.initializeAnalyzerWave();
                break;

            case 'WaveCircle':
                this.analyser = this.initializeAnalyzerBar();
                break;

            case 'BarCircle':
            default:
                this.analyser = this.initializeAnalyzerBar();
                break;
        }

        this.run();
    }

    run(): number {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame as number);
            cancelAnimationFrame(this.seekbarAnimationFrame as number);
        }

        this.requestSeekbarAnimation();
        return this.requestAnimation();
    }
}

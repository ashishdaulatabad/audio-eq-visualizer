import { el } from '../common/domhelper';
import { GlobalAudioService } from '../service/global.service';
import { Subscriber } from '../common/subscriber';
import utility from '../common/utility';
import {
    ParticleOptions,
    applyTransformation,
    createRandomParticleSeeding,
} from '../service/transformation.service';
import { createOptionsForBar } from '../service/bar.service';
import { createBarCircleEq } from '../service/barcircle.service';
import { createOptionsForWaveCircle } from '../service/wavecircle.service';
import { createOptionsForWave } from '../service/wave.service';
import { ChromeAbbr, createBufferForChromaticAbberation, resizeBuffer } from '../service/chrome.service';

export class WindowView {
    fileName: string | null = null;
    backColor: string = 'rgb(10 12 14)';
    textColor: string = 'rgb(216 220 235)';
    seekPadding: number = 200;
    prevTimer = performance.now();
    width: number = document.documentElement.clientWidth;
    height: number = document.documentElement.clientWidth;
    timer: number = 0.0;
    transformationsFns: any[] = [];
    channelData: ChromeAbbr;
    optionsArray: any[] = [];
    currentEq: any = {};
    canvasAction: { draw: any[], effects: any[] } = {
        draw: [],
        effects: []
    };

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
    sourceBuffer: AudioBuffer;
    // @ts-expect-error
    bufferSourceNode: AudioBufferSourceNode;
    // current mode
    currentMode: string = 'Wave';
    // frequency increment
    frequencyIncr = 0;
    // Font
    fontSize = 30;
    eqOptionDOM: HTMLElement;
    button: HTMLElement;
    seekbarDOM: HTMLElement;
    seekBarThumb: HTMLElement;
    fps: HTMLElement;
    totalTimer: number = 0;
    seekbarLength: number = 0;
    audioContextTimer: number = 0;
    offsetTimer: number = 0;
    lineType: string = 'Normal';
    prevTime: number | null = null;
    pitchCorrection = 1.0;

    constructor(
        private audioService: GlobalAudioService,
        private subscriber: Subscriber,
    ) {
        [this.seekBarThumb, this.seekbarDOM] = this.constructSeekbar();
        [this.canvas, this.canvasContext] = this.buildCanvas();
        this.resetCanvas(this.canvasContext);

        this.fps = this.initializeFpsCounter();
        this.eqOptionDOM = this.buildOptions();
        this.button = this.createAudioPermissionButton();
        this.mainDOM = this.initializeAudio(this.canvas, this.seekbarDOM, this.fps);

        this.canvasAction.draw.push({
            drawKind: 'other',
            textColor: this.textColor,
            width: this.width,
            height: this.height,
            ...createRandomParticleSeeding(256, this.width, this.height, 6, 6, 2, 2)
        });

        this.channelData = createBufferForChromaticAbberation(this.width, this.height);
        this.offscreenCanvas = new OffscreenCanvas(this.width, this.height);
        this.offContext = this.offscreenCanvas.getContext('2d', { willReadFrequently: true }) as OffscreenCanvasRenderingContext2D;

        this.subscriber.subscribeToEvent('musicchanged', (data: { title: string; buffer: AudioBuffer }) => {
            const fileSplit = data.title.split('.');
            fileSplit.pop();
            this.fileName = fileSplit.join('.');
            [this.sourceBuffer, this.bufferSourceNode] = this.setSourceNode(data.buffer);
            this.timer = this.audioService.useAudioContext().currentTime;
            this.run();
        });

        this.subscriber.subscribeToEvent('palette', (data: [string, string]) => {
            [this.backColor, this.textColor] = data;
            this.canvasAction.draw
            this.canvasAction.draw = this.canvasAction.draw.map(value => {
                return {
                    ...value,
                    backColor: this.backColor,
                    textColor: this.textColor,
                }
            });
            this.resetCanvas(this.canvasContext);
        });
    }

    allowMediaControl(_: Event) {
        if (!this.audioService.isInitialized()) {
            this.audioService.useAudioContext();
            this.changeMode(this.currentMode);
        }
    }

    createAudioPermissionButton() {
        return el('button')
            .mcls('bg-blue-600', 'block', 'w-avail', 'text-gray-300', 'p-2', 'pb-1', 'hover:bg-blue-700', 'transition-all', 'ease-in-out', 'duration-300', 'rounded-sm', 'active:bg-blue-500')
            .innerHtml('Allow Media Control')
            .evt('click', this.allowMediaControl.bind(this))
            .get();
    }

    selectMediaFile() {
        const input = el('input')
            .attr('type', 'file')
            .attr('accept', 'audio/*')
            .get();

        input.onchange = (event: any) => {
            this.audioService.setAudioBuffer(event.target.files[0]);
        }
        input.click();

        return input;
    }
    
    createFileSelectionButton() {
        return el('button')
            .mcls('bg-blue-600', 'block', 'w-avail', 'text-gray-300', 'p-2', 'pb-1', 'hover:bg-blue-700', 'transition-all', 'ease-in-out', 'duration-300', 'rounded-sm', 'active:bg-blue-500')
            .innerHtml('Select Audio File')
            .evt('click', this.selectMediaFile.bind(this))
            .get();
    }

    resetCanvasType(contextType: string) {
        const [canvas, context] = this.buildCanvas(contextType);
        this.mainDOM.replaceChild(canvas, this.canvas);
        [this.canvas, this.canvasContext] = [canvas, context];
    }

    initializeFpsCounter() {
        return el('div')
            .mcls('absolute', 'w-32', 'bg-gray-800/40', 'top-0', 'text-gray-200')
            .innerHtml('0')
            .get();
    }

    getAllAttachableViews(): HTMLElement[] {
        return [
            this.eqOptionDOM,
            this.setSliderContainer('Pitch Factor', this.setSlider('pitch')),
            this.setSliderContainer('Speed Factor', this.setSlider('speed')),
            this.button,
            this.createFileSelectionButton()
        ];
    }

    setSourceNode(
        buffer: AudioBuffer,
        startAt: number | null = null,
        options?: {
            playbackRate: number
        }
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

        if (options?.playbackRate) {
            bufferSourceNode.playbackRate.value = options.playbackRate;
        }

        return [sourceBuffer, bufferSourceNode];
    }

    setDurationAndTimeDetails(sourceBuffer: AudioBuffer) {
        this.totalTimer = sourceBuffer.duration;
        this.audioContextTimer = this.audioService.useAudioContext().currentTime;
    }

    onPlayerPausedOrResumed() {
        if (this.audioService.paused) {
            this.audioService.resume();
        } else {
            this.audioService.pause();
        }
    }

    setSliderContainer(sliderTitle: string, ...content: HTMLElement[]) {
        const title = WindowView.constructTitle(sliderTitle);
        const viewDom = el('div')
            .mcls('bg-gray-600/50', 'rounded-sm', 'p-2', 'text-gray-200')
            .inner([
                title,
                el('div').innerHtml('1.0'),
                el('div').mcls('flex', 'flex-col').inners(...content)
            ])
            .get();

        const view = viewDom.children[2] as HTMLElement;
        const button = title.children[1] as HTMLElement;
        el(button).evt('click', (_) => el(view).tcls('collapsed'));
        return viewDom;
    }
    
    setSliderValue(evt: Event) {
        const elem = evt.target as HTMLInputElement;
        const grandParent = elem.parentElement?.parentElement as HTMLElement;
        grandParent.children[1].innerHTML = elem.value.toString();

        switch (elem.getAttribute('data-change')) {
            case 'pitch':
                this.audioService.changePitchFactor(parseFloat(elem.value));
                break;
            case 'speed':
                this.bufferSourceNode.playbackRate.value = parseFloat(elem.value);
                break;
        }
    }

    setSlider(change: string) {
        return el('input')
            .attr('type', 'range')
            .attr('data-change', change)
            .attr('min', '0.6')
            .attr('max', '1.4')
            .attr('value', '1.0')
            .attr('step', '0.01')
            .evt('input', this.setSliderValue.bind(this))
            .get<HTMLInputElement>();
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
                this.audioService.useAudioContext().currentTime - this.audioContextTimer + this.offsetTimer;

            canvasContext.fillText(utility.timerSec(time), 30, timerPos + this.fontSize + 10);
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
        const playbackRate = this.bufferSourceNode.playbackRate.value;
        this.bufferSourceNode.stop();

        cancelAnimationFrame(this.seekbarAnimationFrame as number);

        el(this.seekBarThumb).styleAttr({ width: evt.offsetX + 'px' });
        [this.sourceBuffer, this.bufferSourceNode] = this.setSourceNode(
            this.sourceBuffer,
            time,
            { playbackRate }
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
            .mcls('seekbar', 'absolute', 'min-h-12', 'rounded-[24px]', 'bg-gray-700/40', 'flex', 'align-center')
            .mcls('backdrop-blur-[5px]', 'shadow-md', 'transition-shadow', 'duration-100', 'hover:shadow-lg')
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
                ['Bar', 'Bar Mirrored', 'Bar Circle', /*'Bar Circle Mirrored',*/ 'Wave Circle', 'Wave'].map((type) =>
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

    buildOptions() {
        const styleDom = WindowView.constructTitle('Visualizer Type');
        const eqVisualizerOptions = el('div')
            .mcls('bg-gray-600/30', 'backdrop-blur-[2px]', 'transition-all', 'duration-200', 'ease-in-out', 'w-avail', 'top-10', 'right-[300px]', 'rounded-[3px]', 'p-2', 'pr-0', 'text-center')
            .mcls('max-h-72', 'overflow-y-scroll', 'scrollbar-thumb', 'flex', 'flex-col', 'shadow-md')
            .inner([styleDom, this.constructOptions()])
            .get();

        const list = eqVisualizerOptions.children[1] as HTMLElement;
        const button = styleDom.children[1] as HTMLElement;
        el(button).evt('click', (_) => el(list).tcls('collapsed'));

        return eqVisualizerOptions;
    }

    resetOffscreenCanvas(offCanvas: OffscreenCanvas, canvasContext: OffscreenCanvasRenderingContext2D) {
        offCanvas.width = document.documentElement.clientWidth;
        offCanvas.height = document.documentElement.clientHeight;

        this.resetCanvas(canvasContext);
    }

    resetCanvas(canvasContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;

        canvasContext.fillStyle = this.backColor;
        canvasContext.fillRect(0, 0, this.width, this.height);

        if (!(canvasContext instanceof OffscreenCanvasRenderingContext2D)) {
            this.setTitle(canvasContext);
        }

        canvasContext.strokeStyle = this.textColor;
    }

    buildCanvas(contextType: string = '2d'): [HTMLCanvasElement, CanvasRenderingContext2D] {
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;

        const canvas = el('canvas')
            .mcls('wave')
            .attr('width', this.width.toString())
            .attr('height', this.height.toString())
            .get<HTMLCanvasElement>();

        const canvasContext = canvas.getContext(contextType) as CanvasRenderingContext2D;
        return [canvas, canvasContext];
    }

    initializeAnalyzerWave() {
        if (this.analyser) {
            this.analyser.disconnect();
        }
        this.fftSize = 16384;
        const analyser = this.audioService.useAudioContext().createAnalyser();

        analyser.fftSize = this.fftSize;
        this.bufferLength = analyser.frequencyBinCount;
        this.buffer = new Uint8Array(analyser.frequencyBinCount);

        analyser.getByteTimeDomainData(this.buffer);
        this.audioService.connectAudioWorkletNodeTo(analyser);

        return analyser;
    }

    setBufferSize() {
        const frequency = this.sourceBuffer.sampleRate / 2.0;
        return frequency / this.bufferLength;
    }

    setPitchCorrection() {
        const value = this.bufferSourceNode.playbackRate.value;
        this.pitchCorrection = value;
        
    }

    initializeAnalyzerBar() {
        if (this.analyser) {
            this.analyser.disconnect();
        }

        this.fftSize = 4096;
        const analyser = this.audioService.useAudioContext().createAnalyser();

        analyser.fftSize = this.fftSize;
        this.bufferLength = analyser.frequencyBinCount;
        this.frequencyBuffer = new Float32Array(analyser.frequencyBinCount);
        this.frequencyIncr = this.setBufferSize();

        analyser.getFloatFrequencyData(this.frequencyBuffer);
        this.audioService.connectAudioWorkletNodeTo(analyser);

        return analyser;
    }

    setFps() {
        const currentTimer = performance.now();
        el(this.fps).innerHtml(`${Math.round(1000 / (currentTimer - this.prevTimer))} FPS`);
        this.prevTimer = currentTimer;
    }

    setResize() {
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;

        this.seekbarLength = this.width - 100;
        resizeBuffer(this.channelData, this.width, this.height);
        el(this.seekbarDOM).styleAttr({ width: this.width - 100 + 'px' });

        this.canvasAction.draw.forEach(value => {
            value.width = this.width;
            value.height = this.height;
        });

        el(this.canvas)
            .mcls('wave')
            .attr('width', this.width.toString())
            .attr('height', this.height.toString())
            .get<HTMLCanvasElement>();

        this.resetCanvas(this.canvasContext);
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
        this.seekbarAnimationFrame = requestAnimationFrame(this.requestSeekbarAnimation.bind(this));
        return this.seekbarAnimationFrame;
    }

    requestAnimation(): number {
        this.setFps();
        this.resetCanvas(this.canvasContext);
        this.setTitle(this.canvasContext);
        applyTransformation(this.canvasContext, this.canvasAction.draw);
        this.canvasContext.stroke();
        this.animationFrame = requestAnimationFrame(this.requestAnimation.bind(this));
        return this.animationFrame;
    }

    changeMode(mode: string) {
        this.currentMode = mode;

        const addOrInsert = (canvasAction: any, value: any) => {
            const index = canvasAction.draw.findIndex(({ drawKind }: any) => drawKind === 'eq');

            if (index > -1) {
                canvasAction.draw[index] = value;
            } else {
                canvasAction.draw.push(value);
            }
        }

        switch (this.currentMode) {
            case 'Bar':
            case 'Bar Mirrored': {
                this.analyser = this.initializeAnalyzerBar();
                const value = {
                    ...createOptionsForBar(this.frequencyIncr, this.currentMode === 'Bar Mirrored'),
                    isReflective: true,
                    drawKind: 'eq',
                    analyser: this.analyser,
                    buffer: this.frequencyBuffer,
                    width: this.width,
                    height: this.height,
                }
                addOrInsert(this.canvasAction, value);
                break;
            }

            case 'Wave': {
                this.analyser = this.initializeAnalyzerWave();
                const value = {
                    ...createOptionsForWave(),
                    drawKind: 'eq',
                    analyser: this.analyser,
                    buffer: this.buffer,
                    width: this.width,
                    height: this.height,
                }
                addOrInsert(this.canvasAction, value);
                break;
            }

            case 'Wave Circle': {
                this.analyser = this.initializeAnalyzerBar();
                const value = {
                    ...createOptionsForWaveCircle(this.frequencyIncr),
                    drawKind: 'eq',
                    analyser: this.analyser,
                    buffer: this.frequencyBuffer,
                    width: this.width,
                    height: this.height,
                }
                addOrInsert(this.canvasAction, value);
                break;
            }

            case 'Bar Circle':
            case 'Bar Circle Mirrored': {
                this.analyser = this.initializeAnalyzerBar();
                const value = {
                    ...createBarCircleEq(this.frequencyIncr, this.currentMode === 'Bar Circle Mirrored'),
                    drawKind: 'eq',
                    analyser: this.analyser,
                    buffer: this.frequencyBuffer,
                    width: this.width,
                    height: this.height,
                }
                addOrInsert(this.canvasAction, value);
                break;
            }

            default:
                break;
        }   

        this.run();
    }

    run(): number {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame as number);
            cancelAnimationFrame(this.seekbarAnimationFrame as number);
        }

        if (!this.audioService.isPaused()) {
            this.requestSeekbarAnimation();
            return this.requestAnimation();
        }

        return 0;
    }
}

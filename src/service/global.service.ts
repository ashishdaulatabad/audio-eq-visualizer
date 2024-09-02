import { Observable } from '../common/observable';
import { Subscriber } from '../common/subscriber';

export class GlobalAudioService {
    // @ts-expect-error
    audioContext: AudioContext;
    // @ts-expect-error
    mainGain: GainNode;
    // @ts-expect-error
    sourceBuffer: AudioBuffer;
    // @ts-expect-error
    bufferSourceNode: AudioBufferSourceNode;
    contextObservable$: Observable<void>;
    fileObservable$: Observable<{ title: string, buffer: AudioBuffer }>;
    paused = true;
    initialized = false;
    // @ts-expect-error
    audioWorkletNode: AudioWorkletNode;

    constructor(
        private subscriber: Subscriber,
        private wasmModule: ArrayBuffer
    ) {
        this.contextObservable$ = this.subscriber.createSubscription<void>('contextcreated');
        this.fileObservable$ = this.subscriber.createSubscription('musicchanged');
    }

    createWorkletNode() {
        this.useAudioContext().audioWorklet.addModule('scripts/phase-vocoder.service.js').then(_ => {
            this.audioWorkletNode = new AudioWorkletNode(this.useAudioContext(), 'phase-vocoder-processor'); 
            this.audioWorkletNode.port.postMessage({
                data: this.wasmModule
            });

            this.audioWorkletNode.port.onmessage = (event) => {
                if (event.data.wasm_init) {
                    this.initialized = true;
                    this.contextObservable$.fire();
                }
            }

            this.mainGain.connect(this.audioWorkletNode);
            this.audioWorkletNode.connect(this.audioContext.destination);
        }).catch(err => {
            console.error(err);
        });
    }

    changePitchFactor(value: number) {
        // @ts-expect-error
        const currentPitch = this.audioWorkletNode.parameters.get('pitchFactor');
        currentPitch.value = value;
    }

    changeSpeedFactor(value: number) {
        // @ts-expect-error
        const currentRate = this.audioWorkletNode.parameters.get('playbackRate');
        currentRate.value = value;
    }

    useAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
            this.mainGain = this.audioContext.createGain();
            this.createWorkletNode();
        }

        return this.audioContext;
    }

    setPaused(paused: boolean) {
        this.paused = paused;
    }

    makeConnection(sourceNode: AudioNode) {
        if (!this.mainGain) {
            this.useAudioContext();
        }

        sourceNode.connect(this.mainGain);
    }

    isInitialized() {
        return this.initialized;
    }

    isPaused() {
        return this.paused;
    }

    resume() {
        this.paused = false;
        this.useAudioContext().resume();
    }

    pause() {
        this.paused = true;
        this.useAudioContext().suspend();
    }

    connectGainTo(destNode: AudioNode) {
        if (!this.mainGain) {
            this.useAudioContext();
        }

        this.mainGain.connect(destNode);
        destNode.connect(this.audioContext.destination);
    }

    connectAudioWorkletNodeTo(destNode: AudioNode) {
        if (!this.audioContext) {
            this.useAudioContext();
        }

        if (this.audioWorkletNode) {
            this.audioWorkletNode.connect(destNode);
            destNode.connect(this.audioContext.destination);
        }
    }
}

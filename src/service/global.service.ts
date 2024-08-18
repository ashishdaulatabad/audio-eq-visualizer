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
    // @ts-expect-error
    audioWorkletNode: AudioWorkletNode;

    constructor(
        private subscriber: Subscriber
    ) {
        this.contextObservable$ = this.subscriber.createSubscription<void>('contextcreated');
        this.fileObservable$ = this.subscriber.createSubscription('musicchanged');
    }

    createWorkletNode() {
        this.useAudioContext().audioWorklet.addModule('scripts/phase-vocoder.service.js').then(data => {
            this.audioWorkletNode = new AudioWorkletNode(
                this.useAudioContext(),
                'phase-vocoder-processor',
            );
            this.audioWorkletNode.connect(this.audioContext.destination);
            this.mainGain.connect(this.audioWorkletNode);
        }).catch(err => {
            console.error(err);
        });
    }

    changePitchFactor(value: number) {
        // @ts-expect-error
        const currentPitch = this.audioWorkletNode.parameters.get('pitchFactor');
        currentPitch.value = value;
    }

    useAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
            this.mainGain = this.audioContext.createGain();
            this.contextObservable$.fire();
            this.createWorkletNode();
        }

        return this.audioContext;
    }

    setAudioBuffer(file: File) {
        const fileReader = new FileReader();

        fileReader.onloadend = (event) => {
            if (event.target) {
                this.useAudioContext().decodeAudioData(event.target.result as ArrayBuffer)
                    .then((buffer) => {
                        this.paused = false;
                        this.fileObservable$.fire({ title: file.name, buffer });
                    })
                    .catch((err) => console.log('Could not load mp3 file'));
            }
        }

        fileReader.readAsArrayBuffer(file);
    }

    makeConnection(sourceNode: AudioNode) {
        if (!this.mainGain) {
            this.useAudioContext();
        }

        sourceNode.connect(this.mainGain);
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
    }

    createOscillatorNode(): OscillatorNode {
        return this.useAudioContext().createOscillator();
    }
}

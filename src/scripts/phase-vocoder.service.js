"use strict";

import init, { fast_fft, fast_ifft, shift_peaks } from "wasm-fft";

const BUFFERED_BLOCK_SIZE = 8192;

function genHannWindow(length) {
    const win = new Float32Array(length);
    for (let i = 0; i < length; ++i) {
        win[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / length));
    }

    return win;
}

function generateWLookup(length) {
    const lookUp = new Float32Array(length << 1);

    for (let index = 0; index < length; index += 2) {
        const angle = (Math.PI * index) / length;
        const real = Math.cos(angle),
            img = Math.sin(angle);

        lookUp[index] = real;
        lookUp[index + 1] = img;
    }

    return lookUp;
}

const WEBAUDIO_BLOCK_SIZE = 128;

/// Credits to: https://github.com/olvb/phaze
class OLAProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super(options);

        this.nbInputs = options.numberOfInputs;
        this.nbOutputs = options.numberOfOutputs;

        this.blockSize = options.processorOptions.blockSize;
        // TODO for now, the only support hop size is the size of a web audio block
        this.hopSize = WEBAUDIO_BLOCK_SIZE;

        this.nbOverlaps = this.blockSize / this.hopSize;

        // pre-allocate input buffers (will be reallocated if needed)
        this.inputBuffers = new Array(this.nbInputs);
        this.inputBuffersHead = new Array(this.nbInputs);
        this.inputBuffersToSend = new Array(this.nbInputs);
        // default to 1 channel per input until we know more
        for (let i = 0; i < this.nbInputs; ++i) {
            this.allocateInputChannels(i, 1);
        }
        // pre-allocate input buffers (will be reallocated if needed)
        this.outputBuffers = new Array(this.nbOutputs);
        this.outputBuffersToRetrieve = new Array(this.nbOutputs);
        // default to 1 channel per output until we know more
        for (let i = 0; i < this.nbOutputs; ++i) {
            this.allocateOutputChannels(i, 1);
        }
    }

    reallocateChannelsIfNeeded(inputs, outputs) {
        for (let i = 0; i < this.nbInputs; ++i) {
            let nbChannels = inputs[i].length;
            if (nbChannels != this.inputBuffers[i].length) {
                this.allocateInputChannels(i, nbChannels);
            }
        }

        for (let i = 0; i < this.nbOutputs; ++i) {
            let nbChannels = outputs[i].length;
            if (nbChannels != this.outputBuffers[i].length) {
                this.allocateOutputChannels(i, nbChannels);
            }
        }
    }

    allocateInputChannels(inputIndex, nbChannels) {
        // allocate input buffers
        this.inputBuffers[inputIndex] = new Array(nbChannels);
        this.inputBuffersHead[inputIndex] = new Array(nbChannels);
        this.inputBuffersToSend[inputIndex] = new Array(nbChannels);

        // allocate input buffers to send and head pointers to copy from
        // (cannot directly send a pointer/subarray because input may be modified)
        for (let i = 0; i < nbChannels; ++i) {
            this.inputBuffers[inputIndex][i] = new Float32Array(
                this.blockSize + WEBAUDIO_BLOCK_SIZE,
            );
            this.inputBuffers[inputIndex][i].fill(0);
            // Reference of the input buffers.
            this.inputBuffersHead[inputIndex][i] = this.inputBuffers[
                inputIndex
            ][i].subarray(0, this.blockSize);
            this.inputBuffersToSend[inputIndex][i] = new Float32Array(
                this.blockSize,
            );
        }
    }

    allocateOutputChannels(outputIndex, nbChannels) {
        // allocate output buffers
        this.outputBuffers[outputIndex] = new Array(nbChannels);
        this.outputBuffersToRetrieve[outputIndex] = new Array(nbChannels);

        // allocate output buffers to retrieve
        // (cannot send a pointer/subarray because new output has to be add to exising output)
        for (let i = 0; i < nbChannels; ++i) {
            this.outputBuffers[outputIndex][i] = new Float32Array(
                this.blockSize,
            );
            this.outputBuffers[outputIndex][i].fill(0);
            this.outputBuffersToRetrieve[outputIndex][i] = new Float32Array(
                this.blockSize,
            );
            this.outputBuffersToRetrieve[outputIndex][i].fill(0);
        }
    }

    readAndSetInputs(inputBuffers, inputs) {
        if (inputs[0].length && inputs[0][0].length == 0) {
            const totalInputs = this.nbInputs;

            for (let i = 0; i < totalInputs; ++i) {
                const inputBuffer = inputBuffers[i];

                for (let j = 0; j < inputBuffer.length; j++) {
                    inputBuffer[j].fill(0, this.blockSize);
                }
            }
            return false;
        }

        const totalInputs = this.nbInputs;

        for (let i = 0; i < totalInputs; ++i) {
            const inputBuffer = inputBuffers[i];
            const incomingInput = inputs[i];

            for (let j = 0; j < inputBuffer.length; j++) {
                const webAudioBlock = incomingInput[j];
                inputBuffer[j].set(webAudioBlock, this.blockSize);
            }
        }

        return true;
    }

    /** Write next web audio block from output buffers **/
    writeOutputs(outputs) {
        for (let i = 0; i < this.nbInputs; ++i) {
            for (let j = 0; j < this.inputBuffers[i].length; ++j) {
                const webAudioBlock = this.outputBuffers[i][j].subarray(
                    0,
                    WEBAUDIO_BLOCK_SIZE,
                );
                outputs[i][j].set(webAudioBlock);
            }
        }
    }

    static shiftBuffers(buffers) {
        const length = buffers.length;

        for (let i = 0; i < length; ++i) {
            const buffer = buffers[i];

            for (let j = 0; j < buffer.length; j++) {
                buffer[j].copyWithin(0, WEBAUDIO_BLOCK_SIZE);
            }
        }
    }

    /** Copy contents of input buffers to buffer actually sent to process **/
    prepareInputBuffersToSend() {
        const totalInputs = this.nbInputs;
        for (let i = 0; i < totalInputs; ++i) {
            for (let j = 0; j < this.inputBuffers[i].length; ++j) {
                this.inputBuffersToSend[i][j].set(this.inputBuffersHead[i][j]);
            }
        }
    }

    /** Add contents of output buffers just processed to output buffers **/
    handleOutputBuffersToRetrieve() {
        for (let i = 0; i < this.nbOutputs; ++i) {
            for (let j = 0; j < this.outputBuffers[i].length; ++j) {
                for (let k = 0; k < this.blockSize; ++k) {
                    this.outputBuffers[i][j][k] +=
                        this.outputBuffersToRetrieve[i][j][k] /
                        this.nbOverlaps;
                }
            }
        }
    }

    process(inputs, outputs, params) {
        this.reallocateChannelsIfNeeded(inputs, outputs);
        if (this.readAndSetInputs(this.inputBuffers, inputs)) {

            OLAProcessor.shiftBuffers(this.inputBuffers);
            this.prepareInputBuffersToSend();

            this.processOLA(
                this.inputBuffersToSend,
                this.outputBuffersToRetrieve,
                params,
            );

            this.handleOutputBuffersToRetrieve();
            this.writeOutputs(outputs);
            OLAProcessor.shiftBuffers(this.outputBuffers, true);
        }
        return true;
    }
}

class PhaseVocoderProcessor extends OLAProcessor {
    static get parameterDescriptors() {
        return [{
            name: 'pitchFactor',
            defaultValue: 1.0,
        }];
    }

    async onmessage(data) {
        const instance = async () => {
            try {
                WebAssembly.compile(data.data).then(async data => {
                    let _ = await init({ module_or_path: data });
                    this.processed = true;
                    this.port.postMessage({ wasm_init: true });
                }); 
            } catch (e) {
                console.error(e);
            }
        }
        instance();
    }

    constructor(options) {
        options.processorOptions = {
            blockSize: BUFFERED_BLOCK_SIZE,
        };
        super(options);
        this.port.onmessage = async (event) => this.onmessage(event.data);
        this.port.onmessageerror = (event) => {
            console.log(event);
        }

        this.processed = false;

        this.fftSize = this.blockSize;
        this.timeCursor = 0;

        this.lookUp = generateWLookup(this.fftSize);
        this.hannWindow = genHannWindow(this.blockSize);

        this.freqComplexBufferShifted = new Float32Array(this.fftSize << 1);
        this.timeComplexBuffer = new Float32Array(this.fftSize);
        this.magnitudes = new Float32Array(this.fftSize / 2 + 1);
        this.peakIndexes = new Int32Array(this.magnitudes.length / 4 + 1);
        this.nbPeaks = 0;
    }

    processOLA(inputs, outputs, parameters) {
        const pitchFactor = parameters.pitchFactor[parameters.pitchFactor.length - 1];

        for (let i = 0; i < this.nbInputs; ++i) {
            for (let j = 0; j < inputs[i].length; j++) {
                const input = inputs[i][j];
                const output = outputs[i][j];

                PhaseVocoderProcessor.applyHannWindow(this.hannWindow, input);

                if (this.processed) {
                    const freqComplexBuffer = fast_fft(input, this.lookUp);
                    this.computeMagnitudes(freqComplexBuffer);

                    this.nbPeaks = PhaseVocoderProcessor.findPeaks(this.magnitudes, this.peakIndexes);
                    this.freqComplexBufferShifted = shift_peaks(
                        this.fftSize,
                        freqComplexBuffer,
                        this.peakIndexes,
                        this.magnitudes.length,
                        this.nbPeaks,
                        pitchFactor,
                        this.timeCursor
                    );

                    this.timeComplexBuffer = fast_ifft(this.freqComplexBufferShifted, this.lookUp);
                    output.set(this.timeComplexBuffer);
                    PhaseVocoderProcessor.applyHannWindow(this.hannWindow, output);
                }
            }
        }

        this.timeCursor += this.hopSize;
    }

    /** Apply Hann window in-place */
    static applyHannWindow(hannWindow, input) {
        for (let i = 0; i < input.length; ++i) {
            input[i] *= hannWindow[i];
        }
    }

    /** Compute squared magnitudes for peak finding **/
    computeMagnitudes(complexBuffer) {
        const magnitudeRef = this.magnitudes,
            length = this.magnitudes.length,
            cBuffer = complexBuffer;

        for (let i = 0, j = 0; i < length; ++i, j += 2) {
            const real = cBuffer[j];
            const imag = cBuffer[j + 1];
            magnitudeRef[i] = real ** 2 + imag ** 2;
        }
    }

    /** Find peaks in spectrum magnitudes **/
    static findPeaks(magnitudes, peakIndexes) {
        let peaks = 0,
            i = 2;
        const end = magnitudes.length - 2;

        while (i < end) {
            const mag = magnitudes[i];
            if (magnitudes[i - 1] >= mag || magnitudes[i - 2] >= mag) {
                ++i;
                continue;
            }

            if (magnitudes[i + 1] >= mag || magnitudes[i + 2] >= mag) {
                ++i;
                continue;
            }

            peakIndexes[peaks] = i;
            ++peaks;
            i += 2;
        }

        return peaks;
    }
}

registerProcessor('phase-vocoder-processor', PhaseVocoderProcessor);

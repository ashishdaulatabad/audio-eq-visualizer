"use strict";

class FftIndexGenerator {
    static trailingZeroesAndLen(value) {
        if (value === 0) {
            return [0, 0];
        }

        let count_trailing_zeroes = 0;
        let count_digits = 0;

        while ((value & 1) == 0) {
            count_trailing_zeroes += 1;
            value >>= 1;
        }
        while (value != 0) {
            count_digits += 1;
            value >>= 1;
        }

        return [count_trailing_zeroes, count_trailing_zeroes + count_digits];
    }

    constructor(len) {
        this.len = 0;
        this.base = 0;
        this.head = 0;
        this.head_lim = 0;
        this.head_log = 0;
        this.base_log = 0;
        this.done = 0;
        this.end = false;

        const [trailing, digit_len] =
            FftIndexGenerator.trailingZeroesAndLen(len);
        this.len = len;
        this.head_log = trailing;
        this.head_lim =
            1 << (digit_len - trailing - ((len & (len - 1)) === 0 ? 1 : 0));
        this.base_log = trailing - 1;
    }

    [Symbol.iterator]() {
        return this;
    }

    getBaseSize() {
        return this.len >> this.head_log;
    }

    addHead() {
        ++this.head;
        this.head %= this.head_lim;
    }

    addBase() {
        let start = 1 << this.base_log;

        while (start > 0 && (start & this.base) > 1) {
            this.base ^= start;
            start >>= 1;
        }

        this.base |= start;
    }

    join() {
        return (this.head << this.head_log) | this.base;
    }

    next() {
        if (this.done < this.len) {
            let value = this.join();
            for (;;) {
                this.end = value == this.len - 1;
                this.addHead();

                if (this.head == 0) {
                    this.addBase();
                }

                if (value < this.len || this.done >= this.len) {
                    break;
                }
                value = this.join();
            }
            this.done += 1;

            return { value };
        }
        return { done: true, value: 0 };
    }
}

function generateIndexForFFT(len) {
    return new FftIndexGenerator(len);
}

function fft(array, lookup, dest) {
    let length = array.length,
        index = 0;
    const result = dest;
    result.fill(0.0);

    for (const reverseIndex of generateIndexForFFT(length)) {
        result[reverseIndex << 1] = array[index];
        ++index;
    }

    /// FFT_2-Radix
    for (let index = 0; index < length << 1; index += 4) {
        const c1r = result[index];
        const c1i = result[index + 1];
        const c2r = result[index + 2];
        const c2i = result[index + 3];

        result[index] = c1r + c2r;
        result[index + 1] = c1i + c2i;
        result[index + 2] = c1r - c2r;
        result[index + 3] = c1i - c2i;
    }

    if (length >= 2) {
        for (
            let blockSize = 4, lengthCheckLookup = length >> 2;
            blockSize <= length;
            blockSize <<= 1, lengthCheckLookup >>= 1
        ) {
            const lookupIncr = lengthCheckLookup << 1;
            const blockJump = blockSize << 1;

            for (
                let startIndex = 0;
                startIndex < length << 1;
                startIndex += blockJump
            ) {
                let wr = 1,
                    wi = 0;
                let lookupIndex = 0;

                for (
                    let index = startIndex;
                    index < startIndex + blockSize;
                    index += 2
                ) {
                    const c1r = result[index];
                    const c1i = result[index + 1];

                    let c2r = result[index + blockSize];
                    let c2i = result[index + blockSize + 1];
                    const temp = c2r * wr - c2i * wi;
                    c2i = c2r * wi + c2i * wr;
                    c2r = temp;

                    result[index] = c1r + c2r;
                    result[index + 1] = c1i + c2i;

                    result[index + blockSize] = c1r - c2r;
                    result[index + blockSize + 1] = c1i - c2i;

                    lookupIndex += lookupIncr;
                    wr = lookup[lookupIndex];
                    wi = -lookup[lookupIndex + 1];
                }
            }
        }
    }
}

function ifft(array, lookup, dest) {
    let length = array.length >> 1;
    const result = new Float32Array(length << 1);
    let index = 0;

    for (let reverseIndex of generateIndexForFFT(length)) {
        result[reverseIndex << 1] = array[index << 1];
        result[(reverseIndex << 1) + 1] = array[(index << 1) + 1];
        ++index;
    }
    /// FFT_2-Radix
    for (let index = 0; index < length << 1; index += 4) {
        const c1r = result[index];
        const c1i = result[index + 1];
        const c2r = result[index + 2];
        const c2i = result[index + 3];

        const f1r = c1r + c2r;
        const f1i = c1i + c2i;
        const f2r = c1r - c2r;
        const f2i = c1i - c2i;

        result[index] = f1r;
        result[index + 1] = f1i;
        result[index + 2] = f2r;
        result[index + 3] = f2i;
    }

    if (length >= 2) {
        for (
            let blockSize = 4, lengthCheckLookup = length >> 2;
            blockSize <= length;
            blockSize <<= 1, lengthCheckLookup >>= 1
        ) {
            const blockJump = blockSize << 1;
            const lookupIncr = lengthCheckLookup << 1;

            for (
                let startIndex = 0;
                startIndex < length << 1;
                startIndex += blockJump
            ) {
                let wr = 1,
                    wi = 0,
                    lookupIndex = 0;

                for (
                    let index = startIndex;
                    index < startIndex + blockSize;
                    index += 2
                ) {
                    const c1r = result[index];
                    const c1i = result[index + 1];

                    let c2r = result[index + blockSize];
                    let c2i = result[index + blockSize + 1];
                    const temp = c2r * wr - c2i * wi;
                    c2i = c2r * wi + c2i * wr;
                    c2r = temp;

                    result[index] = c1r + c2r;
                    result[index + 1] = c1i + c2i;

                    result[index + blockSize] = c1r - c2r;
                    result[index + blockSize + 1] = c1i - c2i;

                    lookupIndex += lookupIncr;
                    wr = lookup[lookupIndex];
                    wi = lookup[lookupIndex + 1];
                }
            }
        }
    }

    const finalResult = dest;

    for (let index = 0; index < length << 1; index += 2) {
        finalResult[index >> 1] = result[index] / length;
    }
}

function completeSpectrum(spectrum) {
    let size = spectrum.length;
    let half = size >>> 1;

    for (let i = 2; i < half; i += 2) {
        spectrum[size - i] = spectrum[i];
        spectrum[size - i + 1] = -spectrum[i + 1];
    }
}

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
            return;
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

    static shiftBuffers(buffers, isOutput) {
        const length = buffers.length;

        for (let i = 0; i < length; ++i) {
            const buffer = buffers[i];

            for (let j = 0; j < buffer.length; j++) {
                buffer[j].copyWithin(0, WEBAUDIO_BLOCK_SIZE);
                // if (isOutput) {
                //     buffer[j].subarray(this.blockSize - WEBAUDIO_BLOCK_SIZE).fill(0);
                // }
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
                        (this.outputBuffersToRetrieve[i][j][k] * 1.5) /
                        this.nbOverlaps;
                }
            }
        }
    }

    process(inputs, outputs, params) {
        this.reallocateChannelsIfNeeded(inputs, outputs);
        this.readAndSetInputs(this.inputBuffers, inputs);

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

        return true;
    }
}

class PhaseVocoderProcessor extends OLAProcessor {
    static get parameterDescriptors() {
        return [
            {
                name: "pitchFactor",
                defaultValue: 1.0,
            },
        ];
    }

    constructor(options) {
        options.processorOptions = {
            blockSize: BUFFERED_BLOCK_SIZE,
        };
        super(options);

        this.fftSize = this.blockSize;
        this.timeCursor = 0;

        this.lookUp = generateWLookup(this.fftSize);
        this.hannWindow = genHannWindow(this.blockSize);

        this.freqComplexBuffer = new Float32Array(this.fftSize << 1);
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

                PhaseVocoderProcessor.applyHannWindow(
                    this.hannWindow,
                    input,
                );

                fft(input, this.lookUp, this.freqComplexBuffer);
                this.computeMagnitudes();

                this.nbPeaks = PhaseVocoderProcessor.findPeaks(
                    this.magnitudes,
                    this.peakIndexes,
                );
                this.shiftPeaks(
                    this.freqComplexBuffer,
                    this.freqComplexBufferShifted,
                    this.peakIndexes,
                    pitchFactor,
                );
                completeSpectrum(this.freqComplexBufferShifted);

                ifft(
                    this.freqComplexBufferShifted,
                    this.lookUp,
                    this.timeComplexBuffer,
                );
                output.set(this.timeComplexBuffer);
                PhaseVocoderProcessor.applyHannWindow(
                    this.hannWindow,
                    output,
                );
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
    computeMagnitudes() {
        const magnitudeRef = this.magnitudes,
            length = this.magnitudes.length,
            cBuffer = this.freqComplexBuffer;

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

    /** Shift peaks and regions of influence by pitchFactor into new specturm */
    shiftPeaks(
        freqComplexBuffer,
        freqComplexBufferShifted,
        peakIndexes,
        pitchFactor,
    ) {
        // Zero-fill new spectrum
        freqComplexBufferShifted.fill(0);
        const peaks = this.nbPeaks,
            size = this.fftSize;

        for (let i = 0; i < peaks; ++i) {
            // Peak with respect to Pitch Factor
            const peakIndex = peakIndexes[i];
            const peakIndexShifted = Math.round(peakIndex * pitchFactor);

            if (peakIndexShifted > this.magnitudes.length) {
                break;
            }

            // find region of influence
            let startIndex = 0,
                endIndex = size;
            if (i > 0) {
                const peakIndexBefore = peakIndexes[i - 1];
                startIndex = peakIndex - ((peakIndex - peakIndexBefore) >> 1);
            }

            if (i < peaks - 1) {
                const peakIndexAfter = peakIndexes[i + 1];
                const mid = peakIndexAfter - peakIndex + 1;
                endIndex = peakIndex + (mid >> 1);
            }

            // shift whole region of influence around peak to shifted peak
            const startOffset = startIndex - peakIndex;
            const endOffset = endIndex - peakIndex;

            for (let j = startOffset; j < endOffset; j++) {
                const binIndex = peakIndex + j,
                    binIndexShifted = peakIndexShifted + j;

                if (binIndexShifted >= this.magnitudes.length) {
                    break;
                }

                // Apply phase correction
                const omegaDelta =
                    (2 * Math.PI * (binIndexShifted - binIndex)) / size;

                const phaseShiftReal = Math.cos(omegaDelta * this.timeCursor),
                    phaseShiftImag = Math.sin(omegaDelta * this.timeCursor);

                const valueReal = freqComplexBuffer[binIndex << 1],
                    valueImag = freqComplexBuffer[(binIndex << 1) + 1];

                const valueShiftedReal =
                    valueReal * phaseShiftReal - valueImag * phaseShiftImag;
                const valueShiftedImag =
                    valueReal * phaseShiftImag + valueImag * phaseShiftReal;

                freqComplexBufferShifted[binIndexShifted << 1] +=
                    valueShiftedReal;
                freqComplexBufferShifted[(binIndexShifted << 1) + 1] +=
                    valueShiftedImag;
            }
        }
    }
}

registerProcessor('phase-vocoder-processor', PhaseVocoderProcessor);

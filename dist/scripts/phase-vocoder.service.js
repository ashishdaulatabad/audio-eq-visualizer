"use strict";
(() => {
  // wasm-fft/pkg/wasm_fft.js
  var import_meta = {};
  var wasm;
  var cachedUint8ArrayMemory0 = null;
  function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
      cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
  }
  function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
  }
  var heap = new Array(128).fill(void 0);
  heap.push(void 0, null, true, false);
  function getObject(idx) {
    return heap[idx];
  }
  var heap_next = heap.length;
  function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
  }
  function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
  }
  var cachedFloat32ArrayMemory0 = null;
  function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
      cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
  }
  var WASM_VECTOR_LEN = 0;
  function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
  }
  function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
  }
  var cachedDataViewMemory0 = null;
  function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
      cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
  }
  function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
  }
  function process_ola(channel, hann_buffer, lookup_table, pitch_factor, time_cursor) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      var ptr0 = passArrayF32ToWasm0(channel, wasm.__wbindgen_malloc);
      var len0 = WASM_VECTOR_LEN;
      const ptr1 = passArrayF32ToWasm0(hann_buffer, wasm.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      const ptr2 = passArrayF32ToWasm0(lookup_table, wasm.__wbindgen_malloc);
      const len2 = WASM_VECTOR_LEN;
      wasm.process_ola(retptr, ptr0, len0, addHeapObject(channel), ptr1, len1, ptr2, len2, pitch_factor, time_cursor);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var v4 = getArrayF32FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 4, 4);
      return v4;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  var cachedUint32ArrayMemory0 = null;
  async function __wbg_load(module, imports) {
    if (typeof Response === "function" && module instanceof Response) {
      if (typeof WebAssembly.instantiateStreaming === "function") {
        try {
          return await WebAssembly.instantiateStreaming(module, imports);
        } catch (e) {
          if (module.headers.get("Content-Type") != "application/wasm") {
            console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
          } else {
            throw e;
          }
        }
      }
      const bytes = await module.arrayBuffer();
      return await WebAssembly.instantiate(bytes, imports);
    } else {
      const instance = await WebAssembly.instantiate(module, imports);
      if (instance instanceof WebAssembly.Instance) {
        return { instance, module };
      } else {
        return instance;
      }
    }
  }
  function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_copy_to_typed_array = function(arg0, arg1, arg2) {
      new Uint8Array(getObject(arg2).buffer, getObject(arg2).byteOffset, getObject(arg2).byteLength).set(getArrayU8FromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
      takeObject(arg0);
    };
    return imports;
  }
  function __wbg_init_memory(imports, memory) {
  }
  function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedFloat32ArrayMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    return wasm;
  }
  async function __wbg_init(module_or_path) {
    if (wasm !== void 0) return wasm;
    if (typeof module_or_path !== "undefined" && Object.getPrototypeOf(module_or_path) === Object.prototype)
      ({ module_or_path } = module_or_path);
    else
      console.warn("using deprecated parameters for the initialization function; pass a single object instead");
    if (typeof module_or_path === "undefined") {
      module_or_path = new URL("wasm_fft_bg.wasm", import_meta.url);
    }
    const imports = __wbg_get_imports();
    if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {
      module_or_path = fetch(module_or_path);
    }
    __wbg_init_memory(imports);
    const { instance, module } = await __wbg_load(await module_or_path, imports);
    return __wbg_finalize_init(instance, module);
  }
  var wasm_fft_default = __wbg_init;

  // src/scripts/phase-vocoder.service.js
  function genHannWindow(length) {
    const win = new Float32Array(length);
    for (let i = 0; i < length; ++i) {
      win[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / length));
    }
    return win;
  }
  function generateWLookup(length) {
    const lookUp = new Float32Array(length << 1);
    for (let index = 0; index < length; index += 2) {
      const angle = Math.PI * index / length;
      const real = Math.cos(angle), img = Math.sin(angle);
      lookUp[index] = real;
      lookUp[index + 1] = img;
    }
    return lookUp;
  }
  var BUFFERED_BLOCK_SIZE = 8192;
  var WEBAUDIO_BLOCK_SIZE = 128;
  var processSize = 1024;
  var OLAProcessor = class _OLAProcessor extends AudioWorkletProcessor {
    constructor(options) {
      super(options);
      this.nbInputs = options.numberOfInputs;
      this.nbOutputs = options.numberOfOutputs;
      this.blockSize = options.processorOptions.blockSize;
      this.hopSize = WEBAUDIO_BLOCK_SIZE;
      this.nbOverlaps = this.blockSize / processSize;
      this.processOverlap = processSize / WEBAUDIO_BLOCK_SIZE;
      this.processCounter = 0;
      this.inputBuffers = new Array(this.nbInputs);
      this.inputBuffersHead = new Array(this.nbInputs);
      this.inputBuffersToSend = new Array(this.nbInputs);
      for (let i = 0; i < this.nbInputs; ++i) {
        this.allocateInputChannels(i, 1);
      }
      this.outputBuffers = new Array(this.nbOutputs);
      this.outputBuffersToRetrieve = new Array(this.nbOutputs);
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
      this.inputBuffers[inputIndex] = new Array(nbChannels);
      this.inputBuffersHead[inputIndex] = new Array(nbChannels);
      this.inputBuffersToSend[inputIndex] = new Array(nbChannels);
      for (let i = 0; i < nbChannels; ++i) {
        this.inputBuffers[inputIndex][i] = new Float32Array(this.blockSize + processSize);
        this.inputBuffers[inputIndex][i].fill(0);
        this.inputBuffersHead[inputIndex][i] = this.inputBuffers[inputIndex][i].subarray(0, this.blockSize);
        this.inputBuffersToSend[inputIndex][i] = new Float32Array(this.blockSize);
      }
    }
    allocateOutputChannels(outputIndex, nbChannels) {
      this.outputBuffers[outputIndex] = new Array(nbChannels);
      this.outputBuffersToRetrieve[outputIndex] = new Array(nbChannels);
      for (let i = 0; i < nbChannels; ++i) {
        this.outputBuffers[outputIndex][i] = new Float32Array(this.blockSize);
        this.outputBuffers[outputIndex][i].fill(0);
        this.outputBuffersToRetrieve[outputIndex][i] = new Float32Array(this.blockSize);
        this.outputBuffersToRetrieve[outputIndex][i].fill(0);
      }
    }
    readAndSetInputs(inputBuffers, inputs) {
      if (inputs[0].length && inputs[0][0].length == 0) {
        const totalInputs2 = this.nbInputs;
        for (let i = 0; i < totalInputs2; ++i) {
          const inputBuffer = inputBuffers[i];
          for (let j = 0; j < inputBuffer.length; j++) {
            inputBuffer[j].fill(0, this.blockSize + processSize - WEBAUDIO_BLOCK_SIZE);
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
          inputBuffer[j].set(webAudioBlock, this.blockSize + processSize - WEBAUDIO_BLOCK_SIZE);
        }
      }
      return true;
    }
    /** Write next web audio block from output buffers **/
    writeOutputs(outputs) {
      for (let i = 0; i < this.nbInputs; ++i) {
        for (let j = 0; j < this.inputBuffers[i].length; ++j) {
          const webAudioBlock = this.outputBuffers[i][j].subarray(0, WEBAUDIO_BLOCK_SIZE);
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
    handleOutputBuffersToRetrieve() {
      for (let i = 0; i < this.nbOutputs; ++i) {
        for (let j = 0; j < this.outputBuffers[i].length; ++j) {
          for (let k = 0; k < this.blockSize; ++k) {
            this.outputBuffers[i][j][k] += this.outputBuffersToRetrieve[i][j][k] / this.nbOverlaps;
          }
        }
      }
    }
    process(inputs, outputs, params) {
      this.reallocateChannelsIfNeeded(inputs, outputs);
      if (this.readAndSetInputs(this.inputBuffers, inputs)) {
        _OLAProcessor.shiftBuffers(this.inputBuffers);
        if (this.processCounter === this.processOverlap || this.processCounter === 0) {
          this.prepareInputBuffersToSend();
          this.processOLA(this.inputBuffersToSend, this.outputBuffersToRetrieve, params);
          this.handleOutputBuffersToRetrieve();
          this.processCounter = 0;
        }
        this.writeOutputs(outputs);
        _OLAProcessor.shiftBuffers(this.outputBuffers);
        this.processCounter++;
      }
      return true;
    }
  };
  var PhaseVocoderProcessor = class extends OLAProcessor {
    static get parameterDescriptors() {
      return [{
        name: "pitchFactor",
        defaultValue: 1
      }];
    }
    async onmessage(data) {
      const instance = async () => {
        try {
          WebAssembly.compile(data.data).then(async (data2) => {
            await wasm_fft_default({ module_or_path: data2 });
            this.processed = true;
            this.port.postMessage({ wasm_init: true });
          });
        } catch (e) {
          console.error(e);
        }
      };
      instance();
    }
    constructor(options) {
      options.processorOptions = {
        blockSize: BUFFERED_BLOCK_SIZE
      };
      super(options);
      this.port.onmessage = async (event) => this.onmessage(event.data);
      this.port.onmessageerror = (event) => {
        console.error("Error in PhaseVocoder", event);
      };
      this.processed = false;
      this.fftSize = this.blockSize;
      this.timeCursor = 0;
      this.lookUp = generateWLookup(this.fftSize);
      this.hannWindow = genHannWindow(this.blockSize);
    }
    processOLA(inputs, outputs, parameters) {
      const pitchFactor = parameters.pitchFactor[parameters.pitchFactor.length - 1];
      for (let i = 0; i < this.nbInputs; ++i) {
        for (let j = 0; j < inputs[i].length; j++) {
          const input = inputs[i][j];
          const output = outputs[i][j];
          if (this.processed) {
            output.set(process_ola(input, this.hannWindow, this.lookUp, pitchFactor, this.timeCursor));
          } else {
            output.set(input);
          }
        }
      }
      this.timeCursor += processSize;
    }
  };
  registerProcessor("phase-vocoder-processor", PhaseVocoderProcessor);
})();

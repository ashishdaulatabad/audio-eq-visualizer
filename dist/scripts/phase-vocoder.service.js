"use strict";
(() => {
  // wasm-fft/pkg/wasm_fft.js
  var import_meta = {};
  var wasm;
  var heap = new Array(128).fill(void 0);
  heap.push(void 0, null, true, false);
  function getObject(idx) {
    return heap[idx];
  }
  function isLikeNone(x) {
    return x === void 0 || x === null;
  }
  var heap_next = heap.length;
  function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
  }
  var WASM_VECTOR_LEN = 0;
  var cachedUint8ArrayMemory0 = null;
  function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
      cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
  }
  function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === void 0) {
      const buf = cachedTextEncoder.encode(arg);
      const ptr2 = malloc(buf.length, 1) >>> 0;
      getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
      WASM_VECTOR_LEN = buf.length;
      return ptr2;
    }
    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;
    const mem = getUint8ArrayMemory0();
    let offset = 0;
    for (; offset < len; offset++) {
      const code = arg.charCodeAt(offset);
      if (code > 127) break;
      mem[ptr + offset] = code;
    }
    if (offset !== len) {
      if (offset !== 0) {
        arg = arg.slice(offset);
      }
      ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
      const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
      const ret = cachedTextEncoder.encodeInto(arg, view);
      offset += ret.written;
      ptr = realloc(ptr, len, offset, 1) >>> 0;
    }
    WASM_VECTOR_LEN = offset;
    return ptr;
  }
  var cachedDataViewMemory0 = null;
  function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
      cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
  }
  function handleError(f, args) {
    try {
      return f.apply(this, args);
    } catch (e) {
      wasm.__wbindgen_exn_store(addHeapObject(e));
    }
  }
  function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
  }
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
  function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
  }
  var CLOSURE_DTORS = typeof FinalizationRegistry === "undefined" ? { register: () => {
  }, unregister: () => {
  } } : new FinalizationRegistry(
    (state) => {
      wasm.__wbindgen_export_3.get(state.dtor)(state.a, state.b);
    }
  );
  function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
      state.cnt++;
      const a = state.a;
      state.a = 0;
      try {
        return f(a, state.b, ...args);
      } finally {
        if (--state.cnt === 0) {
          wasm.__wbindgen_export_3.get(state.dtor)(a, state.b);
          CLOSURE_DTORS.unregister(state);
        } else {
          state.a = a;
        }
      }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
  }
  var cachedFloat32ArrayMemory0 = null;
  function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
      cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
  }
  function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
  }
  function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
  }
  function process_ola_simd(channel, hann_buffer, pitch_factor, time_cursor, frequency_increment, bands, multiplier2) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      var ptr0 = passArrayF32ToWasm0(channel, wasm.__wbindgen_malloc);
      var len0 = WASM_VECTOR_LEN;
      const ptr1 = passArrayF32ToWasm0(hann_buffer, wasm.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      const ptr2 = passArrayF32ToWasm0(bands, wasm.__wbindgen_malloc);
      const len2 = WASM_VECTOR_LEN;
      const ptr3 = passArrayF32ToWasm0(multiplier2, wasm.__wbindgen_malloc);
      const len3 = WASM_VECTOR_LEN;
      wasm.process_ola_simd(retptr, ptr0, len0, addHeapObject(channel), ptr1, len1, pitch_factor, time_cursor, frequency_increment, ptr2, len2, ptr3, len3);
      var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
      var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
      var v5 = getArrayF32FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 4, 4);
      return v5;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  var cachedUint32ArrayMemory0 = null;
  function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
      mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
  }
  function __wbg_adapter_8(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures_____invoke__h5e3655efe03fdf15(arg0, arg1, addHeapObject(arg2));
  }
  function __wbg_adapter_45(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__h6a3d8690779c6aec(arg0, arg1);
  }
  function __wbg_adapter_79(arg0, arg1, arg2, arg3, arg4) {
    wasm.wasm_bindgen__convert__closures_____invoke__h3ab9dd223db404e9(arg0, arg1, addHeapObject(arg2), arg3, addHeapObject(arg4));
  }
  function __wbg_adapter_92(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures_____invoke__h6bcd9be62aad30bc(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
  }
  var WasmBindgenTestContextFinalization = typeof FinalizationRegistry === "undefined" ? { register: () => {
  }, unregister: () => {
  } } : new FinalizationRegistry((ptr) => wasm.__wbg_wasmbindgentestcontext_free(ptr >>> 0, 1));
  var WasmBindgenTestContext = class {
    __destroy_into_raw() {
      const ptr = this.__wbg_ptr;
      this.__wbg_ptr = 0;
      WasmBindgenTestContextFinalization.unregister(this);
      return ptr;
    }
    free() {
      const ptr = this.__destroy_into_raw();
      wasm.__wbg_wasmbindgentestcontext_free(ptr, 0);
    }
    /**
     * Creates a new context ready to run tests.
     *
     * A `Context` is the main structure through which test execution is
     * coordinated, and this will collect output and results for all executed
     * tests.
     */
    constructor() {
      const ret = wasm.wasmbindgentestcontext_new();
      this.__wbg_ptr = ret >>> 0;
      WasmBindgenTestContextFinalization.register(this, this.__wbg_ptr, this);
      return this;
    }
    /**
     * Handle `--include-ignored` flag.
     * @param {boolean} include_ignored
     */
    include_ignored(include_ignored) {
      wasm.wasmbindgentestcontext_include_ignored(this.__wbg_ptr, include_ignored);
    }
    /**
     * Handle filter argument.
     * @param {number} filtered
     */
    filtered_count(filtered) {
      wasm.wasmbindgentestcontext_filtered_count(this.__wbg_ptr, filtered);
    }
    /**
     * Executes a list of tests, returning a promise representing their
     * eventual completion.
     *
     * This is the main entry point for executing tests. All the tests passed
     * in are the JS `Function` object that was plucked off the
     * `WebAssembly.Instance` exports list.
     *
     * The promise returned resolves to either `true` if all tests passed or
     * `false` if at least one test failed.
     * @param {any[]} tests
     * @returns {Promise<any>}
     */
    run(tests) {
      const ptr0 = passArrayJsValueToWasm0(tests, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      const ret = wasm.wasmbindgentestcontext_run(this.__wbg_ptr, ptr0, len0);
      return takeObject(ret);
    }
  };
  if (Symbol.dispose) WasmBindgenTestContext.prototype[Symbol.dispose] = WasmBindgenTestContext.prototype.free;
  var EXPECTED_RESPONSE_TYPES = /* @__PURE__ */ new Set(["basic", "cors", "default"]);
  async function __wbg_load(module, imports) {
    if (typeof Response === "function" && module instanceof Response) {
      if (typeof WebAssembly.instantiateStreaming === "function") {
        try {
          return await WebAssembly.instantiateStreaming(module, imports);
        } catch (e) {
          const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);
          if (validResponse && module.headers.get("Content-Type") !== "application/wasm") {
            console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
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
    imports.wbg.__wbg_Deno_ac7e2379e9927d03 = function(arg0) {
      const ret = getObject(arg0).Deno;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_String_b4f8725b715aae24 = function(arg0, arg1) {
      const ret = String(getObject(arg1));
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_call_13410aac570ffff7 = function() {
      return handleError(function(arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
      }, arguments);
    };
    imports.wbg.__wbg_call_a5400b25a865cfd8 = function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
      }, arguments);
    };
    imports.wbg.__wbg_constructor_456e33b87cad7109 = function(arg0) {
      const ret = getObject(arg0).constructor;
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_error_8ef7f1ed2aba799d = function(arg0, arg1) {
      console.error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_forEach_d77328dbdd4919da = function(arg0, arg1, arg2) {
      try {
        var state0 = { a: arg1, b: arg2 };
        var cb0 = (arg02, arg12, arg22) => {
          const a = state0.a;
          state0.a = 0;
          try {
            return __wbg_adapter_79(a, state0.b, arg02, arg12, arg22);
          } finally {
            state0.a = a;
          }
        };
        getObject(arg0).forEach(cb0);
      } finally {
        state0.a = state0.b = 0;
      }
    };
    imports.wbg.__wbg_getElementById_33a990830a38ab2d = function(arg0, arg1, arg2) {
      const ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_message_125a1b2998b3552a = function(arg0) {
      const ret = getObject(arg0).message;
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_name_b28cbdf62904dda7 = function(arg0, arg1) {
      const ret = getObject(arg1).name;
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_name_f733db82b3c2804d = function(arg0) {
      const ret = getObject(arg0).name;
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_2e3c58a15f39f5f9 = function(arg0, arg1) {
      try {
        var state0 = { a: arg0, b: arg1 };
        var cb0 = (arg02, arg12) => {
          const a = state0.a;
          state0.a = 0;
          try {
            return __wbg_adapter_92(a, state0.b, arg02, arg12);
          } finally {
            state0.a = a;
          }
        };
        const ret = new Promise(cb0);
        return addHeapObject(ret);
      } finally {
        state0.a = state0.b = 0;
      }
    };
    imports.wbg.__wbg_new_f346c2f0d1ef8376 = function() {
      const ret = new Error();
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_newnoargs_254190557c45b4ec = function(arg0, arg1) {
      const ret = new Function(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_now_2c95c9de01293173 = function(arg0) {
      const ret = getObject(arg0).now();
      return ret;
    };
    imports.wbg.__wbg_now_868580d351eb4ac2 = function(arg0) {
      const ret = getObject(arg0).now();
      return ret;
    };
    imports.wbg.__wbg_performance_7a3ffd0b17f663ad = function(arg0) {
      const ret = getObject(arg0).performance;
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_performance_93b1a2c39c5ce9c1 = function(arg0) {
      const ret = getObject(arg0).performance;
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_queueMicrotask_25d0739ac89e8c88 = function(arg0) {
      queueMicrotask(getObject(arg0));
    };
    imports.wbg.__wbg_queueMicrotask_4488407636f5bf24 = function(arg0) {
      const ret = getObject(arg0).queueMicrotask;
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_resolve_4055c623acdd6a1b = function(arg0) {
      const ret = Promise.resolve(getObject(arg0));
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_d83b49baeada710f = function(arg0) {
      const ret = getObject(arg0).self;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_settextcontent_6e73aa257d5e6d4d = function(arg0, arg1, arg2) {
      getObject(arg0).textContent = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_stack_2af10fb5cf0c119f = function(arg0, arg1) {
      const ret = getObject(arg1).stack;
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_stack_33e69945705942f4 = function(arg0) {
      const ret = getObject(arg0).stack;
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_474a063205d9dfeb = function(arg0, arg1) {
      const ret = getObject(arg1).stack;
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_stack_be0985d09424061c = function(arg0) {
      const ret = getObject(arg0).stack;
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_static_accessor_DOCUMENT_821c83cd07f3dc8d = function() {
      const ret = document;
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_8921f820c2ce3f12 = function() {
      const ret = typeof global === "undefined" ? null : global;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_f0a4409105898184 = function() {
      const ret = typeof globalThis === "undefined" ? null : globalThis;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_995b214ae681ff99 = function() {
      const ret = typeof self === "undefined" ? null : self;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_cde3890479c675ea = function() {
      const ret = typeof window === "undefined" ? null : window;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_textcontent_e133176d41f840cf = function(arg0, arg1) {
      const ret = getObject(arg1).textContent;
      const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_then_e22500defe16819f = function(arg0, arg1) {
      const ret = getObject(arg0).then(getObject(arg1));
      return addHeapObject(ret);
    };
    imports.wbg.__wbg_wbgtestinvoke_88eb7304355c09b4 = function() {
      return handleError(function(arg0, arg1) {
        try {
          var state0 = { a: arg0, b: arg1 };
          var cb0 = () => {
            const a = state0.a;
            state0.a = 0;
            try {
              return __wbg_adapter_45(a, state0.b);
            } finally {
              state0.a = a;
            }
          };
          __wbg_test_invoke(cb0);
        } finally {
          state0.a = state0.b = 0;
        }
      }, arguments);
    };
    imports.wbg.__wbg_wbgtestogconsolelog_4d1cdc9d63ecdae7 = function(arg0, arg1) {
      __wbgtest_og_console_log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_wbgtestoutputwriteln_39a8f037e5740d8d = function(arg0) {
      __wbg_test_output_writeln(takeObject(arg0));
    };
    imports.wbg.__wbg_wbindgencbdrop_eb10308566512b88 = function(arg0) {
      const obj = getObject(arg0).original;
      if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
      }
      const ret = false;
      return ret;
    };
    imports.wbg.__wbg_wbindgencopytotypedarray_d105febdb9374ca3 = function(arg0, arg1, arg2) {
      new Uint8Array(getObject(arg2).buffer, getObject(arg2).byteOffset, getObject(arg2).byteLength).set(getArrayU8FromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_wbindgenisfunction_8cee7dce3725ae74 = function(arg0) {
      const ret = typeof getObject(arg0) === "function";
      return ret;
    };
    imports.wbg.__wbg_wbindgenisundefined_c4b71d073b92f3c5 = function(arg0) {
      const ret = getObject(arg0) === void 0;
      return ret;
    };
    imports.wbg.__wbg_wbindgenstringget_0f16a6ddddef376f = function(arg0, arg1) {
      const obj = getObject(arg1);
      const ret = typeof obj === "string" ? obj : void 0;
      var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
      var len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_wbindgenthrow_451ec1a8469d7eb6 = function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(arg0, arg1) {
      const ret = getStringFromWasm0(arg0, arg1);
      return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cast_bc081fd80c1dc3a3 = function(arg0, arg1) {
      const ret = makeMutClosure(arg0, arg1, 46, __wbg_adapter_8);
      return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cast_d6cd19b81560fd6e = function(arg0) {
      const ret = arg0;
      return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
      const ret = getObject(arg0);
      return addHeapObject(ret);
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
    if (typeof module_or_path !== "undefined") {
      if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
        ({ module_or_path } = module_or_path);
      } else {
        console.warn("using deprecated parameters for the initialization function; pass a single object instead");
      }
    }
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
      lookUp[index] = Math.cos(angle);
      lookUp[index + 1] = Math.sin(angle);
    }
    return lookUp;
  }
  var BUFFERED_BLOCK_SIZE = 8192;
  var WEBAUDIO_BLOCK_SIZE = 128;
  var processSize = 2048;
  var frequency = new Float32Array([50, 200, 1e3, 5e3, 1e4]);
  var multiplier = new Float32Array([1, 1, 1, 1, 1]);
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
      if (data.hasOwnProperty("data")) {
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
      } else if (data.hasOwnProperty("changed")) {
        this.processCounter = 0;
        this.timeCursor = 0;
        this.freqIncr = (data.hasOwnProperty("sampleRate") ? data.sampleRate : 24e3) / BUFFERED_BLOCK_SIZE;
        this.reallocateChannelsIfNeeded([[]], [[]]);
      } else if (data.hasOwnProperty("eqchange")) {
        const index = data.index;
        multiplier[index] = data.value;
      }
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
      this.freqIncr = 24e3 / BUFFERED_BLOCK_SIZE;
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
            const out = process_ola_simd(
              input,
              this.hannWindow,
              pitchFactor,
              this.timeCursor,
              this.freqIncr,
              frequency,
              multiplier,
              this.fftSize
            );
            output.set(out);
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

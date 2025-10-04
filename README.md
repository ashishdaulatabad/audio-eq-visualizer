# Audio Eq Visualizer

Audio Eq Visualizer, with Phase Vocoder Processing in Rust WASM.

> Note: Before running, check on how to build Rust code [here.](/wasm-fft/README.md)

To install dependencies:

```bash
npm i
```

To run:

```bash
npm run watch
```

> Note: For some reason, wasm-bindgen adds a code for `TextEncoder` or `TextDecoder`, which cannot be used in AudioWorkletNode. Removing `cachedTextEncoder` or `cachedTextDecoder` from `/wasm-fft/pkg/wasm_fft.js` is enough now to run successfully.

# Credits
[phaze](https://github.com/olvb/phaze/) - Phase Vocoder by [olvb](https://github.com/olvb/) Under License [unlicense](https://unlicense.org/)

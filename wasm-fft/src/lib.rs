mod fft;
mod phase_vocoder_utils;

use wasm_bindgen::{prelude::*, Clamped};

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn logw(number: usize);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn logsw(s: &str, number: usize);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn logc(c: Clamped<Vec<u8>>);
    fn alert(s: &str);
}

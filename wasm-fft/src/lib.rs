mod eq;
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
    fn logw4(_: usize, _: usize, _: usize, _: usize);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn logsw(s: &str, number: usize);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn logc(c: Clamped<Vec<u8>>);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn logarr(c: &[f32]);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_float(f: f32);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_floats(f: f32, s: f32, t: f32, ff: f32);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn logarr_usize(c: &[usize]);
    fn alert(s: &str);
}

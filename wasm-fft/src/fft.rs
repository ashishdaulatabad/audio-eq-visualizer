use wasm_bindgen::prelude::*;
use wasm_fft::{fft, ifft};

/// Create a lookup table for faster FFT computation
#[wasm_bindgen]
pub fn generate_lookup(length: usize) -> Vec<f32> {
    let length_f32 = length as f32;
    (0..length)
        .map(|c| c as f32)
        .map(|c| c * std::f32::consts::PI * 2.0 / length_f32)
        .collect::<Vec<f32>>()
}

/// Perform Fast Fourier Transform
/// on `n` values of Vec, and returns the floating values
///
/// Uses Divide-and-Conquer method, and non-recursive method
#[wasm_bindgen]
#[inline(always)]
pub fn fast_fft(array: &[f32], lookup_table: &[f32]) -> Vec<f32> {
    fft(array, lookup_table)
}

/// Perform Fast Fourier Transform
/// on `n` values of Vec, and returns the floating values
///
/// Uses Divide-and-Conquer method, and non-recursive method
#[wasm_bindgen]
#[inline(always)]
pub fn fast_ifft(c_array: &[f32], lookup_table: &[f32]) -> Vec<f32> {
    ifft(c_array, lookup_table)
}

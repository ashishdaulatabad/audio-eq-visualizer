use wasm_bindgen::prelude::*;
use wasm_fft::fft_simd::CArray;

/// Handles EQ of current complex array based on band user input
#[wasm_bindgen]
pub fn eq_handler(
    complex_array: &mut [f32],
    frequency_increment: f32,
    bands: &[f32],
    multiplier: &[f32],
) {
    let band_indexes: Vec<usize> = bands
        .iter()
        .map(|band| (band / frequency_increment).floor() as usize)
        .collect();

    band_indexes
        .iter()
        .enumerate()
        .for_each(|(index, band_index)| {
            let actual_index = *band_index << 1;
            let max_width = if index + 1 == band_indexes.len() {
                (complex_array.len() >> 1) - 1 - band_index
            } else {
                (band_indexes[index + 1] - band_index) >> 1
            };

            let actual_max_width = max_width << 1;
            complex_array[actual_index..actual_index + actual_max_width]
                .chunks_mut(2)
                .for_each(|c| {
                    c[0] *= multiplier[index];
                    c[1] *= multiplier[index];
                });

            let max_width = if index == 0 {
                *band_index - 1
            } else {
                (*band_index - band_indexes[index - 1]) >> 1
            };

            let actual_max_width = max_width << 1;
            complex_array[actual_index - actual_max_width..actual_index]
                .chunks_mut(2)
                .for_each(|c| {
                    c[0] *= multiplier[index];
                    c[1] *= multiplier[index];
                });
        })
}

pub fn eq_handler_simd(
    complex_array: &mut CArray,
    frequency_increment: f32,
    bands: &[f32],
    multiplier: &[f32],
) {
    let band_indexes: Vec<usize> = bands
        .iter()
        .map(|band| (band / frequency_increment).floor() as usize)
        .collect();

    band_indexes
        .iter()
        .enumerate()
        .for_each(|(index, band_index)| {
            let max_end_width = if index + 1 == band_indexes.len() {
                (complex_array.r.len()) - 1 - band_index
            } else {
                (band_indexes[index + 1] - band_index) >> 1
            };
            let max_start_width = if index == 0 {
                *band_index - 1
            } else {
                (*band_index - band_indexes[index - 1]) >> 1
            };

            let multiplier_vec =
                unsafe { core::arch::wasm32::f32x4_splat(multiplier[index]) };

            complex_array.r
                [*band_index - max_start_width..*band_index + max_end_width]
                .chunks_exact_mut(4)
                .zip(
                    complex_array.i[*band_index - max_start_width
                        ..*band_index + max_end_width]
                        .chunks_exact_mut(4),
                )
                .for_each(|(r, i)| unsafe {
                    let mut lr = core::arch::wasm32::v128_load(
                        r.as_mut_ptr() as *mut core::arch::wasm32::v128
                    );
                    let mut li = core::arch::wasm32::v128_load(
                        i.as_mut_ptr() as *mut core::arch::wasm32::v128
                    );
                    lr = core::arch::wasm32::f32x4_mul(lr, multiplier_vec);
                    li = core::arch::wasm32::f32x4_mul(li, multiplier_vec);
                    core::arch::wasm32::v128_store(
                        r.as_mut_ptr() as *mut core::arch::wasm32::v128,
                        lr,
                    );
                    core::arch::wasm32::v128_store(
                        i.as_mut_ptr() as *mut core::arch::wasm32::v128,
                        li,
                    );
                });

            let remr = complex_array.r
                [*band_index - max_start_width..*band_index + max_end_width]
                .chunks_exact_mut(4)
                .into_remainder();
            let remi = complex_array.i
                [*band_index - max_start_width..*band_index + max_end_width]
                .chunks_exact_mut(4)
                .into_remainder();

            remr.iter_mut().zip(remi.iter_mut()).for_each(|(r, i)| {
                *r *= multiplier[index];
                *i *= multiplier[index];
            });
        })
}

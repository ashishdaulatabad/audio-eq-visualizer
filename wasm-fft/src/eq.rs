use wasm_bindgen::prelude::*;
use web_sys::js_sys::Math::log;

use crate::{logarr, logarr_usize, logw, logw4};

/// Handles EQ of current complex array based on band user input
///
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

    // logarr(bands);

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

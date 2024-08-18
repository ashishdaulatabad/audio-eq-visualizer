use crate::index_generator::IndexGen;
use wasm_bindgen::prelude::*;
use web_sys::AudioWorkletProcessor;

/// Perform Fast Fourier Transform
/// on `n` values of Vec, and returns the floating values
///
/// Uses Divide-and-Conquer method, and non-recursive method
#[wasm_bindgen]
pub fn fast_fft(array: &[f32], lookup_table: &[f32], out: &mut [f32]) {
    let index_iter: IndexGen = IndexGen::new(array.len());
    out.chunks_mut(2)
        .zip(index_iter.map(|x| array[x]))
        .for_each(|(x, element)| {
            x[0] = element;
        });

    out.chunks_mut(4).for_each(|out_slice| {
        let c1r = out_slice[0];
        let c1i = out_slice[1];
        let c2r = out_slice[2];
        let c2i = out_slice[3];

        out_slice[0] = c1r + c2r;
        out_slice[1] = c1i + c2i;
        out_slice[2] = c1r - c2r;
        out_slice[3] = c1i - c2i;
    });

    let (mut block_size, length, mut length_check_lookup) = (4, array.len(), array.len() >> 2);
    while block_size < length {
        let lookup_incr = length_check_lookup << 1;
        let block_jump = block_size << 1;

        out.chunks_mut(block_jump).for_each(|out_chunk| {
            let (mut wr, mut wi) = (0.0, 0.0);
            let mut lookup_index = 0;

            for index in (0..block_size).step_by(2) {
                let (c1r, c1i) = (out_chunk[index], out_chunk[index + 1]);
                let (mut c2r, mut c2i) = (
                    out_chunk[index + block_size],
                    out_chunk[index + block_size + 1],
                );
                let temp = c2r * wr - c2i * wi;
                c2i = c2r * wi + c2i * wr;
                c2r = temp;

                out_chunk[index] = c1r + c2r;
                out_chunk[index + 1] = c1i + c2i;
                out_chunk[index + block_size] = c1r - c2r;
                out_chunk[index + block_size + 1] = c1i - c2i;

                lookup_index += lookup_incr;
                wr = lookup_table[lookup_index];
                wi = lookup_table[lookup_index + 1];
            }
        });

        block_size <<= 1;
        length_check_lookup >>= 1;
    }
}

/// Perform Fast Fourier Transform
/// on `n` values of Vec, and returns the floating values
///
/// Uses Divide-and-Conquer method, and non-recursive method
#[wasm_bindgen]
pub fn fast_ifft(c_array: &[f32], lookup_table: &[f32], result: &mut [f32]) {
    let index_iter: IndexGen = IndexGen::new(c_array.len() >> 1);

    let mut out = Vec::new();
    out.resize_with(c_array.len(), || 0.0);

    out.chunks_mut(2)
        .zip(index_iter.map(|x| c_array[x << 1]))
        .for_each(|(x, element)| {
            x[0] = element;
        });

    out.chunks_mut(4).for_each(|out_slice| {
        let c1r = out_slice[0];
        let c1i = out_slice[1];
        let c2r = out_slice[2];
        let c2i = out_slice[3];

        out_slice[0] = c1r + c2r;
        out_slice[1] = c1i + c2i;
        out_slice[2] = c1r - c2r;
        out_slice[3] = c1i - c2i;
    });

    let (mut block_size, length, mut length_check_lookup) =
        (4, c_array.len() >> 1, c_array.len() >> 3);
    while block_size < length {
        let lookup_incr = length_check_lookup << 1;
        let block_jump = block_size << 1;

        out.chunks_mut(block_jump).for_each(|out_chunk| {
            let (mut wr, mut wi) = (0.0, 0.0);
            let mut lookup_index = 0;

            for index in (0..block_size).step_by(2) {
                let (c1r, c1i) = (out_chunk[index], out_chunk[index + 1]);
                let (mut c2r, mut c2i) = (
                    out_chunk[index + block_size],
                    out_chunk[index + block_size + 1],
                );
                let temp = c2r * wr - c2i * wi;
                c2i = c2r * wi + c2i * wr;
                c2r = temp;

                out_chunk[index] = c1r + c2r;
                out_chunk[index + 1] = c1i + c2i;
                out_chunk[index + block_size] = c1r - c2r;
                out_chunk[index + block_size + 1] = c1i - c2i;

                lookup_index += lookup_incr;
                wr = lookup_table[lookup_index];
                wi = -lookup_table[lookup_index + 1];
            }
        });

        block_size <<= 1;
        length_check_lookup >>= 1;
    }

    let length = c_array.len() >> 1;
    out.chunks(2).zip(result.iter_mut()).for_each(|(c, res)| {
        *res = c[0] / (length >> 1) as f32;
    })
}

fn new() -> Result<(), JsValue> {
    let p = AudioWorkletProcessor::new()?;
    // p.
    Ok(())
}

use wasm_bindgen::prelude::*;

/// Find all the peaks performed during FFT of
/// `complex_array`
fn find_peaks(complex_array: &[f32]) -> Vec<isize> {
    let magnitudes = complex_array.chunks(2)
        .map(|c| c[0] * c[0] + c[1] * c[1])
        .collect::<Vec<f32>>();

    magnitudes
        .windows(5)
        .enumerate()
        .filter(|(_, window)| {
            window[2] > window[1] && window[2] > window[0] &&
                window[2] > window[3] && window[2] > window[4]
        })
        .map(|(index, _)| index as isize + 2)
        .collect()
}

/// Apply hann window
fn apply_hann_window(audio_content: &mut [f32], hann_buffer: &[f32]) {
    audio_content.iter_mut()
        .zip(hann_buffer.iter())
        .for_each(|(ac, hb)| {
            *ac *= *hb;
        })
}

#[wasm_bindgen]
pub fn process_ola(
    channel: &mut [f32],
    hann_buffer: &[f32],
    lookup_table: &[f32],
    pitch_factor: f32,
    time_cursor: f32
) -> Vec<f32> {
    apply_hann_window(channel, hann_buffer);
    
    let fft_complex_buffer = wasm_fft::fft(channel, lookup_table);

    let peaks = find_peaks(&fft_complex_buffer);
    let len = peaks.len();            
    
    let shifted_fft_complex = shift_peaks(
        channel.len(),
        &fft_complex_buffer,
        peaks,
        (channel.len() >> 1) as isize,
        len as isize,
        pitch_factor,
        time_cursor
    );

    let mut output = wasm_fft::ifft(&shifted_fft_complex, lookup_table);
    apply_hann_window(&mut output, hann_buffer);
    output
}

/// Function to take all the absolute peak values from indexes in `peak_indexes`
/// and shift based on `pitch_factor`
#[wasm_bindgen]
pub fn shift_peaks(
    fft_size: usize,
    frequency_complex_buffer: &[f32],
    peak_indexes: Vec<isize>,
    magnitude_length: isize,
    total_peaks: isize,
    pitch_factor: f32,
    time_cursor: f32,
) -> Vec<f32> {
    let mut frequency_shifted_complex: Vec<f32> = Vec::new();
    frequency_shifted_complex.resize_with(fft_size << 1, || 0.0);

    let shifted_peak =
        |peak: isize| (peak as f32 * pitch_factor).round() as isize;

    (0..total_peaks)
        .map(|index| {
            (
                index,
                peak_indexes[index as usize],
                shifted_peak(peak_indexes[index as usize]),
            )
        })
        .skip_while(|(_, _, shift_peak)| *shift_peak < 0)
        .take_while(|(_, _, shift_peak)| *shift_peak < magnitude_length)
        .for_each(|(index, curr_peak, shift_peak)| {
            let start = if index > 0 {
                let peak_index_before = peak_indexes[(index - 1) as usize];
                curr_peak - ((curr_peak - peak_index_before) >> 1)
            } else {
                0_isize
            };
            let end = if index < total_peaks - 1 {
                let peak_index_after = peak_indexes[(index + 1) as usize];
                let mid = peak_index_after - curr_peak + 1;
                curr_peak + (mid >> 1)
            } else {
                fft_size as isize
            };

            let (start_offset, end_offset) =
                (start - curr_peak, end - curr_peak);

            (start_offset..end_offset)
                .map(|offset_index| {
                    (curr_peak + offset_index, shift_peak + offset_index)
                })
                .skip_while(|(_, shifted_index)| *shifted_index < 0)
                .take_while(|(_, shifted_index)| {
                    *shifted_index < magnitude_length
                })
                .for_each(|(bin_index, bin_index_shifted)| {
                    let angle_delta = (2.0
                        * std::f32::consts::PI
                        * ((bin_index_shifted - bin_index) as f32))
                        / (fft_size as f32);

                    let (phase_real, phase_img) = (
                        (angle_delta * time_cursor).cos(),
                        (angle_delta * time_cursor).sin(),
                    );

                    let (value_real, value_img) = (
                        frequency_complex_buffer[(bin_index << 1) as usize],
                        frequency_complex_buffer[(bin_index << 1) as usize + 1],
                    );

                    let shifted = (bin_index_shifted << 1) as usize;
                    (
                        frequency_shifted_complex[shifted],
                        frequency_shifted_complex[shifted + 1],
                    ) = (
                        value_real * phase_real - value_img * phase_img,
                        value_real * phase_img + value_img * phase_real,
                    );
                });
        });

    frequency_shifted_complex
}

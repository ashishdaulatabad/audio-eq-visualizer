use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn logw(number: usize);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn logw2(number: usize, number2: usize);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn logw2i(number: isize, number2: isize);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn logsw(s: &str, number: usize);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn alert(s: &str);
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

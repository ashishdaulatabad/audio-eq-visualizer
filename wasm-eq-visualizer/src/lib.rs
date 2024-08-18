mod fft;
mod index_generator;
mod utils;

use wasm_bindgen::{prelude::*, Clamped};
use web_sys::ImageData;

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

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
#[inline(always)]
pub fn bind(drift: i32) -> usize {
    if drift < 0 {
        (drift.abs() as usize).wrapping_neg()
    } else {
        drift as usize
    }
}

#[wasm_bindgen]
pub fn apply_particle_transformation_for_canvas_2d(
    image_data: &web_sys::ImageData,
    width_u: usize,
    height_u: usize,
    rx_drift_i: i32,
    ry_drift_i: i32,
    gx_drift_i: i32,
    gy_drift_i: i32,
    bx_drift_i: i32,
    by_drift_i: i32,
    mid_context: &web_sys::OffscreenCanvasRenderingContext2d,
    mid_canvas: &web_sys::OffscreenCanvas,
    out_context: &web_sys::OffscreenCanvasRenderingContext2d,
) -> Result<(), JsValue> {
    let (width, height) = (width_u as f64, height_u as f64);
    let mut clamped_data = image_data.data();
    let (rx_drift, ry_drift, gx_drift, gy_drift, bx_drift, by_drift) = (
        bind(rx_drift_i),
        bind(ry_drift_i),
        bind(gx_drift_i),
        bind(gy_drift_i),
        bind(bx_drift_i),
        bind(by_drift_i),
    );

    out_context.set_global_composite_operation("screen")?;
    out_context.clear_rect(0.0, 0.0, width, height);
    let length = width_u * height_u;

    let init = |rdrift: usize| {
        if rdrift < length {
            (length - 1, usize::MAX)
        } else {
            (0, 1)
        }
    };

    let get_index = |index: usize, col_drift: i32| {
        if col_drift > 0 {
            width_u - 1 - index
        } else {
            index
        }
    };

    let (mut r_index, r_stride) = init(ry_drift);
    let (mut g_index, g_stride) = init(gy_drift);
    let (mut b_index, b_stride) = init(by_drift);

    (0..length).for_each(|_| {
        let (rrow, rcol) = (r_index / width_u, r_index % width_u);
        let (rdrow, rdcol) = (rrow.wrapping_sub(ry_drift), rcol.wrapping_sub(rx_drift));
        if rdrow < height_u && rdcol < width_u {
            clamped_data[(rrow * width_u + get_index(rcol, rx_drift_i)) << 2] =
                clamped_data[(rdrow * width_u + get_index(rdcol, rx_drift_i)) << 2];
        } else {
            clamped_data[(rrow * width_u + get_index(rcol, rx_drift_i)) << 2] = 0;
        }

        let (grow, gcol) = (g_index / width_u, g_index % width_u);
        let (gdrow, gdcol) = (grow.wrapping_sub(gy_drift), gcol.wrapping_sub(gx_drift));
        if gdrow < height_u && gdcol < width_u {
            clamped_data[((grow * width_u + get_index(gcol, gx_drift_i)) << 2) + 1] =
                clamped_data[((gdrow * width_u + get_index(gdcol, gx_drift_i)) << 2) + 1];
        } else {
            clamped_data[((grow * width_u + get_index(gcol, gx_drift_i)) << 2) + 1] = 0;
        }

        let (brow, bcol) = (b_index / width_u, b_index % width_u);
        let (bdrow, bdcol) = (brow.wrapping_sub(by_drift), bcol.wrapping_sub(bx_drift));
        if bdrow < height_u && bdcol < width_u {
            clamped_data[((brow * width_u + get_index(bcol, bx_drift_i)) << 2) + 2] =
                clamped_data[((bdrow * width_u + get_index(bdcol, bx_drift_i)) << 2) + 2];
        } else {
            clamped_data[((brow * width_u + get_index(bcol, bx_drift_i)) << 2) + 2] = 0;
        }
        r_index = r_index.wrapping_add(r_stride);
        g_index = g_index.wrapping_add(g_stride);
        b_index = b_index.wrapping_add(b_stride);
    });

    let new_image = ImageData::new_with_u8_clamped_array(Clamped(&clamped_data.0), width as u32)?;

    mid_context.put_image_data(&new_image, 0.0, 0.0)?;
    out_context.draw_image_with_offscreen_canvas(&mid_canvas, 0.0, 0.0)?;

    Ok(())
}

#[wasm_bindgen]
pub fn create_new_canvas_for_chrome_transformation(
    image_data: &web_sys::ImageData,
    width: f64,
    height: f64,
    rx_drift: f64,
    ry_drift: f64,
    gx_drift: f64,
    gy_drift: f64,
    bx_drift: f64,
    by_drift: f64,
    mid_context: &web_sys::OffscreenCanvasRenderingContext2d,
    mid_canvas: &web_sys::OffscreenCanvas,
    out_context: &web_sys::OffscreenCanvasRenderingContext2d,
    rchannel: &web_sys::ImageData,
    gchannel: &web_sys::ImageData,
    bchannel: &web_sys::ImageData,
) -> Result<(), JsValue> {
    let idata = image_data.data();
    let mut rdata = rchannel.data();
    let mut gdata = gchannel.data();
    let mut bdata = bchannel.data();

    out_context.set_global_composite_operation("screen")?;
    out_context.clear_rect(0.0, 0.0, width, height);

    for index in (0..idata.len()).step_by(4) {
        rdata[index] = idata[index];
        gdata[index + 1] = idata[index + 1];
        bdata[index + 2] = idata[index + 2];
        rdata[index + 3] = idata[index + 3];
        gdata[index + 3] = idata[index + 3];
        bdata[index + 3] = idata[index + 3];
    }

    let rimg = ImageData::new_with_u8_clamped_array(Clamped(&rdata.0), width as u32)?;
    // options.channelData.context.clearRect(0, 0, options.width, options.height);
    mid_context.put_image_data(&rimg, rx_drift, ry_drift)?;
    out_context.draw_image_with_offscreen_canvas(mid_canvas, 0.0, 0.0)?;

    let bimg = ImageData::new_with_u8_clamped_array(Clamped(&bdata.0), width as u32)?;
    // options.channelData.context.clearRect(0, 0, options.width, options.height);
    mid_context.put_image_data(&bimg, bx_drift, by_drift)?;
    out_context.draw_image_with_offscreen_canvas(mid_canvas, 0.0, 0.0)?;

    let gimg = ImageData::new_with_u8_clamped_array(Clamped(&gdata.0), width as u32)?;
    mid_context.put_image_data(&gimg, gx_drift, gy_drift)?;
    out_context.draw_image_with_offscreen_canvas(mid_canvas, 0.0, 0.0)?;

    Ok(())
}

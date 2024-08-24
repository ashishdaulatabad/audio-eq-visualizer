import { el } from "./common/domhelper";
import { Subscriber } from "./common/subscriber";
import { GlobalAudioService } from './service/global.service';
import { PaletteView } from "./view/palette.view";
import { PanelView } from "./view/panel.view";
import { WindowView } from "./view/window.view";

// On page load or when changing themes, best to add inline in `head` to avoid FOUC
function theme() {
    if (
        localStorage.theme === 'dark' || (
            !('theme' in localStorage) &&
            window.matchMedia &&
            window?.matchMedia('(prefers-color-scheme: dark)').matches
        )
    ) {
        document.documentElement.classList.add('dark')
        localStorage.theme = 'dark'
    }
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
}

window.onload = async () => {
    theme();
    const wasmFile = await fetch('./wasm_fft_bg.wasm');
    const wasmBin = await wasmFile.arrayBuffer();
    console.log('wasmBin', wasmBin);

    var subscriber = new Subscriber();
    subscriber.createSubscription('onbodyload');

    var globalAudioService = new GlobalAudioService(subscriber, wasmBin);

    let palette = new PaletteView(subscriber);
    let window2 = new WindowView(globalAudioService, subscriber);
    let panelView = new PanelView(subscriber);
    panelView.attachViews(window2.getAllAttachableViews());
    panelView.attachViews(palette.getAllAttachableViews());

    const dropHandler = (event: DragEvent) => {
        event.preventDefault();

        if (event.dataTransfer?.files) {
            const file = event.dataTransfer.files[0];
            globalAudioService.setAudioBuffer(file);
        }
    };
    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
    };

    const setResize = (evt: Event) => {
        window2.setResize();
    }

    const content = el('div')
        .mcls('main-content')
        .inner([window2.getView(), panelView.getView()])
        .evt('drop', dropHandler)
        .evt('dragover', onDragOver)
        .get();

    const player = (evt: KeyboardEvent) => {
        switch (evt.code) {
            case 'Space':
                evt.preventDefault();
                evt.stopPropagation();
                window2.onPlayerPausedOrResumed();
                break;
        }
    }

    window.addEventListener('resize',  (evt) => setResize(evt));

    el(document.body)
        .mcls('w-avail', 'h-avail')
        .evt('keydown', player)
        .evt('dragover', onDragOver)
        .evt('drop', dropHandler)
        .evt('resize', setResize)
        .inner([
            el('div')
                .mcls('application', 'flex', 'flex-col')
                .inners(content)
                .get()
        ]);

    subscriber.fire<void>('onbodyload');
}

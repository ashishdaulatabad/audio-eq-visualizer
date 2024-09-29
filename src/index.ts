import { el } from "./common/domhelper";
import { Subscriber } from "./common/subscriber";
import { GlobalAudioService } from './service/global.service';
import { CanvasThemeSelectorView } from "./view/palette.view";
import { PanelView } from "./view/panel.view";
import { WindowView } from "./view/window.view";

import { inject } from "@vercel/analytics";

inject();

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

    var subscriber = new Subscriber();
    subscriber.createSubscription('onbodyload');

    var globalAudioService = new GlobalAudioService(subscriber, wasmBin);

    let canvasThemeSelector = new CanvasThemeSelectorView(subscriber);
    let window2 = new WindowView(globalAudioService, subscriber);
    let panelView = new PanelView(subscriber);
    panelView.attachViews(window2.getAllAttachableViews());
    panelView.attachViews(canvasThemeSelector.getAllAttachableViews());

    const dropHandler = (event: DragEvent) => {
        event.preventDefault();

        if (event.dataTransfer?.files) {
            const file = event.dataTransfer.files[0];
            window2.setSourceFile(file);
        }
    };
    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
    };

    const setResize = (_: Event) => {
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

    const keyUp = (evt: KeyboardEvent) => {
        switch (evt.code) {
            case 'ControlLeft':
                el(panelView.getView()).tcls('hidden');
                break;
        }
    }

    window.addEventListener('resize',  (evt) => setResize(evt));

    el(document.body)
        .mcls('w-avail', 'h-avail')
        .evt('keydown', player)
        .evt('keyup', keyUp)
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

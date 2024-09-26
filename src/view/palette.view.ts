import { el } from "../common/domhelper";
import { Subscriber } from "../common/subscriber";

export class CanvasThemeSelectorView {
    mainDOM: HTMLElement;
    paletteElement: HTMLElement;
    paletteArray: Array<[string, string]> = [
        ['#0a0c0d', '#d8dceb'],
        ['#0f4d19', '#6fc27c'],
        ['#143d59', '#c4f41a'],
        ['#2F3C7E', '#FBEAEB'],
        ['#990011', '#FCF6F5'],
        ['#AD4F21', '#FCF6E5'],
        ['#50586C', '#DCE2F0'],
        ['#262223', '#DDC6B6'],
        ['#02343F', '#F0EDCC'],
        ['#00203F', '#ADEFD1'],
        ['#D1E9F6', '#524986'],
        ['#262150', '#dfd3f3'],
        ['#f3bbc5', '#1a1b1b'],
        ['#292426', '#b5dde0'],
        ['#eefa9f', '#2b3649']
    ];

    constructor(private subscriber: Subscriber) {
        [this.mainDOM, this.paletteElement] = this.constructPalette();
        this.subscriber.createSubscription('palette');
    }

    getAllAttachableViews(): HTMLElement[] {
        return [this.mainDOM];
    }

    sendData(evt: MouseEvent) {
        let target = evt.target as HTMLElement;
        if (target.tagName.toLocaleLowerCase() === 'span') {
            target = target.parentElement as HTMLElement;
        }

        const data = [target.getAttribute('data-back-color') as string, target.getAttribute('data-fore-color') as string, false];
        this.subscriber.fire('palette', data);
    }

    constructPalette() {
        const styleDom = this.constructTitle()
        const paletteColors = this.constructPaletteColors();
        const mainDOM = el('div')
            .mcls('bg-gray-600/30', 'backdrop-blur-[2px]', 'min-w-36', 'top-10', 'right-10', 'rounded-[3px]', 'p-2', 'text-center')
            .mcls('max-h-72', 'overflow-hidden', 'flex', 'flex-col', 'shadow-md')
            .inners(styleDom, paletteColors)
            .get();

        const list = mainDOM.children[1] as HTMLElement;
        const button = styleDom.children[1] as HTMLElement;
        el(button).evt('click', (_) => {
            el(button).tcls('rotate-180');
            el(list).tcls('collapsed');
        });

        return [mainDOM, paletteColors];
    }

    constructPaletteDOM(rgb: [string, string]) {
        return el('div')
            .mcls('min-h-12', 'w-avail', 'h-8', 'rounded-sm', 'transition-all', 'duration-300', 'ease-in-out', 'hover:bg-gray-100/30', 'cursor-pointer')
            .inners(
                el('span')
                    .mcls('w-8', 'h-8', 'p-4', 'relative', 'top-2', 'inline-block')
                    .styleAttr({ backgroundColor: rgb[0] })
                    .get(),
                el('span')
                    .mcls('min-w-8', 'min-h-8', 'p-4', 'relative', 'top-2', 'inline-block')
                    .styleAttr({ backgroundColor: rgb[1] })
                    .get()
            )
            .attr('data-back-color', rgb[0])
            .attr('data-fore-color', rgb[1])
            .evt('click', this.sendData.bind(this))
            .get();
    }

    constructGradientPallete(evt: MouseEvent) {
        let target = evt.target as HTMLElement;
        if (target.tagName.toLocaleLowerCase() === 'span') {
            target = target.parentElement as HTMLElement;
        }

        const data = [target.getAttribute('data-back-color') as string, target.getAttribute('data-fore-color') as string, true];
        this.subscriber.fire('palette', data);
    }

    constructGradientPaletteDOM(rgb: [string, string]) {
        return el('div')
            .mcls('min-h-12', 'w-avail', 'h-8', 'rounded-sm', 'transition-all', 'duration-300', 'ease-in-out', 'hover:bg-gray-100/30', 'cursor-pointer')
            .inners(
                el('span')
                    .mcls('w-8', 'h-8', 'p-4', 'relative', 'top-2', 'inline-block')
                    .styleAttr({ backgroundColor: `linearGradient(${rgb[0]}, ${rgb[1]})` })
                    .get(),
                el('span')
                    .mcls('min-w-8', 'min-h-8', 'p-4', 'relative', 'top-2', 'inline-block')
                    .styleAttr({ backgroundColor: rgb[1] })
                    .get()
            )
            .attr('data-back-color', rgb[0])
            .attr('data-fore-color', rgb[1])
            .evt('click', this.constructGradientPallete.bind(this))
            .get();
    }

    constructPaletteColors() {
        const paletteElement = el('div')
            .mcls('flex', 'flex-col', 'w-full', 'h-full', 'scrollbar-thumb', 'overflow-y-scroll', 'overflow-x-hidden', 'mt-4')
            .inner(this.paletteArray.map(([f, s]) => [
                this.constructPaletteDOM([f, s]),
                this.constructPaletteDOM([s, f]),
            ]).flat())
            .get();

        return paletteElement;
    }

    constructTitle() {
        const title = el('span')
            .mcls('text-[18px]', 'font-serif', 'text-gray-100', 'block', 'items-center', 'flex')
            .inner([
                el('span').mcls('relative', 'top-[2px]', 'block', 'self-center', 'w-avail', 'font-bold').innerText('Color Theme'),
                el('button')
                    .mcls('min-h-8', 'min-w-8', 'rounded-[1rem]', 'bg-gray-700', 'text-gray-100', 'border-[0]', 'ml-4', 'self-end')
                    .mcls('transition-transform', 'duration-200', 'ease-in-out')
                    .innerHtml('\u25B2')
            ])
            .get();

        return title;
    }

    getView() {
        return this.mainDOM;
    }
}

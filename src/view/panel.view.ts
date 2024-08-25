import { el } from "../common/domhelper";
import { Subscriber } from "../common/subscriber";

export class PanelView {
    mainDOM: HTMLElement;

    constructor(
        private subscriber: Subscriber
    ) {
        this.mainDOM = this.constructPanelView();
    }

    constructPanelView() {
        return el('div')
            .mcls('fixed', 'bg-gray-600/30', 'backdrop-blur-[2px]', 'min-w-36', 'min-h-24', 'top-10', 'right-10', 'rounded-[1rem]', 'pr-0', 'text-center')
            .mcls('overflow-y-scroll', 'shadow-md', 'panel-height', 'scrollbar-thumb')
            .get();
    }

    attachViews(someDOMList: HTMLElement[]) {
        someDOMList.forEach(someDOM => this.mainDOM.appendChild(el(someDOM).mcls('m-2').get()));
    }

    getView(): HTMLElement {
        return this.mainDOM;
    }
}

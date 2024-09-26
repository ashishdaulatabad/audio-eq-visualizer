export type Dim = {
    width: number,
    height: number,
    resize: (width: number, height: number) => void,
}

export function withDocumentDim<Config>(
    config: Config, 
    callback?: (_: Config & Dim) => void
): Config & Dim {
    const newConfig: Config & Dim = {
        ...config, 
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        resize: (_: number, _h: number) => {},
    };

    newConfig.resize = function(this: Config & Dim, width: number, height: number) {
        this.width = width;
        this.height = height;
        // console.log(this, width, height);
        callback && callback(newConfig);
    }.bind(newConfig);

    return newConfig;
}

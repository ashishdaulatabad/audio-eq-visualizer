export type Dim = {
    width: number,
    height: number,
    resize: (width: number, height: number) => void,
}

export function withDocumentDim<Config extends Object>(config: Config, callback?: (_: Config) => void): Dim & Config {
    const newConfig: Config & Dim = {
        ...config, 
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        resize: (_: number, _h: number) => {},
    };

    newConfig.resize = function(width: number, height: number) {
        this.width = width;
        this.height = height;
        // console.log(this, width, height);
        callback && callback(newConfig);
    }.bind(newConfig);

    return newConfig;
}

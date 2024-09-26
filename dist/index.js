"use strict";
(() => {
  // src/common/domhelper.ts
  function el(tag) {
    const currentWorkingElement = typeof tag === "string" ? document.createElement(tag) : tag;
    return {
      /**
       * Add class
       * @returns Self for transformation
       */
      cls(cls) {
        currentWorkingElement.classList.add(cls);
        return this;
      },
      /**
       * Add multiple classes
       * @param classNames list of classes as arguments
       * @returns Self for transformation
       */
      macls(classNames) {
        currentWorkingElement.classList.add(...classNames);
        return this;
      },
      /**
       * Add multiple classes
       * @param classNames list of classes as arguments
       * @returns Self for transformation
       */
      mcls(...classNames) {
        currentWorkingElement.classList.add(...classNames);
        return this;
      },
      /**
       * Remove multiple classes
       * @param classNames list of classes as arguments
       * @returns Self for transformation
       */
      rcls(...classNames) {
        currentWorkingElement.classList.remove(...classNames);
        return this;
      },
      /**
       * Set id of the element
       * @returns Self for transformation
       */
      id(id) {
        currentWorkingElement.id = id;
        return this;
      },
      /**
       * Add attribute to the element
       * @returns Self for transformation
       */
      attr(attributeKey, attributeValue = "true") {
        currentWorkingElement.setAttribute(attributeKey, attributeValue);
        return this;
      },
      style(str) {
        currentWorkingElement.setAttribute("style", str);
        return this;
      },
      styleAttr(str) {
        for (const key in str) {
          currentWorkingElement.style[key] = str[key];
        }
        return this;
      },
      /**
       * Remove attached event to the element
       * @returns Self for transformation
       */
      evtrm(eventName, fn, options) {
        currentWorkingElement.removeEventListener(
          eventName,
          fn,
          options
        );
        return this;
      },
      /**
       * Attach event to the element
       * @returns Self for transformation
       */
      evt(eventName, fn, options) {
        currentWorkingElement.addEventListener(
          eventName,
          fn,
          options
        );
        return this;
      },
      /**
       * Bulk add attributes
       * @returns Self for transformation
       */
      attrs(attrs) {
        attrs.forEach(([attrKey, attrValue]) => {
          currentWorkingElement.setAttribute(attrKey, attrValue);
        });
        return this;
      },
      /**
       * Set innerText to node currently held
       * @returns Self for transformation
       */
      innerText(text) {
        currentWorkingElement.innerText = text;
        return this;
      },
      /**
       * Set innerHtml to node currently held
       * @returns Self for transformation
       */
      innerHtml(text) {
        currentWorkingElement.innerHTML = text;
        return this;
      },
      /**
       * Add childNodes to node that is held by current `el`
       * @returns Self for transformation
       */
      childNodes(elems) {
        elems.forEach((elem) => elem instanceof HTMLElement || elem instanceof Node || elem instanceof Text ? currentWorkingElement.append(elem) : currentWorkingElement.append(elem.get()));
        return this;
      },
      /**
       * Add children to node that is held by current `el`
       * @returns Self for transformation
       */
      inner(elems) {
        currentWorkingElement.append(
          ...elems.map((elem) => elem instanceof HTMLElement || elem instanceof Node ? elem : elem.get())
        );
        return this;
      },
      /**
       * Add children to node that is held by current `el`
       * @returns Self for transformation
       */
      inners(...elems) {
        currentWorkingElement.append(
          ...elems.map((elem) => elem instanceof HTMLElement || elem instanceof Node ? elem : elem.get())
        );
        return this;
      },
      extd(elems) {
        return this.inner(elems);
      },
      children(elems) {
        return this.inner(elems);
      },
      inputType(_) {
        currentWorkingElement.type = _;
        return this;
      },
      checkbox() {
        return this.inputType("checkbox");
      },
      text() {
        return this.inputType("text");
      },
      checked(set) {
        currentWorkingElement.checked = set;
        return this;
      },
      check() {
        return this.checked(true);
      },
      nocheck() {
        return this.checked(false);
      },
      readonly(set) {
        currentWorkingElement.readOnly = set;
        return this;
      },
      read() {
        return this.readonly(true);
      },
      noread() {
        return this.readonly(false);
      },
      spellcheck(set) {
        currentWorkingElement.spellcheck = set;
        return this;
      },
      /**
       * Add spellcheck
       * @returns Self for transformation
       */
      spellchk() {
        return this.spellcheck(true);
      },
      /**
       * Add no spellcheck
       * @returns Self for transformation
       */
      nospellchk() {
        return this.spellcheck(false);
      },
      /**
       * Set placeholder for Input Element
       * @returns Self for transformation
       */
      placeholder(set) {
        currentWorkingElement.placeholder = set;
        return this;
      },
      /**
       * Toggle class
       * @returns Self for transformation
       */
      tcls(cls) {
        currentWorkingElement.classList.toggle(cls);
        return this;
      },
      /**
       * Bulk add class
       * @returns Self for transformation
       */
      bcls(clsarr) {
        currentWorkingElement.classList.add(...clsarr);
        return this;
      },
      getnd() {
        return currentWorkingElement;
      },
      /**
       * Returns the value transformed by `el`
       * @returns Current node that holds by `el` as` HTMLElement`
       */
      getel() {
        return currentWorkingElement;
      },
      /**
       * Returns the value as specified `HTMLElement` transformed by `el`
       * @returns Current node that holds by `el`
       */
      get() {
        return currentWorkingElement;
      },
      /**
       * Append currently held element to `someParent` passed to the function
       * @returns Self for transformation
       */
      appendTo(someParent) {
        someParent.appendChild(currentWorkingElement);
        return this;
      },
      /**
       * Append some node to currently held Element
       * @returns Self for transformation
       */
      append(el2) {
        return this.appendChild(el2);
      },
      /**
       * Replace `someChild` passed to the function with currently held `Element` 
       * @returns Self for transformation
       */
      replaceWith(someChild) {
        if (someChild.parentNode) {
          someChild.parentNode.replaceChild(
            currentWorkingElement,
            someChild
          );
        }
        return this;
      },
      /**
       * Append node passed as parameter as a child to currently held `HTMLElement`
       * @returns Self for transformation
       */
      appendChild(el2) {
        currentWorkingElement.appendChild(el2);
        return this;
      },
      /**
       * Attach currently held node next to `someNode`, turning into 
       * `nextSibling` of `someSibling`.
       * @returns Self for transformation
       */
      nextTo(someSibling) {
        if (someSibling.parentNode) {
          if (someSibling.nextSibling) {
            someSibling.parentNode.insertBefore(
              currentWorkingElement,
              someSibling.nextSibling
            );
          } else {
            someSibling.parentNode.appendChild(
              currentWorkingElement
            );
          }
        }
        return this;
      },
      /**
       * Attach currently held node previous to `someNode`, turning into 
       * `previousSibling` of `someSibling`.
       * @returns Self for transformation
       */
      before(someSibling) {
        if (someSibling.parentNode) {
          someSibling.parentNode.insertBefore(
            currentWorkingElement,
            someSibling
          );
        }
        return this;
      }
    };
  }

  // src/common/observable.ts
  var Observable = class _Observable {
    constructor(key) {
      this.key = key;
    }
    subscriptionActionList = [];
    static createSubscription(key, subscriptionArray) {
      const newObservable = new _Observable(key);
      newObservable.subscriptionActionList = subscriptionArray;
      return newObservable;
    }
    subscribe(fn) {
      this.subscriptionActionList.push(fn);
    }
    fire(data) {
      for (let index = 0; index < this.subscriptionActionList.length; ++index) {
        this.subscriptionActionList[index](data);
      }
    }
    unsubscribe(fn) {
      for (let index = 0; index < this.subscriptionActionList.length; ++index) {
        const searchFn = this.subscriptionActionList[index];
        if (searchFn === fn) {
          this.subscriptionActionList.splice(index, 1);
        }
      }
    }
  };

  // src/common/subscriber.ts
  var Subscriber = class {
    /// Track queue
    eventQueue = {};
    subscriptionMap = {};
    constructor() {
    }
    /// This should return a reference to something to the
    /// owner of this subscription
    createSubscription(eventName) {
      if (!this.subscriptionMap.hasOwnProperty(eventName)) {
        if (this.eventQueue.hasOwnProperty(eventName)) {
          this.subscriptionMap[eventName] = Observable.createSubscription(eventName, this.eventQueue[eventName]);
          delete this.eventQueue[eventName];
        } else {
          this.subscriptionMap[eventName] = new Observable(eventName);
        }
      } else {
        this.subscriptionMap[eventName] = new Observable(eventName);
      }
      return this.subscriptionMap[eventName];
    }
    unsubscribeToEvent(eventName, fn) {
      if (this.subscriptionMap.hasOwnProperty(eventName)) {
        this.subscriptionMap[eventName].unsubscribe(fn);
      }
    }
    fire(eventName, data) {
      if (this.subscriptionMap.hasOwnProperty(eventName)) {
        this.subscriptionMap[eventName].fire(data);
      }
    }
    subscribeToEvent(eventName, fn) {
      if (this.subscriptionMap.hasOwnProperty(eventName)) {
        this.subscriptionMap[eventName].subscribe(fn);
      } else if (this.eventQueue.hasOwnProperty(eventName)) {
        this.eventQueue[eventName].push(fn);
      } else {
        this.eventQueue[eventName] = [fn];
      }
    }
  };

  // src/service/global.service.ts
  var GlobalAudioService = class {
    constructor(subscriber, wasmModule) {
      this.subscriber = subscriber;
      this.wasmModule = wasmModule;
      this.contextObservable$ = this.subscriber.createSubscription("contextcreated");
      this.fileObservable$ = this.subscriber.createSubscription("musicchanged");
    }
    // @ts-expect-error
    audioContext;
    // @ts-expect-error
    mainGain;
    // @ts-expect-error
    sourceBuffer;
    // @ts-expect-error
    bufferSourceNode;
    contextObservable$;
    fileObservable$;
    paused = true;
    initialized = false;
    // @ts-expect-error
    audioWorkletNode;
    createWorkletNode() {
      this.useAudioContext().audioWorklet.addModule("scripts/phase-vocoder.service.js").then((_) => {
        this.audioWorkletNode = new AudioWorkletNode(this.useAudioContext(), "phase-vocoder-processor");
        this.audioWorkletNode.port.postMessage({
          data: this.wasmModule
        });
        this.audioWorkletNode.port.onmessage = (event) => {
          if (event.data.wasm_init) {
            this.initialized = true;
            this.contextObservable$.fire();
          }
        };
        this.mainGain.connect(this.audioWorkletNode);
        this.audioWorkletNode.connect(this.audioContext.destination);
      }).catch((err) => {
        console.error(err);
      });
    }
    changePitchFactor(value) {
      const currentPitch = this.audioWorkletNode.parameters.get("pitchFactor");
      currentPitch.value = value;
    }
    changeSpeedFactor(value) {
      const currentRate = this.audioWorkletNode.parameters.get("playbackRate");
      currentRate.value = value;
    }
    useAudioContext() {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
        this.mainGain = this.audioContext.createGain();
        this.createWorkletNode();
      }
      return this.audioContext;
    }
    setPaused(paused) {
      this.paused = paused;
    }
    makeConnection(sourceNode) {
      if (!this.mainGain) {
        this.useAudioContext();
      }
      sourceNode.connect(this.mainGain);
    }
    isInitialized() {
      return this.initialized;
    }
    isPaused() {
      return this.paused;
    }
    resume() {
      this.paused = false;
      this.useAudioContext().resume();
    }
    pause() {
      this.paused = true;
      this.useAudioContext().suspend();
    }
    connectGainTo(destNode) {
      if (!this.mainGain) {
        this.useAudioContext();
      }
      this.mainGain.connect(destNode);
      destNode.connect(this.audioContext.destination);
    }
    connectAudioWorkletNodeTo(destNode) {
      if (!this.audioContext) {
        this.useAudioContext();
      }
      if (this.audioWorkletNode) {
        this.audioWorkletNode.connect(destNode);
        destNode.connect(this.audioContext.destination);
      }
    }
  };

  // src/view/palette.view.ts
  var CanvasThemeSelectorView = class {
    constructor(subscriber) {
      this.subscriber = subscriber;
      [this.mainDOM, this.paletteElement] = this.constructPalette();
      this.subscriber.createSubscription("palette");
    }
    mainDOM;
    paletteElement;
    paletteArray = [
      ["#0a0c0d", "#d8dceb"],
      ["#0f4d19", "#6fc27c"],
      ["#143d59", "#c4f41a"],
      ["#2F3C7E", "#FBEAEB"],
      ["#990011", "#FCF6F5"],
      ["#AD4F21", "#FCF6E5"],
      ["#50586C", "#DCE2F0"],
      ["#262223", "#DDC6B6"],
      ["#02343F", "#F0EDCC"],
      ["#00203F", "#ADEFD1"],
      ["#D1E9F6", "#524986"],
      ["#262150", "#dfd3f3"],
      ["#f3bbc5", "#1a1b1b"],
      ["#292426", "#b5dde0"],
      ["#eefa9f", "#2b3649"]
    ];
    getAllAttachableViews() {
      return [this.mainDOM];
    }
    sendData(evt) {
      let target = evt.target;
      if (target.tagName.toLocaleLowerCase() === "span") {
        target = target.parentElement;
      }
      const data = [target.getAttribute("data-back-color"), target.getAttribute("data-fore-color"), false];
      this.subscriber.fire("palette", data);
    }
    constructPalette() {
      const styleDom = this.constructTitle();
      const paletteColors = this.constructPaletteColors();
      const mainDOM = el("div").mcls("bg-gray-600/30", "backdrop-blur-[2px]", "min-w-36", "top-10", "right-10", "rounded-[3px]", "p-2", "text-center").mcls("max-h-72", "overflow-hidden", "flex", "flex-col", "shadow-md").inners(styleDom, paletteColors).get();
      const list = mainDOM.children[1];
      const button = styleDom.children[1];
      el(button).evt("click", (_) => el(list).tcls("collapsed"));
      return [mainDOM, paletteColors];
    }
    constructPaletteDOM(rgb) {
      return el("div").mcls("min-h-12", "w-avail", "h-8", "rounded-sm", "transition-all", "duration-300", "ease-in-out", "hover:bg-gray-100/30", "cursor-pointer").inners(
        el("span").mcls("w-8", "h-8", "p-4", "relative", "top-2", "inline-block").styleAttr({ backgroundColor: rgb[0] }).get(),
        el("span").mcls("min-w-8", "min-h-8", "p-4", "relative", "top-2", "inline-block").styleAttr({ backgroundColor: rgb[1] }).get()
      ).attr("data-back-color", rgb[0]).attr("data-fore-color", rgb[1]).evt("click", this.sendData.bind(this)).get();
    }
    constructGradientPallete(evt) {
      let target = evt.target;
      if (target.tagName.toLocaleLowerCase() === "span") {
        target = target.parentElement;
      }
      const data = [target.getAttribute("data-back-color"), target.getAttribute("data-fore-color"), true];
      this.subscriber.fire("palette", data);
    }
    constructGradientPaletteDOM(rgb) {
      return el("div").mcls("min-h-12", "w-avail", "h-8", "rounded-sm", "transition-all", "duration-300", "ease-in-out", "hover:bg-gray-100/30", "cursor-pointer").inners(
        el("span").mcls("w-8", "h-8", "p-4", "relative", "top-2", "inline-block").styleAttr({ backgroundColor: `linearGradient(${rgb[0]}, ${rgb[1]})` }).get(),
        el("span").mcls("min-w-8", "min-h-8", "p-4", "relative", "top-2", "inline-block").styleAttr({ backgroundColor: rgb[1] }).get()
      ).attr("data-back-color", rgb[0]).attr("data-fore-color", rgb[1]).evt("click", this.constructGradientPallete.bind(this)).get();
    }
    constructPaletteColors() {
      const paletteElement = el("div").mcls("flex", "flex-col", "w-full", "h-full", "scrollbar-thumb", "overflow-y-scroll", "overflow-x-hidden", "mt-4").inner(this.paletteArray.map(([f, s]) => [
        this.constructPaletteDOM([f, s]),
        this.constructPaletteDOM([s, f])
      ]).flat()).get();
      return paletteElement;
    }
    constructTitle() {
      const title = el("span").mcls("text-[18px]", "font-serif", "text-gray-100", "block", "items-center", "flex").inner([
        el("span").mcls("relative", "top-[2px]", "block", "self-center", "w-avail", "font-bold").innerText("Color Theme"),
        el("button").mcls("min-h-8", "min-w-8", "rounded-[1rem]", "bg-gray-300", "border-[0]", "ml-4", "self-end", "rotate-90").innerHtml(">")
      ]).get();
      return title;
    }
    getView() {
      return this.mainDOM;
    }
  };

  // src/view/panel.view.ts
  var PanelView = class {
    constructor(subscriber) {
      this.subscriber = subscriber;
      this.mainDOM = this.constructPanelView();
    }
    mainDOM;
    constructPanelView() {
      return el("div").mcls("fixed", "bg-gray-600/30", "backdrop-blur-[2px]", "min-w-36", "min-h-24", "top-10", "right-10", "rounded-[1rem]", "pr-0", "text-center").mcls("overflow-y-scroll", "shadow-md", "panel-height", "scrollbar-thumb").inners(el("div").mcls("text-gray-200", "p-2").innerHtml("Press LCtrl to hide the panel.")).get();
    }
    attachViews(someDOMList) {
      someDOMList.forEach((someDOM) => this.mainDOM.appendChild(el(someDOM).mcls("m-2").get()));
    }
    getView() {
      return this.mainDOM;
    }
  };

  // src/common/utility.ts
  var utility_default = {
    /**
     * @brief Pad for timer
     * @param number
     * @returns
     */
    padder(number) {
      return number < 10 ? "0" + number : number.toString();
    },
    padderString(number) {
      return number.length <= 1 ? "0" + number : number;
    },
    timerSec(timeInSeconds) {
      const [min, sec] = [Math.floor(timeInSeconds / 60), Math.floor(timeInSeconds) % 60];
      return `${this.padder(min)}:${this.padder(sec)}`;
    },
    linearToCubic(number, peak = 256, factor = 1) {
      const real = number / (peak * factor);
      return real * real * real * peak;
    },
    linearToPower(number, power, peak = 256, factor = 1) {
      const real = number / (peak * factor);
      return Math.pow(real, power) * peak;
    },
    linearToSquare(number, peak = 256, factor = 1) {
      const real = number / (peak * factor);
      return real * real * peak;
    }
  };

  // src/common/complex.ts
  var Complex = class _Complex {
    constructor(r, i) {
      this.r = r;
      this.i = i;
    }
    /**
     * @description Adds two complex number
     */
    add = (other) => new _Complex(this.r + other.r, this.i + other.i);
    /**
     * @description Subtract two complex number
     */
    sub = (other) => new _Complex(this.r - other.r, this.i - other.i);
    /**
     * @description Multiply two complex number
     */
    mul = (other) => new _Complex(this.r * other.r - this.i * other.i, this.i * other.r + this.r * other.i);
    /**
     * @description Multiply complex number with scalar
     */
    muln = (other) => new _Complex(this.r * other, this.i * other);
    /**
     * @description Divide two complex number
     */
    div = (other) => new _Complex((this.r * other.r + this.i * other.i) / other.abs_sq(), (this.i * other.r - this.r * other.i) / other.abs_sq());
    /**
     * @description Absolute value of complex number
     */
    abs = () => Math.sqrt(this.r * this.r + this.i + this.i);
    /**
     * @description Absolute value of complex number squared
     */
    abs_sq = () => this.r * this.r + this.i + this.i;
    /**
     * @description Unity with angle ang
     */
    static unit = (ang) => new _Complex(Math.cos(ang), Math.sin(ang));
    /**
     * @description Create value based on magnitude and angle (same as unit(ang) * mag)
     */
    static vec = (mag, ang) => new _Complex(mag * Math.cos(ang), mag * Math.sin(ang));
    /**
     * @returns Real and imaginary units
     */
    coord = () => [this.r, this.i];
    conj = () => new _Complex(this.r, -this.i);
    invConj = () => new _Complex(this.i, -this.r);
    inv = () => new _Complex(this.i, this.r);
  };

  // src/service/util.service.ts
  function withDocumentDim(config, callback) {
    const newConfig = {
      ...config,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      resize: (_, _h) => {
      }
    };
    newConfig.resize = function(width, height) {
      this.width = width;
      this.height = height;
      callback && callback(newConfig);
    }.bind(newConfig);
    return newConfig;
  }

  // src/service/transformation.service.ts
  function applyTransformation(canvasContext, optionsArray) {
    optionsArray.forEach((option) => option.fn(canvasContext, option));
  }
  function createRandomParticleSeeding(length, xScale, yScale, xVelScale, yVelScale, xAccelScale, yAccelScale) {
    return withDocumentDim({
      type: "Particle",
      timeStamp: performance.now(),
      length,
      fn: applyParticleTransformation,
      isSpiral: false,
      checkSpiral: function(event) {
        this.isSpiral = event.target.checked;
      },
      buffer: {
        x: new Float32Array(length).map((_) => Math.random() * xScale),
        y: new Float32Array(length).map((_) => Math.random() * yScale),
        vx: new Float32Array(length).map((_) => Math.random() * xVelScale),
        vy: new Float32Array(length).map((_) => Math.random() * yVelScale),
        ax: new Float32Array(length).map((_) => Math.random() * xAccelScale),
        ay: new Float32Array(length).map((_) => Math.random() * yAccelScale)
      }
    });
  }
  var clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  function applyParticleTransformation(canvasContext, options) {
    canvasContext.fillStyle = options.textColor;
    canvasContext.beginPath();
    const currentTimeStamp = performance.now();
    const timeChange = (currentTimeStamp - options.timeStamp) / 1e3;
    for (let index = 0; index < options.length; ++index) {
      let [x, y, vx, vy, ax, ay] = [
        options.buffer.x[index],
        options.buffer.y[index],
        options.buffer.vx[index],
        options.buffer.vy[index],
        options.buffer.ax[index],
        options.buffer.ay[index]
      ];
      if (options.isSpiral) {
        canvasContext.fillRect(x, y, 1 + (vx > 0 ? 1 : 0), 1 + (vx > 0 ? 1 : 0));
        [ax, ay] = Complex.vec(8, Math.random() * Math.PI).coord();
      } else {
        canvasContext.fillRect(x, y, 1, 1);
        [ax, ay] = Complex.vec(16, 2 * Math.random() * Math.PI).coord();
      }
      vx += ax * timeChange;
      vx = clamp(vx, -20, 20);
      vy += ay * timeChange;
      vy = clamp(vy, -20, 20);
      x += vx * timeChange;
      y += vy * timeChange;
      if (x < 0) {
        x += options.width;
      } else if (x > options.width) {
        x -= options.width;
      }
      if (y < 0) {
        y += options.height;
      } else if (y > options.height) {
        y -= options.height;
      }
      options.buffer.x[index] = x;
      options.buffer.y[index] = y;
      options.buffer.vx[index] = vx;
      options.buffer.vy[index] = vy;
      options.buffer.ax[index] = ax;
      options.buffer.ay[index] = ay;
    }
    options.timeStamp = currentTimeStamp;
    canvasContext.stroke();
  }

  // src/service/bar.service.ts
  var color = (magnitude) => {
    if (magnitude < 200) return "rgb(135 255 66)";
    if (magnitude < 275) return "rgb(255 192 98)";
    return "rgb(255 75 99)";
  };
  function createOptionsForBar(frequencyIncr, mirrored) {
    return withDocumentDim({
      type: "Bar",
      bandBarCount: 16,
      lineType: "Normal",
      bandRanges: [
        [20, 260],
        [260, 500],
        [500, 2e3],
        [2e3, 5e3],
        [5e3, 15e3]
      ],
      frequencyIncr,
      volumeScaling: 0.4,
      barFactor: 3,
      mirrored,
      fn: barFormation
    });
  }
  function drawRetroForBar(context, fromX, fromY, width, toY) {
    const magnitude = Math.abs(toY - fromY);
    const block = 25, padding = 8;
    context.lineCap = "square";
    let ix = fromX, iy = fromY;
    for (let iter = 0, rBlock = 0; rBlock < magnitude; rBlock += block, iter += 1) {
      context.fillStyle = color(rBlock);
      context.fillRect(ix, iy, width, block - padding);
      iy -= block;
    }
  }
  function drawLineForBar(lineType, context, fromX, fromY, width, toY) {
    context.moveTo(fromX, fromY);
    switch (lineType) {
      case "Normal":
        context.fillRect(fromX, fromY, context.lineWidth, toY - fromY);
        break;
      case "Retro":
        drawRetroForBar(context, fromX, fromY, width, toY);
        break;
    }
  }
  function barFormation(canvasContext, options) {
    options.analyser.getFloatFrequencyData(options.buffer);
    const buffer = options.buffer;
    const sliceWidth = options.width / (options.bandBarCount * 5);
    canvasContext.lineWidth = sliceWidth - sliceWidth / 10;
    const base = options.height;
    canvasContext.lineCap = "square";
    canvasContext.beginPath();
    let x = 0, i = 0;
    if (!options.mirrored) {
      for (const [startRange, endRange] of options.bandRanges) {
        const totalBands = (endRange - startRange) / options.frequencyIncr;
        const indexIncrement = totalBands / options.bandBarCount;
        let perBandValue = 0;
        for (; perBandValue < options.bandBarCount; ++perBandValue, i += indexIncrement) {
          const v = buffer[Math.floor(i)] + 128;
          if (v > 0) {
            const y = base - utility_default.linearToPower(v, 4, 256, options.volumeScaling) * options.barFactor;
            drawLineForBar(options.lineType, canvasContext, x, base, canvasContext.lineWidth, y);
          }
          x += sliceWidth;
        }
      }
    } else {
      const base2 = options.height / 2 + 50;
      const tempFill = canvasContext.strokeStyle;
      for (const [startRange, endRange] of options.bandRanges) {
        const totalBands = (endRange - startRange) / options.frequencyIncr;
        const indexIncrement = totalBands / options.bandBarCount;
        let perBandValue = 0;
        for (; perBandValue < options.bandBarCount; ++perBandValue, i += indexIncrement) {
          const v = buffer[Math.floor(i)] + 128;
          if (v > 0) {
            const y = utility_default.linearToPower(v, 4, 256, options.volumeScaling) * (options.barFactor / 1.65);
            canvasContext.fillStyle = tempFill;
            drawLineForBar(options.lineType, canvasContext, x, base2, canvasContext.lineWidth, base2 - y);
            canvasContext.fillStyle = tempFill + "90";
            drawLineForBar(options.lineType, canvasContext, x, base2, canvasContext.lineWidth, base2 + y);
          }
          x += sliceWidth;
        }
      }
    }
    canvasContext.stroke();
  }

  // src/service/barcircle.service.ts
  function createBarCircleEq(frequencyIncr, mirrored) {
    return withDocumentDim({
      type: "BarCircle",
      angleInit: 0,
      lineType: "Default",
      radius: 200,
      circleBarCount: 25,
      bandRanges: [
        [20, 260],
        [260, 500],
        [500, 2e3],
        [2e3, 5e3],
        [5e3, 15e3]
      ],
      fn: barCircleFormation,
      frequencyIncr,
      volumeScaling: 0.5,
      barCircleFactor: 3.2,
      timeStamp: performance.now(),
      mirrored,
      angularVelocity: 2 * Math.PI / 100
    });
  }
  function barCircleFormation(canvasContext, options) {
    options.analyser.getFloatFrequencyData(options.buffer);
    const buffer = options.buffer, centerX = options.width / 2, centerY = options.height / 2, anglePerBar = (options.mirrored ? 1 : 2) * Math.PI / (options.bandRanges.length * options.circleBarCount);
    let theta = options.angleInit;
    const radius = Math.min(options.width, options.height) / 4;
    const change = Complex.unit(anglePerBar);
    const arcLength = radius * anglePerBar;
    let unitAng = Complex.unit(theta);
    let angle = Complex.vec(radius, theta);
    canvasContext.lineWidth = arcLength - arcLength / 10;
    canvasContext.lineCap = "round";
    let i = 0;
    const currentTimestamp = performance.now();
    canvasContext.beginPath();
    canvasContext.lineWidth = arcLength - arcLength / 10;
    for (const [startRange, endRange] of options.bandRanges) {
      const totalBands = (endRange - startRange) / options.frequencyIncr;
      const indexIncrement = totalBands / options.circleBarCount;
      let perBandValue = 0;
      for (; perBandValue < options.circleBarCount; ++perBandValue, i += indexIncrement) {
        const v = buffer[Math.floor(i)] + 128;
        if (v > 0) {
          const y = utility_default.linearToPower(v, 4, 256, options.volumeScaling) * options.barCircleFactor;
          const normal = unitAng.muln(y);
          const [xc, yc] = angle.coord();
          const [xb, yb] = normal.coord();
          canvasContext.moveTo(xc + centerX, yc + centerY);
          canvasContext.lineTo(xc + centerX + xb, yc + centerY + yb);
        }
        angle = angle.mul(change);
        unitAng = unitAng.mul(change);
        theta += anglePerBar;
      }
    }
    options.angleInit += (currentTimestamp - options.timeStamp) / 1e3 * options.angularVelocity;
    options.timeStamp = currentTimestamp;
    canvasContext.stroke();
  }

  // src/service/wavecircle.service.ts
  function createOptionsForWaveCircle(frequencyIncr, isCircleSpike) {
    return withDocumentDim({
      type: "Wave Circle",
      angleInit: 0,
      lineType: "Normal",
      radius: isCircleSpike ? 225 : 175,
      bandRanges: [
        [20, 260],
        [260, 500],
        [500, 2e3],
        [2e3, 5e3],
        [5e3, 15e3]
      ],
      fn: isCircleSpike ? circleSpikeFormation : waveCircleFormation,
      waveCounts: 24,
      frequencyIncr,
      volumeScaling: 0.5,
      barCircleFactor: isCircleSpike ? 1.75 : 2.25,
      timeStamp: performance.now(),
      angularVelocity: 2 * Math.PI / 100
    });
  }
  function waveCircleFormation(canvasContext, options) {
    options.analyser.getFloatFrequencyData(options.buffer);
    const [centerX, centerY] = [options.width / 2, options.height / 2];
    const anglePerBar = 2 * Math.PI / (options.bandRanges.length * options.waveCounts);
    let theta = options.angleInit;
    let angle = Complex.vec(options.height / 4, theta);
    const change = Complex.unit(anglePerBar);
    let unitAng = Complex.unit(theta);
    canvasContext.lineWidth = 2;
    let i = 0;
    let firstPoint = null;
    let prevPoints = [0, 0];
    const currentTimestamp = performance.now();
    canvasContext.beginPath();
    for (const [startRange, endRange] of options.bandRanges) {
      const totalBands = (endRange - startRange) / options.frequencyIncr;
      const indexIncrement = totalBands / options.waveCounts;
      let perBandValue = 0;
      for (; perBandValue < options.waveCounts; ++perBandValue, i += indexIncrement) {
        const v = options.buffer[Math.ceil(i)] + 128;
        const y = utility_default.linearToPower(v, 4, 256, options.volumeScaling) * options.barCircleFactor;
        const normal = unitAng.muln(y);
        const [xc, yc] = angle.coord();
        const [xb, yb] = normal.coord();
        if (firstPoint === null) {
          firstPoint = [xc + centerX + xb, yc + centerY + yb];
          canvasContext.moveTo(xc + centerX + xb, yc + centerY + yb);
        } else {
          canvasContext.quadraticCurveTo(
            prevPoints[0],
            prevPoints[1],
            xc + centerX + xb,
            yc + centerY + yb
          );
        }
        prevPoints = [xc + centerX + xb, yc + centerY + yb];
        angle = angle.mul(change);
        unitAng = unitAng.mul(change);
        theta += anglePerBar;
      }
    }
    options.angleInit += (currentTimestamp - options.timeStamp) / 1e3 * options.angularVelocity;
    options.timeStamp = currentTimestamp;
    canvasContext.stroke();
  }
  function circleSpikeFormation(canvasContext, options) {
    options.analyser.getFloatFrequencyData(options.buffer);
    const centerX = options.width / 2, centerY = options.height / 2, anglePerBar = Math.PI / (options.bandRanges.length * options.waveCounts);
    let theta = options.angleInit;
    canvasContext.lineWidth = 3;
    let i = 0, firstPoint = null, prevPoints = [0, 0, 0, 0], arrayIndex = 0;
    const currentTimestamp = performance.now();
    canvasContext.beginPath();
    const values = new Float32Array(options.bandRanges.length * options.waveCounts);
    for (const [startRange, endRange] of options.bandRanges) {
      const totalBands = (endRange - startRange) / options.frequencyIncr;
      const indexIncrement = totalBands / options.waveCounts;
      let perBandValue = 0;
      for (; perBandValue < options.waveCounts; ++perBandValue, i += indexIncrement) {
        const v = options.buffer[Math.ceil(i)] + 128;
        values[arrayIndex++] = utility_default.linearToPower(v, 4, 256, options.volumeScaling) * options.barCircleFactor;
      }
    }
    const spectrum = new Float32Array(values.length * 2);
    spectrum.subarray(0, values.length).set(values);
    spectrum.subarray(values.length).set(values.reverse());
    const averageBass = spectrum.subarray(0, 2 * options.waveCounts).reduce((prev, curr) => prev + curr, 0) / (2 * options.waveCounts);
    const radius = Math.min(options.width, options.height) / 4;
    let angle = Complex.vec(radius + utility_default.linearToPower(averageBass, 2, 256, 1), theta), change = Complex.unit(anglePerBar), unitAng = Complex.unit(theta);
    canvasContext.lineWidth = 3;
    for (const y of spectrum) {
      const normal = unitAng.muln(y);
      const [xc, yc] = angle.coord();
      const [xb, yb] = normal.coord();
      if (firstPoint === null) {
        firstPoint = [xc + centerX, yc + centerY, xb, yb];
      } else {
        canvasContext.moveTo(prevPoints[0] + prevPoints[2], prevPoints[1] + prevPoints[3]);
        canvasContext.quadraticCurveTo(
          prevPoints[0] + prevPoints[2],
          prevPoints[1] + prevPoints[3],
          xc + centerX + xb,
          yc + centerY + yb
        );
        canvasContext.moveTo(prevPoints[0] - prevPoints[2], prevPoints[1] - prevPoints[3]);
        canvasContext.quadraticCurveTo(
          prevPoints[0] - prevPoints[2],
          prevPoints[1] - prevPoints[3],
          xc + centerX - xb,
          yc + centerY - yb
        );
        canvasContext.moveTo(xc + centerX + xb, yc + centerY + yb);
        canvasContext.lineTo(
          xc + centerX - xb,
          yc + centerY - yb
        );
      }
      prevPoints = [xc + centerX, yc + centerY, xb, yb];
      angle = angle.mul(change);
      unitAng = unitAng.mul(change);
      theta += anglePerBar;
    }
    canvasContext.moveTo(prevPoints[0] + prevPoints[2], prevPoints[1] + prevPoints[3]);
    canvasContext.quadraticCurveTo(
      // @ts-expect-error
      prevPoints[0] + prevPoints[2],
      prevPoints[1] + prevPoints[3],
      firstPoint[0] + firstPoint[2],
      firstPoint[1] + firstPoint[3]
    );
    canvasContext.moveTo(prevPoints[0] - prevPoints[2], prevPoints[1] - prevPoints[3]);
    canvasContext.quadraticCurveTo(
      // @ts-expect-error
      prevPoints[0] - prevPoints[2],
      prevPoints[1] - prevPoints[3],
      firstPoint[0] - firstPoint[2],
      firstPoint[1] - firstPoint[3]
    );
    options.angleInit += (currentTimestamp - options.timeStamp) / 1e3 * options.angularVelocity;
    options.timeStamp = currentTimestamp;
    canvasContext.stroke();
  }

  // src/service/wave.service.ts
  function createOptionsForWave() {
    return withDocumentDim({
      type: "Wave",
      fn: waveFormation
    });
  }
  function waveFormation(canvasContext, options) {
    canvasContext.lineWidth = 2;
    options.analyser.getByteTimeDomainData(options.buffer);
    const base = options.height, base_2 = base / 2;
    const buffer = options.buffer;
    const sliceWidth = options.width / options.buffer.length;
    let x = 0;
    const v = buffer[0] / 128 - 1, y = base_2 + v * 256;
    canvasContext.beginPath();
    canvasContext.moveTo(0, y);
    for (let i = 1; i < buffer.length; i++) {
      const v2 = buffer[i] / 128 - 1;
      const y2 = base_2 + v2 * 512;
      canvasContext.lineTo(x, y2);
      x += sliceWidth;
    }
    canvasContext.stroke();
  }

  // wasm-eq-visualizer/pkg/wasm_eq_visualizer.js
  var import_meta = {};
  var wasm;
  var heap = new Array(128).fill(void 0);
  heap.push(void 0, null, true, false);
  function getObject(idx) {
    return heap[idx];
  }
  var heap_next = heap.length;
  function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
  }
  function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
  }
  var cachedTextDecoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }) : { decode: () => {
    throw Error("TextDecoder not available");
  } };
  if (typeof TextDecoder !== "undefined") {
    cachedTextDecoder.decode();
  }
  var cachedUint8ArrayMemory0 = null;
  function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
      cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
  }
  function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
  }
  var cachedDataViewMemory0 = null;
  function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
      cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
  }
  function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];
    heap[idx] = obj;
    return idx;
  }
  function handleError(f, args) {
    try {
      return f.apply(this, args);
    } catch (e) {
      wasm.__wbindgen_exn_store(addHeapObject(e));
    }
  }
  var WASM_VECTOR_LEN = 0;
  function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
  }
  var cachedUint8ClampedArrayMemory0 = null;
  function getUint8ClampedArrayMemory0() {
    if (cachedUint8ClampedArrayMemory0 === null || cachedUint8ClampedArrayMemory0.byteLength === 0) {
      cachedUint8ClampedArrayMemory0 = new Uint8ClampedArray(wasm.memory.buffer);
    }
    return cachedUint8ClampedArrayMemory0;
  }
  function getClampedArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ClampedArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
  }
  async function __wbg_load(module, imports) {
    if (typeof Response === "function" && module instanceof Response) {
      if (typeof WebAssembly.instantiateStreaming === "function") {
        try {
          return await WebAssembly.instantiateStreaming(module, imports);
        } catch (e) {
          if (module.headers.get("Content-Type") != "application/wasm") {
            console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
          } else {
            throw e;
          }
        }
      }
      const bytes = await module.arrayBuffer();
      return await WebAssembly.instantiate(bytes, imports);
    } else {
      const instance = await WebAssembly.instantiate(module, imports);
      if (instance instanceof WebAssembly.Instance) {
        return { instance, module };
      } else {
        return instance;
      }
    }
  }
  function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
      takeObject(arg0);
    };
    imports.wbg.__wbg_setglobalCompositeOperation_fce0d56773527492 = function() {
      return handleError(function(arg0, arg1, arg2) {
        getObject(arg0).globalCompositeOperation = getStringFromWasm0(arg1, arg2);
      }, arguments);
    };
    imports.wbg.__wbg_drawImage_d7a7d393f2597a75 = function() {
      return handleError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).drawImage(getObject(arg1), arg2, arg3);
      }, arguments);
    };
    imports.wbg.__wbg_putImageData_56e088afd88fcc90 = function() {
      return handleError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).putImageData(getObject(arg1), arg2, arg3);
      }, arguments);
    };
    imports.wbg.__wbg_clearRect_2823209627b6e357 = function(arg0, arg1, arg2, arg3, arg4) {
      getObject(arg0).clearRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_data_3748d6414e549999 = function(arg0, arg1) {
      const ret = getObject(arg1).data;
      const ptr1 = passArray8ToWasm0(ret, wasm.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
      getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_newwithu8clampedarray_6b29095634b7e758 = function() {
      return handleError(function(arg0, arg1, arg2) {
        const ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0);
        return addHeapObject(ret);
      }, arguments);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    };
    return imports;
  }
  function __wbg_init_memory(imports, memory) {
  }
  function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    cachedUint8ClampedArrayMemory0 = null;
    return wasm;
  }
  async function __wbg_init(module_or_path) {
    if (wasm !== void 0) return wasm;
    if (typeof module_or_path !== "undefined" && Object.getPrototypeOf(module_or_path) === Object.prototype)
      ({ module_or_path } = module_or_path);
    else
      console.warn("using deprecated parameters for the initialization function; pass a single object instead");
    if (typeof module_or_path === "undefined") {
      module_or_path = new URL("wasm_eq_visualizer_bg.wasm", import_meta.url);
    }
    const imports = __wbg_get_imports();
    if (typeof module_or_path === "string" || typeof Request === "function" && module_or_path instanceof Request || typeof URL === "function" && module_or_path instanceof URL) {
      module_or_path = fetch(module_or_path);
    }
    __wbg_init_memory(imports);
    const { instance, module } = await __wbg_load(await module_or_path, imports);
    return __wbg_finalize_init(instance, module);
  }
  var wasm_eq_visualizer_default = __wbg_init;

  // src/service/chrome.service.ts
  wasm_eq_visualizer_default({ module_or_path: "./wasm_eq_visualizer_bg.wasm" });
  function createBufferForChromaticAbberation(width, height) {
    const offCanvas = new OffscreenCanvas(width, height);
    const context = offCanvas.getContext("2d", { willReadFrequently: true });
    const outCanvas = new OffscreenCanvas(width, height);
    const outContext = outCanvas.getContext("2d", { willReadFrequently: true });
    return withDocumentDim({
      offCanvas,
      context,
      outCanvas,
      outContext,
      r: context.createImageData(width, height),
      g: context.createImageData(width, height),
      b: context.createImageData(width, height)
    }, (currConfig) => {
      currConfig.offCanvas.width = currConfig.width;
      currConfig.offCanvas.height = currConfig.height;
      currConfig.outCanvas.width = currConfig.width;
      currConfig.outCanvas.height = currConfig.height;
    });
  }

  // src/view/window.view.ts
  function createPanelSection(...children) {
    return el("div").mcls("bg-gray-600/30", "backdrop-blur-[2px]", "transition-all", "duration-200", "ease-in-out", "w-avail", "top-10", "right-[300px]", "rounded-[3px]", "p-2", "pr-0", "text-center").mcls("max-h-72", "overflow-y-scroll", "scrollbar-thumb", "flex", "flex-col", "shadow-md").inners(...children).get();
  }
  function constructTitle(titleName) {
    return el("span").mcls("text-[18px]", "font-serif", "text-gray-100", "block", "items-center", "flex").inners(
      el("span").mcls("relative", "top-[2px]", "block", "self-center", "w-avail", "font-bold").innerText(titleName),
      el("button").mcls("min-h-8", "min-w-8", "rounded-[1rem]", "bg-gray-300", "border-[0]", "ml-4", "self-end")
    ).get();
  }
  function createInputTuple(inputType, label, evtCall) {
    return [
      el("div").inners(
        el("input").inputType(inputType).attr("name", "toggle-spiral").evt("change", evtCall),
        el("label").attr("for", "toggle-spiral").mcls("text-gray-200", "p-2").innerHtml(label).get()
      )
    ];
  }
  var WindowView = class {
    constructor(audioService, subscriber) {
      this.audioService = audioService;
      this.subscriber = subscriber;
      const [seekbarThumb, seekbarDOM] = this.constructSeekbar();
      this.seekBarThumb = seekbarThumb;
      const { canvas, canvasContext } = this.buildCanvas();
      this.canvas = canvas;
      this.canvasContext = canvasContext;
      this.resetCanvas(this.canvasContext);
      this.fps = this.initializeFpsCounter();
      this.mainDOM = this.initializeAudio(this.canvas, seekbarDOM, this.fps);
      this.canvasAction.draw.push(Object.assign(
        createRandomParticleSeeding(256, this.width, this.height, 6, 6, 2, 2),
        { drawKind: "other", textColor: this.textColor }
      ));
      this.channelData = createBufferForChromaticAbberation(this.width, this.height);
      this.offscreenCanvas = new OffscreenCanvas(this.width, this.height);
      this.offContext = this.offscreenCanvas.getContext("2d", { willReadFrequently: true });
      this.subscriber.subscribeToEvent("palette", (data) => {
        [this.backColor, this.textColor] = data;
        this.canvasAction.draw = this.canvasAction.draw.map((value) => ({
          ...value,
          backColor: this.backColor,
          textColor: this.textColor
        }));
        this.resetCanvas(this.canvasContext);
      });
    }
    fileName = null;
    backColor = "rgb(10 12 14)";
    textColor = "rgb(216 220 235)";
    seekPadding = 200;
    prevTimer = performance.now();
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientWidth;
    timer = 0;
    transformationsFns = [];
    channelData;
    optionsArray = [];
    currentEq = {};
    canvasAction = {
      draw: [],
      effects: []
    };
    mainDOM;
    buffer = new Uint8Array(0);
    frequencyBuffer = new Float32Array(1);
    canvas;
    offscreenCanvas;
    offContext;
    // @ts-expect-error
    analyser;
    canvasContext;
    // Buffer Length
    bufferLength = 0;
    // FFT Size
    fftSize = 16384;
    /// Wave
    animationFrame = 0;
    /// seekbar
    seekbarAnimationFrame = 0;
    /// Canvas Bar
    // @ts-expect-error
    sourceBuffer;
    // @ts-expect-error
    bufferSourceNode;
    // current mode
    currentMode = "Wave";
    // frequency increment
    frequencyIncr = 0;
    // Font
    fontSize = 30;
    // button: HTMLElement;
    seekBarThumb;
    fps;
    totalTimer = 0;
    seekbarLength = 0;
    offsetTimer = 0;
    lineType = "Normal";
    prevTime = null;
    pitchCorrection = 1;
    allowMediaControl(_) {
      if (!this.audioService.isInitialized()) {
        this.audioService.useAudioContext();
        this.changeMode(this.currentMode);
      }
    }
    createAudioPermissionButton() {
      return el("button").mcls("bg-blue-500", "block", "w-avail", "text-gray-100", "p-2", "pb-1", "hover:bg-blue-600", "transition-all", "ease-in-out", "duration-300", "rounded-sm", "active:bg-blue-700").innerHtml("Allow Media Control").evt("click", this.allowMediaControl.bind(this)).get();
    }
    selectMediaFile(_) {
      const input = el("input").attr("type", "file").attr("accept", "audio/*").get();
      input.onchange = (event) => this.setSourceFile(event.target.files[0]);
      input.click();
    }
    setSourceFile(file) {
      [this.sourceBuffer, this.bufferSourceNode] = this.setSourceNode(file, { playbackRate: 1 });
      const fileSplit = file.name.split(".");
      this.audioService.setPaused(false);
      fileSplit.pop();
      this.fileName = fileSplit.join(".");
      this.timer = this.audioService.useAudioContext().currentTime;
      this.run();
    }
    createFileSelectionButton() {
      return el("button").mcls("bg-blue-500", "block", "w-avail", "text-gray-100", "p-2", "pb-1", "hover:bg-blue-600", "transition-all", "ease-in-out", "duration-300", "rounded-sm", "active:bg-blue-700").innerHtml("Select Audio File").evt("click", this.selectMediaFile.bind(this)).get();
    }
    resetCanvasType(contextType) {
      const { canvas, canvasContext } = this.buildCanvas(contextType);
      this.mainDOM.replaceChild(canvas, this.canvas);
      this.canvas = canvas;
      this.canvasContext = canvasContext;
    }
    initializeFpsCounter() {
      return el("div").mcls("absolute", "w-32", "bg-gray-800/40", "top-0", "text-gray-200").innerHtml("0").get();
    }
    onSpiralToggle(event) {
      const particleConfiguration = this.canvasAction.draw.find(({ type }) => type && type === "Particle");
      if (particleConfiguration) {
        particleConfiguration.isSpiral = event.target.checked;
      }
    }
    createCheckBox() {
      const title = constructTitle("Modifiers");
      const panel = createPanelSection(
        title,
        el("div").inners(
          ...createInputTuple("checkbox", "Toggle Spiral", this.onSpiralToggle.bind(this))
        ).get()
      );
      const view = panel.children[2];
      const button = title.children[1];
      el(button).evt("click", (_) => el(view).tcls("collapsed"));
      return panel;
    }
    getAllAttachableViews() {
      return [
        this.buildOptions(),
        this.setSliderContainer("Pitch Factor", this.setSlider("pitch")),
        this.setSliderContainer("Speed Factor", this.setSlider("speed")),
        // this.createCheckBox(),
        this.createAudioPermissionButton(),
        this.createFileSelectionButton()
      ];
    }
    setSourceNode(file, options) {
      if (this.sourceBuffer) {
        this.bufferSourceNode.disconnect();
      }
      let sourceBuffer;
      if (file instanceof File) {
        sourceBuffer = new Audio(URL.createObjectURL(file));
        sourceBuffer.onloadedmetadata = () => this.totalTimer = sourceBuffer.duration;
      } else {
        sourceBuffer = file;
      }
      const bufferSourceNode = this.audioService.useAudioContext().createMediaElementSource(sourceBuffer);
      this.audioService.makeConnection(bufferSourceNode);
      this.offsetTimer = 0;
      bufferSourceNode.mediaElement.play();
      if (options?.playbackRate) {
        bufferSourceNode.mediaElement.playbackRate = options.playbackRate;
      }
      return [sourceBuffer, bufferSourceNode];
    }
    onPlayerPausedOrResumed() {
      if (this.audioService.paused) {
        this.audioService.resume();
      } else {
        this.audioService.pause();
      }
    }
    setSliderContainer(sliderTitle, ...content) {
      const title = constructTitle(sliderTitle);
      const viewDom = el("div").mcls("bg-gray-600/50", "rounded-sm", "p-2", "text-gray-200").inner([
        title,
        el("div").innerHtml("1.0"),
        el("div").mcls("flex", "flex-col").inners(...content)
      ]).get();
      const view = viewDom.children[2];
      const button = title.children[1];
      el(button).evt("click", (_) => el(view).tcls("collapsed"));
      return viewDom;
    }
    setSliderValue(evt) {
      const elem = evt.target;
      const grandParent = elem.parentElement?.parentElement;
      grandParent.children[1].innerHTML = elem.value.toString();
      switch (elem.getAttribute("data-change")) {
        case "pitch":
          this.audioService.changePitchFactor(parseFloat(elem.value));
          break;
        case "speed":
          this.bufferSourceNode.mediaElement.playbackRate = parseFloat(elem.value);
          break;
      }
    }
    setSlider(change) {
      return el("input").attr("type", "range").attr("data-change", change).attr("min", "0.6").attr("max", "1.4").attr("value", "1").attr("step", "0.01").evt("input", this.setSliderValue.bind(this)).get();
    }
    setTitle(canvasContext) {
      canvasContext.font = "bold " + this.fontSize + "px Helvetica Neue";
      canvasContext.fillStyle = this.textColor;
      canvasContext.fillText(`Playing Now:`, 30, 100);
      canvasContext.font = this.fontSize + "px Helvetica Neue";
      canvasContext.fillStyle = this.textColor;
      canvasContext.fillText(
        this.fileName ?? "None (Drag and Drop .mp3/.wav file.)",
        30,
        100 + this.fontSize + 10
      );
      if (this.audioService.audioContext) {
        const timerPos = 100 + this.fontSize + 10;
        canvasContext.font = "300 " + this.fontSize + "px Helvetica Neue";
        canvasContext.fillStyle = this.textColor;
        const time = this.sourceBuffer.currentTime;
        canvasContext.fillText(utility_default.timerSec(time), 30, timerPos + this.fontSize + 10);
        canvasContext.fillStyle = this.backColor;
      }
    }
    getView() {
      return this.mainDOM;
    }
    initializeAudio(...dom) {
      return el("div").mcls("eq", "relative").inners(...dom).get();
    }
    moveSeekbarClick(evt) {
      const time = evt.offsetX / this.seekbarLength * this.totalTimer;
      this.sourceBuffer.currentTime = time;
      if (this.sourceBuffer.paused) {
        this.sourceBuffer.play();
      }
      cancelAnimationFrame(this.seekbarAnimationFrame);
      el(this.seekBarThumb).styleAttr({ width: evt.offsetX + "px" });
      this.requestSeekbarAnimation();
    }
    constructSeekbar() {
      const width = document.documentElement.clientWidth;
      this.seekbarLength = width - 100;
      const seekBarThumb = el("span").mcls("seekbar-thumb", "block", "relative", "bg-gray-100", "rounded-[8px]", "w-2", "h-2", "min-w-2", "min-h-2", "self-center").mcls("transition-all", "duration-[40ms]").get();
      const seekbarDOM = el("div").mcls("seekbar", "absolute", "min-h-12", "rounded-[24px]", "bg-gray-700/40", "flex", "align-center").mcls("backdrop-blur-[5px]", "shadow-md", "transition-shadow", "duration-100", "hover:shadow-lg").styleAttr({
        bottom: "50px",
        left: "50px"
      }).inner([
        el("div").mcls("tracker", "bg-gray-400/60", "w-avail", "max-h-2", "min-h-2", "self-center", "rounded-md", "mx-4", "flex").mcls("cursor-pointer").inner([seekBarThumb]).evt("click", this.moveSeekbarClick.bind(this))
      ]).get();
      return [seekBarThumb, seekbarDOM];
    }
    onOptionSelected(event) {
      const target = event.target;
      const type = target.getAttribute("data-type");
      if (type !== this.currentMode) {
        cancelAnimationFrame(this.animationFrame);
        this.changeMode(type);
      }
    }
    onEqStyleSelected(event) {
      const target = event.target;
      const type = target.getAttribute("data-type");
      if (type !== this.lineType) {
        cancelAnimationFrame(this.animationFrame);
        this.lineType = type;
        this.changeMode(this.currentMode);
      }
    }
    constructOptions() {
      return el("div").mcls("options", "flex", "flex-col").inner(
        ["Bar", "Bar Mirrored", "Bar Circle", "Wave Circle", "Circle Spike", "Wave"].map(
          (type) => el("button").mcls("border-0", "transition-all", "duration-300", "ease-in-out", "hover:bg-gray-100/30", "rounded-[3px]").mcls("text-gray-100", "p-2").attr("data-type", type).evt("click", this.onOptionSelected.bind(this)).innerText(type).get()
        )
      ).get();
    }
    buildOptions() {
      const styleDom = constructTitle("Visualizer Type");
      const eqVisualizerOptions = createPanelSection(styleDom, this.constructOptions());
      const list = eqVisualizerOptions.children[1];
      const button = styleDom.children[1];
      el(button).evt("click", (_) => el(list).tcls("collapsed"));
      return eqVisualizerOptions;
    }
    resetOffscreenCanvas(offCanvas, canvasContext) {
      offCanvas.width = document.documentElement.clientWidth;
      offCanvas.height = document.documentElement.clientHeight;
      this.resetCanvas(canvasContext);
    }
    resetCanvas(canvasContext) {
      this.width = document.documentElement.clientWidth;
      this.height = document.documentElement.clientHeight;
      canvasContext.fillStyle = this.backColor;
      canvasContext.fillRect(0, 0, this.width, this.height);
      if (!(canvasContext instanceof OffscreenCanvasRenderingContext2D)) {
        this.setTitle(canvasContext);
      }
      canvasContext.strokeStyle = this.textColor;
    }
    buildCanvas(contextType = "2d") {
      this.width = document.documentElement.clientWidth;
      this.height = document.documentElement.clientHeight;
      const canvas = el("canvas").mcls("wave").attr("width", this.width.toString()).attr("height", this.height.toString()).get();
      const canvasContext = canvas.getContext(contextType);
      return { canvas, canvasContext };
    }
    initializeAnalyzerWave() {
      if (this.analyser) {
        this.analyser.disconnect();
      }
      this.fftSize = 16384;
      const analyser = this.audioService.useAudioContext().createAnalyser();
      analyser.fftSize = this.fftSize;
      this.bufferLength = analyser.frequencyBinCount;
      this.buffer = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(this.buffer);
      this.audioService.connectAudioWorkletNodeTo(analyser);
      return analyser;
    }
    setBufferSize() {
      const frequency = this.audioService.useAudioContext().sampleRate / 2;
      return frequency / this.bufferLength;
    }
    initializeAnalyzerBar() {
      if (this.analyser) {
        this.analyser.disconnect();
      }
      this.fftSize = 4096;
      const analyser = this.audioService.useAudioContext().createAnalyser();
      analyser.fftSize = this.fftSize;
      this.bufferLength = analyser.frequencyBinCount;
      this.frequencyBuffer = new Float32Array(analyser.frequencyBinCount);
      this.frequencyIncr = this.setBufferSize();
      analyser.getFloatFrequencyData(this.frequencyBuffer);
      this.audioService.connectAudioWorkletNodeTo(analyser);
      return analyser;
    }
    setFps() {
      const currentTimer = performance.now();
      el(this.fps).innerHtml(`${Math.round(1e3 / (currentTimer - this.prevTimer))} FPS`);
      this.prevTimer = currentTimer;
    }
    setResize() {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      this.seekbarLength = width - 100;
      this.canvasAction.draw.forEach((config) => config.resize(width, height));
      el(this.canvas).mcls("wave").attr("width", width.toString()).attr("height", height.toString()).get();
      this.offscreenCanvas.width = width;
      this.offscreenCanvas.height = height;
      this.width = width;
      this.height = height;
      this.resetCanvas(this.canvasContext);
    }
    moveSeekbar() {
      const currentTime = this.sourceBuffer.currentTime;
      const position = currentTime / this.totalTimer * this.seekbarLength;
      el(this.seekBarThumb).styleAttr({ width: position + "px" });
    }
    seekbarAnimation() {
      this.moveSeekbar();
    }
    requestSeekbarAnimation() {
      this.seekbarAnimation();
      this.seekbarAnimationFrame = requestAnimationFrame(this.requestSeekbarAnimation.bind(this));
      return this.seekbarAnimationFrame;
    }
    requestAnimation() {
      this.setFps();
      if (this.canvas.width !== document.documentElement.clientWidth || this.canvas.height !== document.documentElement.clientHeight) {
        this.setResize();
      }
      this.resetCanvas(this.canvasContext);
      this.resetCanvas(this.offContext);
      this.setTitle(this.offContext);
      applyTransformation(this.offContext, this.canvasAction.draw);
      this.canvasContext.drawImage(this.offscreenCanvas, 0, 0);
      this.canvasContext.stroke();
      this.animationFrame = requestAnimationFrame(this.requestAnimation.bind(this));
      return this.animationFrame;
    }
    changeMode(mode) {
      this.currentMode = mode;
      const addOrInsert = (canvasAction, value) => {
        const index = canvasAction.draw.findIndex(({ drawKind }) => drawKind === "eq");
        if (index > -1) {
          canvasAction.draw[index] = value;
        } else {
          canvasAction.draw.push(value);
        }
      };
      switch (this.currentMode) {
        case "Bar":
        case "Bar Mirrored": {
          this.analyser = this.initializeAnalyzerBar();
          const value = Object.assign(createOptionsForBar(this.frequencyIncr, this.currentMode === "Bar Mirrored"), {
            isReflective: true,
            drawKind: "eq",
            analyser: this.analyser,
            buffer: this.frequencyBuffer,
            width: this.width,
            height: this.height
          });
          addOrInsert(this.canvasAction, value);
          break;
        }
        case "Wave": {
          this.analyser = this.initializeAnalyzerWave();
          const value = Object.assign(createOptionsForWave(), {
            drawKind: "eq",
            analyser: this.analyser,
            buffer: this.buffer,
            width: this.width,
            height: this.height
          });
          addOrInsert(this.canvasAction, value);
          break;
        }
        case "Wave Circle":
        case "Circle Spike": {
          this.analyser = this.initializeAnalyzerBar();
          const value = Object.assign(createOptionsForWaveCircle(this.frequencyIncr, this.currentMode === "Circle Spike"), {
            drawKind: "eq",
            analyser: this.analyser,
            buffer: this.frequencyBuffer
          });
          addOrInsert(this.canvasAction, value);
          break;
        }
        case "Bar Circle":
        case "Bar Circle Mirrored": {
          this.analyser = this.initializeAnalyzerBar();
          const value = Object.assign(createBarCircleEq(this.frequencyIncr, this.currentMode === "Bar Circle Mirrored"), {
            drawKind: "eq",
            analyser: this.analyser,
            buffer: this.frequencyBuffer
          });
          addOrInsert(this.canvasAction, value);
          break;
        }
        default:
          break;
      }
      this.run();
    }
    run() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        cancelAnimationFrame(this.seekbarAnimationFrame);
      }
      if (!this.audioService.isPaused()) {
        this.requestSeekbarAnimation();
        return this.requestAnimation();
      }
      return 0;
    }
  };

  // src/index.ts
  function theme() {
    if (localStorage.theme === "dark" || !("theme" in localStorage) && window.matchMedia && window?.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
  }
  window.onload = async () => {
    theme();
    const wasmFile = await fetch("./wasm_fft_bg.wasm");
    const wasmBin = await wasmFile.arrayBuffer();
    var subscriber = new Subscriber();
    subscriber.createSubscription("onbodyload");
    var globalAudioService = new GlobalAudioService(subscriber, wasmBin);
    let canvasThemeSelector = new CanvasThemeSelectorView(subscriber);
    let window2 = new WindowView(globalAudioService, subscriber);
    let panelView = new PanelView(subscriber);
    panelView.attachViews(window2.getAllAttachableViews());
    panelView.attachViews(canvasThemeSelector.getAllAttachableViews());
    const dropHandler = (event) => {
      event.preventDefault();
      if (event.dataTransfer?.files) {
        const file = event.dataTransfer.files[0];
        window2.setSourceFile(file);
      }
    };
    const onDragOver = (event) => {
      event.preventDefault();
    };
    const setResize = (_) => {
      window2.setResize();
    };
    const content = el("div").mcls("main-content").inner([window2.getView(), panelView.getView()]).evt("drop", dropHandler).evt("dragover", onDragOver).get();
    const player = (evt) => {
      switch (evt.code) {
        case "Space":
          evt.preventDefault();
          evt.stopPropagation();
          window2.onPlayerPausedOrResumed();
          break;
      }
    };
    const keyUp = (evt) => {
      switch (evt.code) {
        case "ControlLeft":
          el(panelView.getView()).tcls("hidden");
          break;
      }
    };
    window.addEventListener("resize", (evt) => setResize(evt));
    el(document.body).mcls("w-avail", "h-avail").evt("keydown", player).evt("keyup", keyUp).evt("dragover", onDragOver).evt("drop", dropHandler).evt("resize", setResize).inner([
      el("div").mcls("application", "flex", "flex-col").inners(content).get()
    ]);
    subscriber.fire("onbodyload");
  };
})();

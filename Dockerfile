FROM ubuntu

RUN apt-get update
RUN apt-get install rustup -y
RUN apt-get install npm -y

WORKDIR /opt/app

COPY . /opt/app

RUN echo $HOME

RUN rustup default stable && cargo install wasm-pack \
    && cd /opt/app/wasm-eq-visualizer && $HOME/.cargo/bin/wasm-pack build --target web \
    && cd /opt/app/wasm-fft && $HOME/.cargo/bin/wasm-pack build --target web \
    && cd /opt/app && npm i

CMD ["npm", "run", "build"]


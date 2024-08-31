FROM ubuntu

RUN apt-get update
RUN apt-get install rustup -y
RUN apt-get install npm -y
RUN apt-get install openssh-server -y

WORKDIR /opt/app

COPY . /opt/app

RUN mkdir /opt/app/dist

RUN mkdir -p /root/.ssh
RUN chmod -R 600 /root/.ssh/

RUN ssh-keyscan github.com >>/root/.ssh/known_hosts

RUN rustup default stable && cargo install wasm-pack \
    && cd /opt/app/wasm-eq-visualizer && $HOME/.cargo/bin/wasm-pack build --target web \
    && cd /opt/app/wasm-fft && $HOME/.cargo/bin/wasm-pack build --target web \
    && cd /opt/app && npm i

CMD ["npm", "run", "build"]


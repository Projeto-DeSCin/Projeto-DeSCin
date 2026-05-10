FROM debian:bookworm-slim AS builder

RUN apt-get update && apt-get install -y \
    build-essential cmake git \
    libboost-all-dev libssl-dev \
    libasio-dev \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/CrowCpp/Crow.git /crow

WORKDIR /app
COPY . .

RUN cmake -B build \
    -DCMAKE_BUILD_TYPE=Release \
    && cmake --build build --config Release --target descin_api

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y \
    libboost-system1.81.0 libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/build/descin_api .

EXPOSE 8080
CMD ["./descin_api"]
# Performance Monitoring and Testing

## Requirements

1. Docker

2. NPM

3. K6

## How To Run Application

1. Jalankan npm install

2. Jalankan ./up.sh pada terminal Bash

3. Set Up Environment Pribadi

## How To Open Monitoring Tools

1. Grafana pada localhost:3000 (username: admin, password: admin)

2. Prometheus pada localhost:9090

## How To Run Test

1. Pindah directory ke testing 
>>> cd testing
2. Pilih Script (smoke_test.js/spike_test.js/stress_test.js/load_test.js)
>>> k6 run [script_name].js

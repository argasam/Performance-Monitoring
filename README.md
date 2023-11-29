# tubes-apks-2023

#Requirements

#1. Docker

#2. NPM

#Cara Penggunaan

#1. Jalankan npm install

#2. Jalankan ./up.sh pada terminal Bash

## Running Test

#1. >>>cd testing

#2. >>>k6 run --out influxdb=http:localhost:8086 [smoke_test/spike_test/load_test/stress_test].js (Pilih salah satu jenis test)

#3. Buka Grafana pada localhost:3000 > dahsboard > k6 Load Testing > Set Timeline sesuai dengan Waktu Pengujian 

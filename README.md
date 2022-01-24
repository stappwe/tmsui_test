## Github

### Repository

https://github.com/stappwe/tmsui_test.git

### Setup

Create or send use github username or email of your github.com account to allow you to push to the project

Note: you can create a free account on github.com

## Development server

### Prerequestes and setup

NodeJS 12.x download NodeJS 12.x MAX is required and minimum 12.20.1 is required

#### Mock-back-end - setup and start

From: tmsui_test/mock-back-end location:
npm install

npm run start:dev

#### Front-end - setup and start

From: tmsui_test location:
npm install
npm run build:lib

npm run start:tms:vm

http://localhost:4207/#/tms/other/administration/administrator/project/list

## Test

### Running end-to-end tests

#### Install on pc

npm i -d @playwright/test
npm install playwright

#### Test - running

npm run e2e-simple

Note: e2e test, see tms-e2e

##### Report

npm run e2e-report

## Issues

### download issue on EC network

git config --global http.proxy http://username:password@psbru-vip-acc-user.snmc.cec.eu.int:8012


















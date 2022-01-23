<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

### one time installation on IIS if iisnode is not available

1. install iisnode: https://github.com/azure/iisnode/wiki/iisnode-releases
2. install url rewrite: https://www.iis.net/downloads/microsoft/url-rewrite
   rewrite instruction itself is already available in the web.config (from the code)
3. check if the backend is running: 
   Open page: http://near-vm4dev09/backend
   Result: Hello world!   
   In case of "HTTP reason: Internal Server Error", add write permission for the IIS_IUser on the backend folder

#### Installation issues

When getting the error below:
(node:8416) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues. Please use the Buffer.alloc(), Buffer.allocUnsafe(), or Buffer.from() methods instead.

Update iisnode.yml in the root of the project and set the line below
nodeProcessCommandLine: "C:\Program Files\node\node.exe" --no-deprecation --no-warnings

further details, see:
https://stackoverflow.com/questions/49380280/depreciation-warning-does-not-allow-deploying-an-application-on-azure/53402712#53402712

Additional, on localIIS, see that port is directly taken from process.env.PORT. Why? But solve the issue 500.1001 error

## Running and debugging local

### first time

Perform npm install

### only running

For just running the backend execute: npm run start:dev

### debugging

Execute the npm script from your IDE:
- name 
- package.json: D:\TMS_Master\TMSUI\mock-back-end\package.json
- command: run
- scripts: start:dev


## Release on local IIS

1. Build project: npm run build:localIIS
2. Deploy the content of the folder dist_localIIS on the folder C:\inetpub\wwwroot\backend 
3. Perform npm install (in case of changes to the node_modules)  
3. check if the backend is running: 
   Open page: http://near-vm4dev09
   Result: Hello world!


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](LICENSE).

## Other changes

To resolve compilation bugs (TS6200...), added the line below to the tsconfig.json. Specify to use only the node_modules inside the mock-back-end 

"typeRoots": ["/node_modules/@types"]

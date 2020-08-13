# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.7](https://github.com/Math1987/enigmabackend/compare/v0.0.6...v0.0.7) (2020-08-13)


### Features

* add calculation ([8e95ef0](https://github.com/Math1987/enigmabackend/commit/8e95ef0a86a4d348c81d197b479cbf4f3dc5b8a2))
* add data mobile system for creation and read position of mobile objects as players. Use it to send back datas in getViews request ([4823d4c](https://github.com/Math1987/enigmabackend/commit/4823d4cb17dadf60bda587b80637efd6fa9b42ae))
* add node-localstorage for datas as world, create getView function in user to send drawables ([aaef3f8](https://github.com/Math1987/enigmabackend/commit/aaef3f8de68f43ce9a53f6d2a32a785f11ecc2b5))
* create deplacement ([a9869ed](https://github.com/Math1987/enigmabackend/commit/a9869edd707781a41aa06b13923ea88fd3d257e5))
* finalize attack with repops with pattern if killed ([5eb2b0c](https://github.com/Math1987/enigmabackend/commit/5eb2b0c29786298946fe0f6e2f342f384e04efd8))
* finalize implement attack ([2ed0006](https://github.com/Math1987/enigmabackend/commit/2ed0006aee84c9751417142bdfb2c95a8e1800c0))
* implement pattern system ([d8b87dd](https://github.com/Math1987/enigmabackend/commit/d8b87dd9e9f89294d1d4d969a13bdf9c961c77bc))
* use controllers for chara, end move function for players (need clean and comments) ([e598362](https://github.com/Math1987/enigmabackend/commit/e5983627876603f360b4dabf0aae48ee609c4582))


### Bug Fixes

* add name in mobile instead of player (all mobiles values can be shared for every players) ([cab07b7](https://github.com/Math1987/enigmabackend/commit/cab07b75fc3c27382405d402d6eab8f2080b6aba))
* update addSkillFunction with obj value instead of array, update getChara in https request puting alswow player's value (as race, religion etc...) in chara object ([8d42f34](https://github.com/Math1987/enigmabackend/commit/8d42f34b47a812717c9a6428e5eff2529ad703e1))

### [0.0.6](https://github.com/Math1987/enigmabackend/compare/v0.0.5...v0.0.6) (2020-07-17)


### Features

* create Ãmeta.datas & meta.service with sexes, religions, races ([e28883f](https://github.com/Math1987/enigmabackend/commit/e28883fd5085b9bac6d7fde4da54a55e123a00df))
* implement addValue route & dbÃ ([3e9b9ea](https://github.com/Math1987/enigmabackend/commit/3e9b9ea53e06d84cd9b56fb63efbe95e99d00f8a))
* newToken route created in api.routes.ts with worldName added if exist => correction of bad connection when create new character ([942f685](https://github.com/Math1987/enigmabackend/commit/942f6853f74d266e2ca7e82c0e23a9cc523fe40a))

### [0.0.5](https://github.com/Math1987/enigmabackend/compare/v0.0.4...v0.0.5) (2020-05-30)

### [0.0.4](https://github.com/Math1987/enigmabackend/compare/v0.0.3...v0.0.4) (2020-05-27)


### Features

* create separated db for account global users and worlds. Each world will got him own db ([31b0010](https://github.com/Math1987/enigmabackend/commit/31b001094b3fbb716eacfefba37b7114c4bfe737))


### Bug Fixes

* finaly use one db for all game, with global tables, and world's tables containing world's name in definition ([5b73979](https://github.com/Math1987/enigmabackend/commit/5b73979d7f92b6848c6c6b874beee14a1cd638bf))

### [0.0.3](https://github.com/Math1987/enigmabackend/compare/v0.0.2...v0.0.3) (2020-05-25)


### Features

* implement jwt ([2671d9f](https://github.com/Math1987/enigmabackend/commit/2671d9fecfc5e322d24aa62afd12697e2a223193))
* set security system using jwt, clean code and comment ([3020b47](https://github.com/Math1987/enigmabackend/commit/3020b47e9034abf239d993f0acb72ab347da7f85))

### 0.0.2 (2020-05-18)


### Features

* create data.ts obj using mysqljs, https.handler.ts ([c0dca30](https://github.com/Math1987/enigmabackend/commit/c0dca30af018981baabd9289846c4db7d736c313))

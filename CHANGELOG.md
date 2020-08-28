# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.10](https://github.com/Math1987/enigmabackend/compare/v0.0.9...v0.0.10) (2020-08-28)


### Features

* add sendToSocketId function, used in pattern when a chara die ([e094ca4](https://github.com/Math1987/enigmabackend/commit/e094ca4637d48234118cd6292ed7e3dc202e260b))
* add values in metadatas (and valuesPatterns), as desert, attack, grounds ([b01b3de](https://github.com/Math1987/enigmabackend/commit/b01b3de1ccbd18f210912d5ebe489cae6113a6b0))
* historic ([a65d668](https://github.com/Math1987/enigmabackend/commit/a65d66823dd9c9d8668a7ff3013b7ab2b276109c))
* implement node-cron for passing eatch day ([a8f96ef](https://github.com/Math1987/enigmabackend/commit/a8f96efac8d896add99102ac73eb7196cb0318e1))
* rank_kill ([c49e190](https://github.com/Math1987/enigmabackend/commit/c49e1909d750e68eada43e2afc070358f697460d))


### Bug Fixes

* add free boolean in pattern's move function (to allow move without move cost if free is true) ([b292705](https://github.com/Math1987/enigmabackend/commit/b292705eb53171a93de3c940999e883d28dfbfcd))
* historic ([51a0a4d](https://github.com/Math1987/enigmabackend/commit/51a0a4d73c2004cc1af5fdaec22f7e3507ab3840))
* kill.data for rank, chara pattern for attack (die callback upgreat kill rank) ([b31ce51](https://github.com/Math1987/enigmabackend/commit/b31ce5107366df8c5f123e81e272306b4243f1e7))
* rank_kill.data, sort array ([028502b](https://github.com/Math1987/enigmabackend/commit/028502b9137d6f9c27a698aef81aebc201503729))
* restore move cost, add cost, counter attack ([29b5a98](https://github.com/Math1987/enigmabackend/commit/29b5a98c90b7a41b4316ca7bf370556e25d1fea3))
* send chara in chara creation instead of mysql res ([555e924](https://github.com/Math1987/enigmabackend/commit/555e9240cbe47d75b829af663541852d90829467))
* use array instead of obj in historic data response ([84f3431](https://github.com/Math1987/enigmabackend/commit/84f3431533135dd9d597a0bcddcf1aabf07462ec))

### [0.0.9](https://github.com/Math1987/enigmabackend/compare/v0.0.8...v0.0.9) (2020-08-24)


### Features

* add pass round using patterns ([94de4f8](https://github.com/Math1987/enigmabackend/commit/94de4f8e0d4e6e89cb379729915bd87ce10baa6d))
* add rank, kill ([ce306bc](https://github.com/Math1987/enigmabackend/commit/ce306bc5ba6fb5b4cf1f63931c19db60736f63a2))

### [0.0.8](https://github.com/Math1987/enigmabackend/compare/v0.0.7...v0.0.8) (2020-08-23)


### Bug Fixes

* correct chara creation using pattern ([0542ce4](https://github.com/Math1987/enigmabackend/commit/0542ce41d1a041a3b9fd5ccfd00eb8c1bc0974f5))

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

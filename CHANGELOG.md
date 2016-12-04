<a name="0.11.0"></a>
# [0.11.0](https://github.com/davinkevin/AngularStompDK/compare/v0.10.0...v0.11.0) (2016-12-04)


### Features

* **connection:** support header during connection ([3484a8c](https://github.com/davinkevin/AngularStompDK/commit/3484a8c)), closes [#47](https://github.com/davinkevin/AngularStompDK/issues/47)



<a name="0.10.0"></a>
# [0.10.0](https://github.com/davinkevin/AngularStompDK/compare/v0.9.3...v0.10.0) (2016-08-29)


### Features

* **config:** being able to configure the credentials / url after angular#config phase ([44692c0](https://github.com/davinkevin/AngularStompDK/commit/44692c0)), closes [#44](https://github.com/davinkevin/AngularStompDK/issues/44)



<a name="0.9.3"></a>
## [0.9.3](https://github.com/davinkevin/AngularStompDK/compare/v0.9.2...v0.9.3) (2016-07-04)


### Features

* **connectionState:** The state of the connection can be accessed by the promise on the ngStomp servic ([7d0e74e](https://github.com/davinkevin/AngularStompDK/commit/7d0e74e))



<a name="0.9.2"></a>
## [0.9.2](https://github.com/davinkevin/AngularStompDK/compare/v0.9.1...v0.9.2) (2016-06-28)


### Bug Fixes

* **subscription:** add missing digest parameter ([a0dcb8a](https://github.com/davinkevin/AngularStompDK/commit/a0dcb8a))



<a name="0.9.1"></a>
## [0.9.1](https://github.com/davinkevin/AngularStompDK/compare/v0.9.0...v0.9.1) (2016-06-27)


### Bug Fixes

* **builder:** define $scope to undefined to fallback on $rootScope ([967d919](https://github.com/davinkevin/AngularStompDK/commit/967d919)), closes [#39](https://github.com/davinkevin/AngularStompDK/issues/39)



<a name="0.9.0"></a>
# [0.9.0](https://github.com/davinkevin/AngularStompDK/compare/v0.8.6...v0.9.0) (2016-06-27)


### Features

* **$digest:** possibility to disable automatic digest cycle after a reception of data ([dbec917](https://github.com/davinkevin/AngularStompDK/commit/dbec917)), closes [#36](https://github.com/davinkevin/AngularStompDK/issues/36)



<a name="0.8.6"></a>
## [0.8.6](https://github.com/davinkevin/AngularStompDK/compare/v0.8.5...v0.8.6) (2016-06-25)


### Bug Fixes

* **subscription:** Lost subscriptions when first connection attempt failed ([a9037df](https://github.com/davinkevin/AngularStompDK/commit/a9037df)), closes [#38](https://github.com/davinkevin/AngularStompDK/issues/38)

### Performance Improvements

* **$digest:** reduce digest cycle and remove call to private method of angular ([3dc3541](https://github.com/davinkevin/AngularStompDK/commit/3dc3541))



<a name="0.8.5"></a>
## [0.8.5](https://github.com/davinkevin/AngularStompDK/compare/v0.8.4...v0.8.5) (2016-06-19)


### Bug Fixes

* **unSubscriber:** correction on queue unSubscription ([2194a86](https://github.com/davinkevin/AngularStompDK/commit/2194a86))



<a name="0.8.4"></a>
## [0.8.4](https://github.com/davinkevin/AngularStompDK/compare/v0.8.2...v0.8.4) (2016-06-18)


### Features

* **reconnection:** disable auto re-connection system if a tiemOut value is less than 0 ([cde3089](https://github.com/davinkevin/AngularStompDK/commit/cde3089))



<a name="0.8.2"></a>
## [0.8.2](https://github.com/davinkevin/AngularStompDK/compare/v0.8.1...v0.8.2) (2016-03-03)


### Bug Fixes

* **reconnect:** fix doubling connections after reconnect ([dda7542](https://github.com/davinkevin/AngularStompDK/commit/dda7542))



<a name="0.8.1"></a>
## [0.8.1](https://github.com/davinkevin/AngularStompDK/compare/v0.8.0...v0.8.1) (2016-02-21)


### Bug Fixes

* **codeclimate:** fix some issue ([15e5292](https://github.com/davinkevin/AngularStompDK/commit/15e5292))
* **injection:** change injection of ngAnnotate and not minified with annotation ([12de8c9](https://github.com/davinkevin/AngularStompDK/commit/12de8c9))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/davinkevin/AngularStompDK/compare/v0.7.0...v0.8.0) (2016-01-14)


### Bug Fixes

* **unSubscribe:** don't remove connections if unRegistration from position ([1278bbe](https://github.com/davinkevin/AngularStompDK/commit/1278bbe))
* **unSubscribe:** remove connection based on index attribute to prevent mis-organisation in the ar ([1b04d67](https://github.com/davinkevin/AngularStompDK/commit/1b04d67))
* **unsubscriber:** change case of import ([c63a8d4](https://github.com/davinkevin/AngularStompDK/commit/c63a8d4))

### Features

* **unsubscriber:** allow to unsubscribe each subscription individually ([ca6115f](https://github.com/davinkevin/AngularStompDK/commit/ca6115f))

### Performance Improvements

* **service:** remove usage of set because two subscription can append to the same topic ([9898775](https://github.com/davinkevin/AngularStompDK/commit/9898775))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/davinkevin/AngularStompDK/compare/v0.6.2...v0.7.0) (2016-01-09)


### Features

* **license:** add Apache License ([907e4c8](https://github.com/davinkevin/AngularStompDK/commit/907e4c8))
* **readme:** add better description and let only the builder pattern to subscribe ([4e9730d](https://github.com/davinkevin/AngularStompDK/commit/4e9730d))
* **service:** support auto-conversion in JSON of message body ([ed543f2](https://github.com/davinkevin/AngularStompDK/commit/ed543f2))



<a name="0.6.2"></a>
## [0.6.2](https://github.com/davinkevin/AngularStompDK/compare/v0.6.1...v0.6.2) (2016-01-03)


### Features

* **bower:** add bower.json file to brought back bower support (sorry for that...) ([df533a5](https://github.com/davinkevin/AngularStompDK/commit/df533a5))



<a name="0.6.2"></a>
## [0.6.2](https://github.com/davinkevin/AngularStompDK/compare/v0.6.1...v0.6.2) (2016-01-03)


### Features

* **bower:** add bower.json file to brought back bower support (sorry for that...) ([df533a5](https://github.com/davinkevin/AngularStompDK/commit/df533a5))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/davinkevin/AngularStompDK/compare/v0.6.0...v0.6.1) (2016-01-02)


### Features

* **re-connection:** allow configuration to trigger re-connection every X seconds ([6ce93b0](https://github.com/davinkevin/AngularStompDK/commit/6ce93b0))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/davinkevin/AngularStompDK/compare/v0.5.2...v0.6.0) (2016-01-01)


### Features

* **re-connection:** automatically reconnect if connection lost ([06efc8e](https://github.com/davinkevin/AngularStompDK/commit/06efc8e)), closes [#13](https://github.com/davinkevin/AngularStompDK/issues/13)



<a name="0.5.2"></a>
## [0.5.2](https://github.com/davinkevin/AngularStompDK/compare/v0.5.1...v0.5.2) (2016-01-01)


### Bug Fixes

* **build:** change name of global value for es5 build ([70f0625](https://github.com/davinkevin/AngularStompDK/commit/70f0625))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/davinkevin/AngularStompDK/compare/v0.5.0...v0.5.1) (2015-12-31)


### Bug Fixes

* **build:** change variable of folder name ([a0fc905](https://github.com/davinkevin/AngularStompDK/commit/a0fc905))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/davinkevin/AngularStompDK/compare/v0.4.1...v0.5.0) (2015-12-31)


### Features

* **changelog:** add changelog to master ([13bb344](https://github.com/davinkevin/AngularStompDK/commit/13bb344))
* **readme:** update location of file in es6 configuraiton ([df51c4e](https://github.com/davinkevin/AngularStompDK/commit/df51c4e))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/davinkevin/AngularStompDK/compare/v0.3.4...v0.4.0) (2015-12-27)


### Bug Fixes

* **package.json:** fix syntax in file ([c5a002f](https://github.com/davinkevin/AngularStompDK/commit/c5a002f))



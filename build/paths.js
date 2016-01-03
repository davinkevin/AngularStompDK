
import path from 'path';

/* All constant and location of the application */
const appName = 'angular-stomp';
const srcDirName = 'core';
const releaseDirName = 'dist';
const root = path.dirname(__dirname);

export default {
  root : root,
  systemConfigJs : `${srcDirName}/config.js`,
  packageJson : `${root}/package.json`,
  bowerJson : `${root}/bower.json`,
  changeLog : `${root}/CHANGELOG.md`,
  srcDir: `${root}/${srcDirName}`,
  releaseDir: `${root}/${releaseDirName}`,
  release : {
    root : `${root}/${releaseDirName}`
  },
  releaseDirName: releaseDirName,
  app: {
    entryPoint : `${srcDirName}/ngStomp.js`,
    name: appName
  },
  glob: {
    js : `${root}/${srcDirName}/${appName}/**/!(*.spec).js`
  },
  coverage : {
    lcovfile : 'reports/coverage/phantomjs/lcov.info'
  }
}

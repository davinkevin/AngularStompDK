
import path from 'path';

/* All constant and location of the application */
const appName = 'AngularStompDK';
const srcDirName = 'public';
const releaseDirName = 'dist';
const root = path.dirname(__dirname);

export default {
  root : root,
  systemConfigJs : `${srcDirName}/config.js`,
  packageJson : `${root}/package.json`,
  changeLog : `${root}/CHANGELOG.md`,
  srcDir: `${root}/${srcDirName}`,
  releaseDir: `${root}/${releaseDirName}`,
  release : {
    root : `${root}/${releaseDirName}`
  },
  releaseDirName: releaseDirName,
  app: {
    entryPoint : `app/angular-stomp.js`,
    name: appName
  },
  glob: {
    js : `${root}/${srcDirName}/${appName}/**/!(*.spec).js`
  },
  coverage : {
    lcovfile : 'reports/coverage/phantomjs/lcov.info'
  }
}

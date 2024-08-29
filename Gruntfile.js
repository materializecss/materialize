module.exports = function (grunt) {
  grunt.initConfig({
    jasmine: {
      components: {
        src: ['dist/js/materialize.js'],
        options: {
          styles: 'dist/css/materialize.css',
          specs: 'tests/spec/**/*Spec.js',
          helpers: 'tests/spec/helper.js',
          keepRunner: true,
          page: {
            viewportSize: {
              width: 1400,
              height: 735
            }
          },
          sandboxArgs: {
            args: ['--no-sandbox'],
            headless: 'new'
          }
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 9001,
          protocol: 'http'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('test', ['connect', 'jasmine']);
};

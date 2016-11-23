var rucksack = require('rucksack-css')
var lost = require("lost")
var cssnext = require("postcss-cssnext")
import Shell from 'child_process'

function postBuild(pages, callback) {
  Shell.execSync("cp -r ./static/manifest.json public/")
  callback()
}

export { postBuild }

exports.modifyWebpackConfig = function(config, env) {
    config.merge({
        postcss: [
            lost(),
            rucksack(),
            cssnext({
                browsers: ['>1%', 'last 2 versions']
            })
        ]
    })

    config.loader('svg', {
       test: /\.(svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
       loader: 'file-loader',
    })

    return config
};

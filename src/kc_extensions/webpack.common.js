/**
 Copyright 2022 Rob Royce

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

const path = require('path');

let webpack_config =
    {
        entry: {
            chrome: path.join(__dirname, 'src', 'chrome.ts'),
            firefox: path.join(__dirname, 'src', 'firefox.ts')
        },
        module: {
            rules: [{
                test: /\.ts$/, // This particular rule matches all .ts files
                use: [{loader: 'ts-loader'}] // Which loader to use when the rule matches
            }]
        },
        output: {
            path: path.join(process.cwd(), 'dist'), // all output files are placed here
            filename: '[name].js' // Primary output bundle
        },
        externals: {
            // NOTE: this had to be added after manually installing Chokidar 3.5
            // NOTE: https://github.com/yan-foto/electron-reload/issues/71
            fsevents: "require('fsevents')"
        },
        resolve: {
            extensions: ['.ts', '.js', '.json', '.html', '.css']
        },
        plugins: [],
    };

module.exports = webpack_config;
/**
 * Copyright 2018 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {writeScript} from './3p';
import {user} from '../src/log';

/**
 * Get the correct script for the mathml formula.
 *
 * Use writeScript: Failed to execute 'write' on 'Document': It isn't possible
 * to write into a document from an asynchronously-loaded external script unless
 * it is explicitly opened.
 *
 * @param {!Window} global
 * @param {string} scriptSource The source of the script, different for post and comment embeds.
 */
function getMathmlJs(global, scriptSource, cb) {
 writeScript(global, scriptSource, function() {
   cb(global.MathJax);
  });
}

/**
 * @param {!Window} global
 * @param {!Object} data
 */
export function mathml(global, data) {
  user().assert(
      data.formula,
      'The formula attribute is required for <amp-mathml> %s',
      data.element);

  getMathmlJs(
    global,
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML',
    function() {
      // Dimensions are given by the parent frame.
      delete data.width;
      delete data.height;
      const div = document.createElement('div');
      div.setAttribute('id','mathmlformula');
      div.innerHTML = data.formula;
      document.body.appendChild(div);
      MathJax.Hub.Queue( function () {
        const rendered = document.getElementById('MathJax-Element-1-Frame');
        context.requestResize(
                rendered./*OK*/offsetWidth + 20,
                rendered./*OK*/offsetHeight + 20
            );
      } );

    }
  );
}

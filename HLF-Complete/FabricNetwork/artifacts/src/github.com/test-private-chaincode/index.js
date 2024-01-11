/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const testPrivateCC = require('./lib/testPrivateCC');

module.exports.TestPrivateCC = testPrivateCC;
module.exports.contracts = [testPrivateCC];

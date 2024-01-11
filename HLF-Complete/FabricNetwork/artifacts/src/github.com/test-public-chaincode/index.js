/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const testPublicCC = require('./lib/testPublicCC');

module.exports.TestPublicCC = testPublicCC;
module.exports.contracts = [testPublicCC];

/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const expect = require('expect');
const {INIT_CATALOG} = require('../../actions/catalog');
const {SET_CONTROL_PROPERTY} = require('../../actions/controls');
const { loginSuccess, logout, logoutWithReload} = require('../../actions/security');
const { initCatalogOnLoginOutEpic, promtLoginOnMapError, reloadMapConfig} = require('../login');
const {configureError} = require('../../actions/config');


const {testEpic} = require('./epicTestUtils');

describe('login Epics', () => {
    it('init catalog on login', (done) => {
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            const action = actions[0];
            expect(action.type).toBe(INIT_CATALOG);
            done();
        };
        testEpic(initCatalogOnLoginOutEpic, 1, loginSuccess(), epicResult, {});
    });
    it('keeps map changes on login', (done) => {
        const epicResult = actions => {
            expect(actions.length).toBe(0);
            done();
        };
        testEpic(reloadMapConfig, 0, loginSuccess(), epicResult, {});
    });
    it('removes unsaved map changes on logout', (done) => {
        const epicResult = actions => {
            expect(actions.length).toBe(0);
            done();
        };
        testEpic(reloadMapConfig, 0, logoutWithReload(), epicResult, {});
    });

    it('init catalog on logout', (done) => {
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            const action = actions[0];
            expect(action.type).toBe(INIT_CATALOG);
            done();
        };
        testEpic(initCatalogOnLoginOutEpic, 1, logout(), epicResult, {});
    });

    it('it prompts login on accessing  non-public map', (done) => {
        const e = {
                status: 403
            };
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            const action = actions[0];
            expect(action.type).toBe(SET_CONTROL_PROPERTY);
            done();
        };
        testEpic(promtLoginOnMapError, 1, configureError(e, 123), epicResult, {});
    });
});

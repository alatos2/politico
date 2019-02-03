'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _db = require('../models/db');

var _db2 = _interopRequireDefault(_db);

var _Validations = require('./Validations');

var _Validations2 = _interopRequireDefault(_Validations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Offices = {
  createOffice: function createOffice(req, res) {
    var result = _Validations2.default.validateOffice(req.body);

    if (result.error) {
      return res.json({
        status: 400,
        error: result.error.details[0].context.value + ' is an invalid value'
      });
    }

    var officeId = parseInt(req.body.id, 10);
    var officeType = req.body.type;
    var officeName = req.body.name;

    var query = {
      text: 'INSERT INTO offices(officeid, type, name) VALUES($1, $2, $3)',
      values: [officeId, officeName, officeType]
    };

    _db2.default.client.query(query, function (err, result) {
      if (err) {
        return res.json({
          status: 400,
          message: 'Data cannot be added to database'
        });
      }
      return res.json({
        status: 201,
        data: [{
          id: officeId,
          type: officeType,
          name: officeName
        }]
      });
    });
  },
  viewOffices: function viewOffices(req, res) {
    _db2.default.client.query('SELECT * FROM offices', function (err, result) {
      if (err) {
        return res.json({
          status: 400,
          message: 'Data could not be retrieved'
        });
      }

      var offices = [];
      for (var i = 0; i < result.rowCount; i++) {
        var office = {
          id: result.rows[i].officeid,
          type: result.rows[i].type,
          name: result.rows[i].name
        };

        offices.push(office);
      }
      return res.json({
        status: 200,
        data: offices
      });
    });
  },
  viewOfficeById: function viewOfficeById(req, res) {
    var result = _Validations2.default.validateId(req.params.officeId);

    if (result.error) {
      return res.json({
        status: 400,
        error: result.error.details[0].context.value + ' is an invalid value'
      });
    }

    var officeId = parseInt(req.params.officeId, 10);

    _db2.default.client.query('SELECT * FROM offices WHERE officeid=$1', [officeId], function (err, result) {
      if (err) {
        return res.json({
          status: 400,
          message: 'Data cannot be retrieved'
        });
      }
      if (result.rowCount === 0) {
        return res.json({
          status: 404,
          message: 'Office with ID ' + officeId + ' not found'
        });
      }

      return res.json({
        status: 200,
        data: {
          id: result.rows[0].officeid,
          type: result.rows[0].type,
          name: result.rows[0].name
        }
      });
    });
  }
};

exports.default = Offices;
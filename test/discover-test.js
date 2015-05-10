var AWS = require('aws-sdk'),
  discover = require('../lib/discover'),
  sinon = require('sinon');

require('chai').should();

describe('discover', function() {
  beforeEach(function() {
    this.describeInstances = sinon.stub();
    this.describeInstances.yields(null, require('./fixtures/reservations'));
    sinon.stub(AWS, 'EC2').returns({
      describeInstances: this.describeInstances
    });
  });
  afterEach(function() {
    AWS.EC2.restore();
  });

  it('should not error', function(done) {
    return discover(function(e) {
      return done(e);
    });
  });

  it('should return expected', function(done) {
    return discover(function(e, data) {
      data.should.deep.equal([{
        name: 'microservice-1',
        endpoint: '/api/microservice-1',
        addresses: ['41.41.41.41', '43.43.43.43']
      }, {
        name: 'microservice-2',
        endpoint: '/api/microservice-2',
        addresses: ['42.42.42.42']
      }]);
      return done();
    });
  });
});

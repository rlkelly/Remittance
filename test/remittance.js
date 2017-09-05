var Remittance = artifacts.require("./Remittance.sol");

contract('Remittance', function(accounts) {
  var instance;
  var alice = accounts[0];
  var carol = accounts[1];

  beforeEach(function (done) {
    Remittance.new(alice, carol, 10, {from: alice})
    .then(function (_instance) {
      instance = _instance;
    }).then(() => done());
  });

  it("should init with no balance", function() {
    return instance.getContractBalance.call().then(function(balance) {
      assert.equal(balance.valueOf(), 0, "started with positive balance");
    });
  });

  it("should only take money from alice", function() {
    return instance.sendMoney(1942, {from: alice, value: 100}).then(function() {
      return instance.getContractBalance.call().then(function(balance) {
        assert.equal(balance.valueOf(), 100, "balance is zero");
      });
    });
  });

  it("should fail taking money from not alice", function() {
    return instance.sendMoney(1942, {from: carol, value: 100})
    .then(assert.fail)
    .catch(() => {
      return instance.getContractBalance.call().then(function(balance) {
        assert.equal(balance.valueOf(), 0, "balance is zero");
      });
    });
  });

  it("should require the correct password", function() {
    return instance.sendMoney(1942, {from: alice, value: 100}).then(function() {
      return instance.getContractBalance.call().then(function(balance) {
        assert.equal(balance.valueOf(), 100, "balance is zero");
        return instance.createPassword(2001, {from: alice}).then(function() {
          return instance.withdraw.call(1942 + 2001, {from: carol}).then(function(response) {
            return assert.equal(response, true)
          })
        });
      });
    });
  });

  it("should fail with incorrect password", function() {
    return instance.sendMoney(1942, {from: alice, value: 100}).then(function() {
      return instance.getContractBalance.call().then(function(balance) {
        assert.equal(balance.valueOf(), 100, "balance is zero");
        return instance.createPassword(2001, {from: alice}).then(function() {
          return instance.withdraw.call(1942 + 2001 + 1, {from: carol}).then(function(response) {
            return assert.equal(response, false)
          })
        });
      });
    });
  });

  it("should empty the account with correct password", function() {
    return instance.sendMoney(1942, {from: alice, value: 100}).then(function() {
      return instance.createPassword(2001, {from: alice}).then(function() {
        return instance.withdraw(1942 + 2001, {from: carol}).then(function() {
          return instance.getContractBalance.call().then(function(balance) {
            assert.equal(balance.valueOf(), 0, "balance should be zero");
          });
        });
      });
    });
  });
});

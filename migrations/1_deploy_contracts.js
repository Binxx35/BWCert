var BWCert721A = artifacts.require("./BWCert721A.sol");
var BWCert721 = artifacts.require("./BWCert721.sol");
var BWCert721Modified = artifacts.require("./BWCert721Modified.sol");
var FallbackTester = artifacts.require("./test/FallbackTester.sol");


module.exports = function(deployer) {
    deployer.deploy(BWCert721Modified);
    deployer.deploy(FallbackTester);
}
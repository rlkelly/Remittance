pragma solidity ^0.4.10;

contract Remittance {
	address alice;
	address carol;
	uint firstPassword;
	uint securePassword;
	uint deadline;
	uint start;

  event LogPayment(uint amount);
	event LogWithdrawal(uint blockNumber);
	event LogNums(uint nums);
	event LogPassword(bytes32 password);

	function Remittance(address first, address second, uint blocksInTheFuture) {
		alice = first;
		carol = second;
		deadline = blocksInTheFuture + block.number;
	}

	function sendMoney(uint alicePassword) payable returns(bool) {
		require(msg.sender == alice);
		LogPayment(msg.value);
		firstPassword = alicePassword;
		return true;
	}

	function getContractBalance() returns(uint) {
	    return this.balance;
	}

	function getDeadline() returns(uint) {
		return deadline - block.number;
	}

	function createPassword(uint password) public returns(bool){
		require(msg.sender == alice);
		require(this.balance > 0);
		securePassword = firstPassword + password;
		return true;
	}

	function withdraw(uint password) public returns(bool) {
		  require(this.balance >= 0);
			require(msg.sender == carol);
			if (securePassword == password) {
				LogWithdrawal(block.number);
				carol.transfer(this.balance);
				return true;
	    }
	    return false;
	}

	function returnEther() public returns(bool) {
		require(block.number > start + deadline);
		require(msg.sender == alice);
		alice.transfer(this.balance);
		return true;
	}

	function killContract() {
    if(msg.sender == alice) {
        suicide(alice);
    }
	}
}

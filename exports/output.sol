pragma solidity ^0.8.0;

// This contract is an interactive command-line calculator 
// that performs basic arithmetic on two inputs.
contract CommandlineCalculator {

    function calculator(int x, int y) public pure returns (int addResult, int subResult, int mulResult, int divResult) {
        addResult = add(x, y);
        subResult = sub(x, y);
        mulResult = mul(x, y);
        divResult = div(x, y);
    }

    function add(int x, int y) private pure returns (int) {
        return x + y;
    }

    function sub(int x, int y) private pure returns (int) {
        return x - y;
    }

    function mul(int x, int y) private pure returns (int) {
        return x * y;
    }

    function div(int x, int y) private pure returns (int) {
        require(y != 0, "Cannot divide by zero");
        return x / y;
    }
}

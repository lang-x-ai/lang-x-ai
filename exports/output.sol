// This smart contract acts as a command-line interactive calculator which takes two inputs and performs various calculations.
pragma solidity ^0.8.0;

contract Calculator {

    // Function to add two numbers
    function add(int x, int y) public pure returns (int) {
        return x + y;
    }

    // Function to subtract y from x
    function sub(int x, int y) public pure returns (int) {
        return x - y;
    }

    // Function to multiply two numbers
    function mul(int x, int y) public pure returns (int) {
        return x * y;
    }

    // Function to divide x by y
    function div(int x, int y) public pure returns (int) {
        require(y != 0, "Division by zero is not allowed.");
        return x / y;
    }
}

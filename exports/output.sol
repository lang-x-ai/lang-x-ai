// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @notice Have a commandline interactive calculator, which takes two inputs and does some calculations.
contract Calculator {
    function calculator(uint x, uint y) public pure returns (uint addResult, uint subResult, uint mulResult, uint divResult) {
        // Addition
        addResult = add(x, y);
        // Subtraction
        subResult = sub(x, y);
        // Multiplication
        mulResult = mul(x, y);
        // Division
        divResult = div(x, y);
    }
    
    function add(uint x, uint y) internal pure returns (uint) {
        return x + y;
    }
    
    function sub(uint x, uint y) internal pure returns (uint) {
        return x - y;
    }
    
    function mul(uint x, uint y) internal pure returns (uint) {
        return x * y;
    }
    
    function div(uint x, uint y) internal pure returns (uint) {
        require(y != 0, "Division by zero");
        return x / y;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EvenOddChecker {
    // Function main: Entry point of the contract
    function main(int number) public pure returns (string memory) {
        // Check if the number is even
        if (isEven(number)) {
            return "The number is even.";
        } else {
            return "The number is odd.";
        }
    }

    // Helper function to check if a number is even
    function isEven(int number) internal pure returns (bool) {
        // A number is even if its remainder when divided by 2 is zero
        return number % 2 == 0;
    }
}
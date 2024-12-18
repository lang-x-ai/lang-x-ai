pragma solidity ^0.8.0;

// Company is a class. I need a constructor. There are Tech jobs, marketing jobs, sales as well with salary
contract Company {
    function Tech(uint salary) internal pure returns (uint) {
        return 5000;
    }

    function Sales(uint salary) internal pure returns (uint) {
        return 2000;
    }

    function Market(uint salary) internal pure returns (uint) {
        return 1000;
    }
}

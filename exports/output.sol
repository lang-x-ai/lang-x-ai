pragma solidity ^0.8.0;

contract RangePrinter {

    function print(uint256 a) internal pure returns (string memory) {
        return uintToString(a);
    }

    function println() internal pure returns (string memory) {
        return "\n";
    }

    function print_range(uint256 a, uint256 b) public pure returns (string memory) {
        if (a <= b) {
            string memory result = print(a);
            if (a + 1 <= b) {
                result = string(abi.encodePacked(result, print_range(a + 1, b)));
            } else {
                result = string(abi.encodePacked(result, println()));
            }
            return result;
        }
        return "";
    }

    function uintToString(uint256 v) internal pure returns (string memory str) {
        if (v == 0) {
            return "0";
        }
        uint256 j = v;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (v != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(v - v / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            v /= 10;
        }
        str = string(bstr);
    }

    function callPrintRange() public pure returns (string memory) {
        return print_range(1, 10);
    }
}

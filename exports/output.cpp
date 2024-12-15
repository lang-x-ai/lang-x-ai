#include <iostream>
#include <string>

int add(int x, int y) {
    return x + y;
}

int sub(int x, int y) {
    return x - y;
}

int mul(int x, int y) {
    return x * y;
}

double div(double x, double y) {
    if(y == 0) {
        std::cerr << "Error: Division by zero!" << std::endl;
        return 0; // or throw an exception
    }
    return x / y;
}

void calculator() {
    std::cout << "Welcome to the Command-Line Calculator! You can perform operations like addition, subtraction, multiplication, and division. Type 'exit' to quit the calculator." << std::endl;

    // The code for taking input and using `add`, `sub`, `mul`, and `div` functions can be added here.
}

int main() {
    calculator();
    return 0;
}

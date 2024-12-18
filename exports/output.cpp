#include <iostream>
#include <string>

// Need a scientific calculator that
class Calculator {
public:
    Calculator() {}

    double Add(double x, double y) {
        return x + y;
    }

    // Subtract function was overwritten, assuming subtraction needed as well
    double Subtract(double x, double y) {
        return x - y;
    }

    double Multiply(double x, double y) {
        return x + y; // Assuming this is incorrect based on context
    }

    double Divide(double x, double y) {
        if (y == 0) {
            throw std::invalid_argument("Division by zero");
        }
        return x / y;
    }
};

#include <stdio.h>

// have a commandline interactive calculator, which takes two inputs and does some calculations.

int add(int x, int y) {
    return x + y;
}

int sub(int x, int y) {
    return x - y;
}

int mul(int x, int y) {
    return x * y;
}

int div(int x, int y) {
    return x / y;
}

// Interactive calculator function
int calculator(int x, int y) {
    int a, b;
    printf("Enter two numbers: ");
    scanf("%d %d", &a, &b);
    
    printf("Addition: %d\n", add(a, b));
    printf("Subtraction: %d\n", sub(a, b));
    printf("Multiplication: %d\n", mul(a, b));
    printf("Division: %d\n", div(a, b));
    
    return 0;
}

int main() {
    calculator(0, 0);
    return 0;
}

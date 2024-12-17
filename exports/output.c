#include <stdio.h>

// have a commandline interactive calculator, which takes two inputs and does some calcuations.

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

// Example usage
int main() {
    int x, y;
    char op;
    printf("Enter two numbers: ");
    scanf("%d %d", &x, &y);
    printf("Choose operation (+, -, *, /): ");
    scanf(" %c", &op);

    switch(op) {
        case '+':
            printf("Result: %d\n", add(x, y));
            break;
        case '-':
            printf("Result: %d\n", sub(x, y));
            break;
        case '*':
            printf("Result: %d\n", mul(x, y));
            break;
        case '/':
            if (y != 0) {
                printf("Result: %d\n", div(x, y));
            } else {
                printf("Cannot divide by zero!\n");
            }
            break;
        default:
            printf("Invalid operation!\n");
    }

    return 0;
}

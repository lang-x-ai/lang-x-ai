#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Function prototypes
void calculator(float x, float y);
float add(float x, float y);
float sub(float x, float y);
float mul(float x, float y);
float div(float x, float y);

int main() {
    printf("Welcome to the Command-Line Calculator!\n");
    printf("You can perform operations like addition, subtraction, multiplication, and division.\n");
    printf("Type 'exit' to quit the calculator.\n");

    float x, y;
    char operation[10];

    while (1) {
        printf("Enter operation (add, sub, mul, div) or 'exit': ");
        scanf("%s", operation);

        if (strcmp(operation, "exit") == 0) {
            break;
        }

        printf("Enter two numbers: ");
        scanf("%f %f", &x, &y);

        if (strcmp(operation, "add") == 0) {
            printf("Result: %.2f\n", add(x, y));
        } else if (strcmp(operation, "sub") == 0) {
            printf("Result: %.2f\n", sub(x, y));
        } else if (strcmp(operation, "mul") == 0) {
            printf("Result: %.2f\n", mul(x, y));
        } else if (strcmp(operation, "div") == 0) {
            // Check for division by zero
            if (y == 0) {
                printf("Error: Division by zero.\n");
            } else {
                printf("Result: %.2f\n", div(x, y));
            }
        } else {
            printf("Invalid operation.\n");
        }
    }

    return 0;
}

// Calculator functions
void calculator(float x, float y) {
    // Function is empty as the main logic is in the main function
}

float add(float x, float y) {
    return x + y;
}

float sub(float x, float y) {
    return x - y;
}

float mul(float x, float y) {
    return x * y;
}

float div(float x, float y) {
    return x / y;
}

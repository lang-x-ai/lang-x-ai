// Main function to initialize the calculator
function main() {
    // Display welcome message
    console.log("Welcome to the Calculator!");

    // Example usage of the calculator functions
    let num1 = 10;
    let num2 = 5;

    console.log(`Addition of ${num1} and ${num2}: ` + add(num1, num2));
    console.log(`Subtraction of ${num1} and ${num2}: ` + subtract(num1, num2));
    console.log(`Multiplication of ${num1} and ${num2}: ` + multiply(num1, num2));
    console.log(`Division of ${num1} and ${num2}: ` + divide(num1, num2));
}

// Function to add two numbers
function add(a, b) {
    // Return the sum of a and b
    return a + b;
}

// Function to subtract two numbers
function subtract(a, b) {
    // Return the difference of a and b
    return a - b;
}

// Function to multiply two numbers
function multiply(a, b) {
    // Return the product of a and b
    return a * b;
}

// Function to divide two numbers
function divide(a, b) {
    // Check if the divisor is zero
    if (b === 0) {
        // Log an error message if attempting to divide by zero
        console.log("Error: Division by zero is not allowed.");
        return null;
    }
    // Return the quotient of a and b
    return a / b;
}

// Call the main function to execute the calculator
main();
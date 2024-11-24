// Function to calculate factorial recursively
function factorial(n) {
    // Base case: If n is 0 or 1, the factorial is 1
    if (n === 0 || n === 1) {
        return 1;
    }
    // Recursive case: Multiply n by the factorial of n-1
    return n * factorial(n - 1);
}

// Main function to execute the factorial calculation
function main() {
    // For demonstration, we'll use the number 5
    let number = 5;
    // Calculate factorial of the given number
    let result = factorial(number);
    // Output the result
    console.log("Factorial of " + number + " is: " + result);
}

main(); // Call the main function to execute the program
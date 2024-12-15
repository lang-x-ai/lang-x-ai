# Welcome to the Command-Line Calculator!, You can perform operations like addition, subtraction, multiplication, and division. Type 'exit' to quit the calculator.

calculator = lambda x, y: (
    (add := lambda x, y: x + y),
    (sub := lambda x, y: x - y),
    (mul := lambda x, y: x * y),
    (div := lambda x, y: x / y)
)

def print_range(a, b):
    if a <= b:
        print(a)
        if a + 1 <= b:
            print_range(a + 1, b)
        else:
            print("")

print_range(1, 10)

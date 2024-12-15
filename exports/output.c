#include <stdio.h>

void println(const char *str) {
    printf("%s\n", str);
}

void print_range(int a, int b) {
    if (a <= b) {
        printf("%d\n", a);
        if ((a + 1) <= b) {
            print_range(a + 1, b);
        } else {
            println("");
        }
    }
}

int main() {
    print_range(1, 10);
    return 0;
}

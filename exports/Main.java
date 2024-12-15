import java.util.function.BiConsumer;

public class Main {
    // Gen Code is not right 
    public static void main(String[] args) {
        BiConsumer<Integer, Integer> print_range = (a, b) -> {
            if (a <= b) {
                System.out.println(a);
                if ((a + 1) <= b) {
                    // print_range.accept(a + 1, b);
                } else {
                    System.out.println("");
                }
            }
        };

        print_range.accept(1, 10);
    }
}

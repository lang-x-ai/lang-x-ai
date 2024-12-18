class Company {
    // Company is a class. I need a constructor. There are Tech jobs, marketing
    // jobs, sales as well with salary

    public Company() {
        Tech tech = new Tech(5000);
        Sales sales = new Sales(2000);
        Market market = new Market(1000);

        System.out.println(tech);
        System.out.println(sales);
        System.out.println(market);

    }

    class Tech {
        int salary;

        public Tech(int salary) {
            this.salary = salary;
        }
    }

    class Sales {
        int salary;

        public Sales(int salary) {
            this.salary = salary;
        }
    }

    class Market {
        int salary;

        public Market(int salary) {
            this.salary = salary;
        }
    }
}

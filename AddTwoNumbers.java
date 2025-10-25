public class AddTwoNumbers {
    // add method encapsulates addition logic and is reusable/testable
    public static int add(int a, int b) {
        return a + b;
    }

    // main demonstrates using the add method
    public static void main(String[] args) {
        int num1 = 5; // first example number
        int num2 = 10; // second example number
        int sum = add(num1, num2); // call the reusable add method
        System.out.println("The sum of " + num1 + " and " + num2 + " is: " + sum);
    }
}

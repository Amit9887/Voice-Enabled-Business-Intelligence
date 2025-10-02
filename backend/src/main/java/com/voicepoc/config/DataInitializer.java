package com.voicepoc.config;

import com.voicepoc.model.SalesData;
import com.voicepoc.repository.SalesDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private SalesDataRepository salesDataRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (salesDataRepository.count() > 0) {
            return;
        }
        
        // Generate sample data
        generateSampleData();
    }
    
    private void generateSampleData() {
        List<String> products = Arrays.asList(
            "Laptop Pro 15", "Wireless Headphones", "Smartphone X", "Tablet Air", "Gaming Mouse",
            "Mechanical Keyboard", "Monitor 4K", "Webcam HD", "Bluetooth Speaker", "Power Bank",
            "T-Shirt Cotton", "Jeans Classic", "Sneakers Sport", "Hoodie Winter", "Jacket Leather",
            "Dress Summer", "Shoes Formal", "Hat Baseball", "Sunglasses Aviator", "Watch Smart",
            "Book Programming", "Novel Fiction", "Textbook Math", "Magazine Tech", "Comic Book",
            "Dictionary English", "Biography Famous", "Cookbook Italian", "Travel Guide", "Poetry Collection",
            "Sofa 3-Seater", "Dining Table Oak", "Bed King Size", "Wardrobe Modern", "Coffee Table",
            "Bookshelf Tall", "Chair Office", "Desk Wooden", "Lamp Floor", "Mirror Wall",
            "Basketball Official", "Tennis Racket", "Yoga Mat", "Running Shoes", "Gym Weights",
            "Bicycle Mountain", "Swimming Goggles", "Football", "Baseball Bat", "Hockey Stick"
        );
        
        List<String> categories = Arrays.asList("Electronics", "Clothing", "Books", "Furniture", "Sports");
        List<String> customers = Arrays.asList(
            "John Smith", "Emma Johnson", "Michael Brown", "Sarah Davis", "David Wilson",
            "Lisa Anderson", "Robert Taylor", "Jennifer Thomas", "Christopher Jackson", "Amanda White",
            "Matthew Harris", "Jessica Martin", "Daniel Thompson", "Ashley Garcia", "Andrew Martinez"
        );
        List<String> regions = Arrays.asList("North", "South", "East", "West", "Central");
        
        Random random = new Random();
        
        // Generate 200 sample records
        for (int i = 0; i < 200; i++) {
            String product = products.get(random.nextInt(products.size()));
            String category = categories.get(random.nextInt(categories.size()));
            String customer = customers.get(random.nextInt(customers.size()));
            String region = regions.get(random.nextInt(regions.size()));
            
            // Generate random date within last 12 months
            LocalDate salesDate = LocalDate.now().minusDays(random.nextInt(365));
            
            int quantity = random.nextInt(10) + 1;
            BigDecimal unitPrice = BigDecimal.valueOf(10 + random.nextDouble() * 990).setScale(2, java.math.RoundingMode.HALF_UP);
            BigDecimal totalAmount = unitPrice.multiply(BigDecimal.valueOf(quantity));
            
            SalesData salesData = new SalesData(
                product, category, salesDate, quantity, unitPrice, totalAmount, customer, region
            );
            
            salesDataRepository.save(salesData);
        }
        
        System.out.println("Sample data generated successfully!");
    }
}

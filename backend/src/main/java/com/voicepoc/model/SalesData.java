package com.voicepoc.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "sales_data")
public class SalesData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_name")
    private String productName;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "sales_date")
    private LocalDate salesDate;
    
    @Column(name = "quantity")
    private Integer quantity;
    
    @Column(name = "unit_price")
    private BigDecimal unitPrice;
    
    @Column(name = "total_amount")
    private BigDecimal totalAmount;
    
    @Column(name = "customer_name")
    private String customerName;
    
    @Column(name = "region")
    private String region;
    
    // Constructors
    public SalesData() {}
    
    public SalesData(String productName, String category, LocalDate salesDate, 
                    Integer quantity, BigDecimal unitPrice, BigDecimal totalAmount, 
                    String customerName, String region) {
        this.productName = productName;
        this.category = category;
        this.salesDate = salesDate;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalAmount = totalAmount;
        this.customerName = customerName;
        this.region = region;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public void setProductName(String productName) {
        this.productName = productName;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public LocalDate getSalesDate() {
        return salesDate;
    }
    
    public void setSalesDate(LocalDate salesDate) {
        this.salesDate = salesDate;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public BigDecimal getUnitPrice() {
        return unitPrice;
    }
    
    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public String getRegion() {
        return region;
    }
    
    public void setRegion(String region) {
        this.region = region;
    }
}

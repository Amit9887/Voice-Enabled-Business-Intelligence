package com.voicepoc.controller;

import com.voicepoc.model.SalesData;
import com.voicepoc.repository.SalesDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SalesDataController {
    
    @Autowired
    private SalesDataRepository salesDataRepository;
    
    @GetMapping("/data")
    public ResponseEntity<List<SalesData>> getAllSalesData() {
        List<SalesData> salesData = salesDataRepository.findAll();
        return ResponseEntity.ok(salesData);
    }
    
    @GetMapping("/data/date-range")
    public ResponseEntity<List<SalesData>> getSalesDataByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<SalesData> salesData = salesDataRepository.findSalesDataInDateRange(startDate, endDate);
        return ResponseEntity.ok(salesData);
    }
    
    @GetMapping("/data/category/{category}")
    public ResponseEntity<List<SalesData>> getSalesDataByCategory(@PathVariable String category) {
        List<SalesData> salesData = salesDataRepository.findByCategoryAndDateRange(
            category, LocalDate.now().minusMonths(12), LocalDate.now());
        return ResponseEntity.ok(salesData);
    }
}

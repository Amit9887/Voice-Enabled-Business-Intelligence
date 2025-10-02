package com.voicepoc.service;

import com.voicepoc.model.SalesData;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportGenerationService {
    
    private static final String REPORT_DIR = "reports/";
    
    public String generateReport(List<SalesData> salesData, LocalDate startDate, LocalDate endDate) {
        try {
            String fileName = String.format("sales_report_%s_to_%s.xlsx", 
                startDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            
            String filePath = REPORT_DIR + fileName;
            
            // Ensure directory exists
            java.io.File directory = new java.io.File(REPORT_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            
            // Create Excel workbook
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Sales Report");
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Product Name", "Category", "Sales Date", "Quantity", "Unit Price", "Total Amount", "Customer", "Region"};
            
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Fill data rows
            int rowNum = 1;
            BigDecimal totalSales = BigDecimal.ZERO;
            
            for (SalesData data : salesData) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(data.getId());
                row.createCell(1).setCellValue(data.getProductName());
                row.createCell(2).setCellValue(data.getCategory());
                row.createCell(3).setCellValue(data.getSalesDate().toString());
                row.createCell(4).setCellValue(data.getQuantity());
                row.createCell(5).setCellValue(data.getUnitPrice().doubleValue());
                row.createCell(6).setCellValue(data.getTotalAmount().doubleValue());
                row.createCell(7).setCellValue(data.getCustomerName());
                row.createCell(8).setCellValue(data.getRegion());
                
                totalSales = totalSales.add(data.getTotalAmount());
            }
            
            // Add summary row
            Row summaryRow = sheet.createRow(rowNum + 1);
            summaryRow.createCell(0).setCellValue("SUMMARY");
            summaryRow.createCell(5).setCellValue("Total Sales:");
            summaryRow.createCell(6).setCellValue(totalSales.doubleValue());
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            // Write to file
            FileOutputStream fileOut = new FileOutputStream(filePath);
            workbook.write(fileOut);
            workbook.close();
            fileOut.close();
            
            return filePath;
            
        } catch (IOException e) {
            throw new RuntimeException("Error generating report: " + e.getMessage(), e);
        }
    }
}

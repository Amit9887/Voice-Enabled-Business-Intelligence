package com.voicepoc.service;

import com.voicepoc.dto.VoiceCommandRequest;
import com.voicepoc.dto.VoiceCommandResponse;
import com.voicepoc.model.SalesData;
import com.voicepoc.repository.SalesDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class VoiceCommandService {
    
    @Autowired
    private SalesDataRepository salesDataRepository;
    
    @Autowired
    private ReportGenerationService reportGenerationService;
    
    private static final Pattern DATE_PATTERN = Pattern.compile(
        "(\\d{1,2})[\\s/-](\\d{1,2})[\\s/-](\\d{4})|(\\d{4})[\\s/-](\\d{1,2})[\\s/-](\\d{1,2})"
    );
    
    private static final Pattern MONTH_YEAR_PATTERN = Pattern.compile(
        "(january|february|march|april|may|june|july|august|september|october|november|december)\\s+(\\d{4})"
    );
    
    public VoiceCommandResponse processVoiceCommand(VoiceCommandRequest request) {
        try {
            String command = request.getCommand().toLowerCase().trim();
            VoiceCommandResponse response = new VoiceCommandResponse();
            
            // Validate if command is empty or too short
            if (command.isEmpty() || command.length() < 3) {
                return new VoiceCommandResponse(false, "Please provide a valid voice command. Example: 'Generate report for electronics category'");
            }
            
            // Check if command contains report-related keywords
            if (!isValidReportCommand(command)) {
                return new VoiceCommandResponse(false, "I don't understand that command. Please try commands like:\n" +
                    "• 'Generate report for electronics category'\n" +
                    "• 'Show sales data for North region'\n" +
                    "• 'Create report from January to March 2024'\n" +
                    "• 'Generate clothing sales report'");
            }
            
            // Extract dates from command
            DateRange dateRange = extractDateRange(command);
            if (dateRange == null) {
                return new VoiceCommandResponse(false, "Could not understand date range in your command. Please specify dates like 'January 1st 2024 to March 31st 2024'");
            }
            
            // Extract category and region if mentioned
            String category = extractCategory(command);
            String region = extractRegion(command);
            
            response.setInterpretedCommand(command);
            response.setStartDate(dateRange.startDate);
            response.setEndDate(dateRange.endDate);
            response.setCategory(category);
            response.setRegion(region);
            
            // Fetch sales data
            List<SalesData> salesData = fetchSalesData(dateRange.startDate, dateRange.endDate, category, region);
            response.setSalesData(salesData);
            
            // Generate report
            String reportUrl = reportGenerationService.generateReport(salesData, dateRange.startDate, dateRange.endDate);
            response.setReportUrl(reportUrl);
            
            response.setSuccess(true);
            response.setMessage(String.format("Generated report for %d records from %s to %s", 
                salesData.size(), dateRange.startDate, dateRange.endDate));
            
            return response;
            
        } catch (Exception e) {
            return new VoiceCommandResponse(false, "Error processing voice command: " + e.getMessage());
        }
    }
    
    private DateRange extractDateRange(String command) {
        // Try to extract explicit date ranges
        String[] dateKeywords = {"from", "between", "to", "until", "till"};
        
        for (String keyword : dateKeywords) {
            if (command.contains(keyword)) {
                String[] parts = command.split(keyword);
                if (parts.length >= 2) {
                    LocalDate startDate = parseDate(parts[0].trim());
                    LocalDate endDate = parseDate(parts[1].trim());
                    
                    if (startDate != null && endDate != null) {
                        return new DateRange(startDate, endDate);
                    }
                }
            }
        }
        
        // Try to extract month-year patterns
        Matcher monthMatcher = MONTH_YEAR_PATTERN.matcher(command);
        if (monthMatcher.find()) {
            String month = monthMatcher.group(1);
            int year = Integer.parseInt(monthMatcher.group(2));
            
            LocalDate startDate = LocalDate.of(year, getMonthNumber(month), 1);
            LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
            
            return new DateRange(startDate, endDate);
        }
        
        // Default to last 12 months if no dates found to capture more data
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(12);
        
        return new DateRange(startDate, endDate);
    }
    
    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        
        // Remove common words
        dateStr = dateStr.replaceAll("\\b(st|nd|rd|th)\\b", "");
        dateStr = dateStr.trim();
        
        // Try different date formats
        String[] formats = {
            "MM/dd/yyyy", "dd/MM/yyyy", "yyyy-MM-dd",
            "MM-dd-yyyy", "dd-MM-yyyy", "M/d/yyyy",
            "d/M/yyyy", "MMM d, yyyy", "d MMM yyyy"
        };
        
        for (String format : formats) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
                return LocalDate.parse(dateStr, formatter);
            } catch (DateTimeParseException e) {
                // Continue to next format
            }
        }
        
        return null;
    }
    
    private int getMonthNumber(String month) {
        String[] months = {"january", "february", "march", "april", "may", "june",
                          "july", "august", "september", "october", "november", "december"};
        return Arrays.asList(months).indexOf(month.toLowerCase()) + 1;
    }
    
    private String extractCategory(String command) {
        String[] categories = {"electronics", "clothing", "books", "furniture", "sports"};
        for (String category : categories) {
            if (command.contains(category)) {
                // Capitalize first letter to match database values
                return category.substring(0, 1).toUpperCase() + category.substring(1);
            }
        }
        return null;
    }
    
    private String extractRegion(String command) {
        String[] regions = {"north", "south", "east", "west", "central"};
        for (String region : regions) {
            if (command.contains(region)) {
                // Capitalize first letter to match database values
                return region.substring(0, 1).toUpperCase() + region.substring(1);
            }
        }
        return null;
    }
    
    private boolean isValidReportCommand(String command) {
        // Check for report-related keywords (must have at least one)
        String[] reportKeywords = {
            "generate", "create", "show", "display", "get", "fetch", "report", 
            "sales", "data", "analytics", "dashboard", "summary", "overview"
        };
        
        // Check for business-related keywords
        String[] businessKeywords = {
            "electronics", "clothing", "books", "furniture", "sports",
            "north", "south", "east", "west", "central",
            "category", "region", "product", "customer", "revenue"
        };
        
        // Check for time-related keywords
        String[] timeKeywords = {
            "from", "to", "between", "last", "month", "year", "week", "day",
            "january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"
        };
        
        // Check for invalid/generic keywords that should be rejected
        String[] invalidKeywords = {
            "hello", "hi", "weather", "music", "play", "open", "joke", "tell", "what", "how", "why", "when", "where", "who"
        };
        
        // If command contains invalid keywords, reject it
        for (String invalidKeyword : invalidKeywords) {
            if (command.contains(invalidKeyword)) {
                return false;
            }
        }
        
        // Count matches for each category
        int reportMatches = 0;
        int businessMatches = 0;
        int timeMatches = 0;
        
        for (String keyword : reportKeywords) {
            if (command.contains(keyword)) {
                reportMatches++;
            }
        }
        
        for (String keyword : businessKeywords) {
            if (command.contains(keyword)) {
                businessMatches++;
            }
        }
        
        for (String keyword : timeKeywords) {
            if (command.contains(keyword)) {
                timeMatches++;
            }
        }
        
        // Command is valid if it has at least one report keyword and either business or time context
        return reportMatches > 0 && (businessMatches > 0 || timeMatches > 0);
    }
    
    private List<SalesData> fetchSalesData(LocalDate startDate, LocalDate endDate, String category, String region) {
        if (category != null && region != null) {
            // This would need a custom query in repository
            return salesDataRepository.findBySalesDateBetween(startDate, endDate);
        } else if (category != null) {
            return salesDataRepository.findByCategoryAndDateRange(category, startDate, endDate);
        } else if (region != null) {
            return salesDataRepository.findByRegionAndDateRange(region, startDate, endDate);
        } else {
            return salesDataRepository.findSalesDataInDateRange(startDate, endDate);
        }
    }
    
    private static class DateRange {
        LocalDate startDate;
        LocalDate endDate;
        
        DateRange(LocalDate startDate, LocalDate endDate) {
            this.startDate = startDate;
            this.endDate = endDate;
        }
    }
}

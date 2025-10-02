package com.voicepoc.dto;

import com.voicepoc.model.SalesData;
import java.time.LocalDate;
import java.util.List;

public class VoiceCommandResponse {
    
    private boolean success;
    private String message;
    private String interpretedCommand;
    private LocalDate startDate;
    private LocalDate endDate;
    private String category;
    private String region;
    private List<SalesData> salesData;
    private String reportUrl;
    
    public VoiceCommandResponse() {}
    
    public VoiceCommandResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getInterpretedCommand() {
        return interpretedCommand;
    }
    
    public void setInterpretedCommand(String interpretedCommand) {
        this.interpretedCommand = interpretedCommand;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getRegion() {
        return region;
    }
    
    public void setRegion(String region) {
        this.region = region;
    }
    
    public List<SalesData> getSalesData() {
        return salesData;
    }
    
    public void setSalesData(List<SalesData> salesData) {
        this.salesData = salesData;
    }
    
    public String getReportUrl() {
        return reportUrl;
    }
    
    public void setReportUrl(String reportUrl) {
        this.reportUrl = reportUrl;
    }
}

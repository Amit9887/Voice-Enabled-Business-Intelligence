package com.voicepoc.dto;

import jakarta.validation.constraints.NotBlank;

public class VoiceCommandRequest {
    
    @NotBlank(message = "Voice command text is required")
    private String command;
    
    private String category;
    private String region;
    
    public VoiceCommandRequest() {}
    
    public VoiceCommandRequest(String command) {
        this.command = command;
    }
    
    public String getCommand() {
        return command;
    }
    
    public void setCommand(String command) {
        this.command = command;
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
}

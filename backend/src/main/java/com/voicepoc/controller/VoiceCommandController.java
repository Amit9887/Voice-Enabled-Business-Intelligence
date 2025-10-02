package com.voicepoc.controller;

import com.voicepoc.dto.VoiceCommandRequest;
import com.voicepoc.dto.VoiceCommandResponse;
import com.voicepoc.model.SalesData;
import com.voicepoc.service.VoiceCommandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/voice")
@CrossOrigin(origins = "*")
public class VoiceCommandController {
    
    @Autowired
    private VoiceCommandService voiceCommandService;
    
    @PostMapping("/process")
    public ResponseEntity<VoiceCommandResponse> processVoiceCommand(@Valid @RequestBody VoiceCommandRequest request) {
        VoiceCommandResponse response = voiceCommandService.processVoiceCommand(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Voice Command API is working!");
    }
    
    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadReport(@PathVariable String filename) {
        try {
            File file = new File("reports/" + filename);
            
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }
            
            Resource resource = new FileSystemResource(file);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

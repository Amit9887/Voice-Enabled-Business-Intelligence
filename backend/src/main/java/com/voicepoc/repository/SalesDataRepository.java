package com.voicepoc.repository;

import com.voicepoc.model.SalesData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalesDataRepository extends JpaRepository<SalesData, Long> {
    
    List<SalesData> findBySalesDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT s FROM SalesData s WHERE s.salesDate BETWEEN :startDate AND :endDate ORDER BY s.salesDate DESC")
    List<SalesData> findSalesDataInDateRange(@Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);
    
    @Query("SELECT s FROM SalesData s WHERE s.category = :category AND s.salesDate BETWEEN :startDate AND :endDate")
    List<SalesData> findByCategoryAndDateRange(@Param("category") String category, 
                                              @Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);
    
    @Query("SELECT s FROM SalesData s WHERE s.region = :region AND s.salesDate BETWEEN :startDate AND :endDate")
    List<SalesData> findByRegionAndDateRange(@Param("region") String region, 
                                            @Param("startDate") LocalDate startDate, 
                                            @Param("endDate") LocalDate endDate);
}

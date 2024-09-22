package salih_korkmaz.dnm_1005.service;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import salih_korkmaz.dnm_1005.dto.SowingDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.entity.Plant;
import salih_korkmaz.dnm_1005.entity.Sowing;
import salih_korkmaz.dnm_1005.mapper.SowingMapper;
import salih_korkmaz.dnm_1005.repository.LandRepository;
import salih_korkmaz.dnm_1005.repository.SowingRepository;

import java.util.Optional;



@Service
public class SowingService {

    private final SowingRepository sowingRepository;
    private final PlantService plantService;
    private final LandService landService;
    private final SowingMapper sowingMapper;

    public SowingService(SowingRepository sowingRepository, PlantService plantService, LandService landService, SowingMapper sowingMapper, LandRepository landRepository) {
        this.sowingRepository = sowingRepository;
        this.plantService = plantService;
        this.landService = landService;
        this.sowingMapper = sowingMapper;
    }

    public SowingDTO saveSowing(SowingDTO sowingDto) {
        Plant plant = plantService.findPlantById(sowingDto.getPlantId());  // Plant nesnesi döndürülüyor.
        Land land = landService.findLandById(sowingDto.getLandId());  // Aynı şekilde Land için de eklenebilir.

        Sowing sowing = sowingMapper.toEntity(sowingDto);
        sowing.setPlant(plant);
        sowing.setLand(land);

        Sowing savedSowing = sowingRepository.save(sowing);
        return sowingMapper.toDto(savedSowing);
    }
    public Sowing updateSowing(Long id, @Valid SowingDTO sowingDto) {
        Sowing existingSowing = sowingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ekim bulunamadı."));

        // Önceki ekim alanını alır.
        double oldSowingField = existingSowing.getSowingField();

        // Yeni ekim alanı ile eski ekim alanı farkını hesaplar.
        double newSowingField = sowingDto.getSowingField();
        double fieldDifference = newSowingField - oldSowingField;

        // Araziyi getir
        Land land = Optional.ofNullable(landService.findLandById(sowingDto.getLandId()))
                .orElseThrow(() -> new RuntimeException("Arazi bulunamadı"));

        // Eğer fark pozitifse, ekilebilir alanı azaltır (subtractFromClayableLand), negatifse ekler (addToClayableLand).
        if (fieldDifference > 0) {
            landService.subtractFromClayableLand(land.getId(), fieldDifference);
        } else if (fieldDifference < 0) {
            landService.addToClayableLand(land.getId(), Math.abs(fieldDifference));
        }

        // Diğer alanları günceller.
        existingSowing.setSowingField((int) newSowingField);//Backendde İnt türünde tanımlı set edilen değer.
        existingSowing.setSowingDate(sowingDto.getSowingDate());

        if (sowingDto.getPlantId() != null) {
            Plant plant = Optional.ofNullable(plantService.findPlantById(sowingDto.getPlantId()))
                    .orElseThrow(() -> new RuntimeException("Bitki bulunamadı."));
            existingSowing.setPlant(plant);
        }

        return sowingRepository.save(existingSowing);
    }

    public Page<SowingDTO> getSowingsByUser(Long userId, Pageable pageable) {
        Page<Sowing> sowings = sowingRepository.findByLandUserId(userId,pageable);
        return sowings.map(sowingMapper::toDto);
    }

    public SowingDTO getSowingById(Long id) {
        Sowing sowing = sowingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ekim bulunamadı"));
        return sowingMapper.toDto(sowing);
    }

    public Sowing findSowingById(Long sowingId) {
        return sowingRepository.findById(sowingId)
                .orElseThrow(() -> new RuntimeException("EKim bulunamadı"));
    }

    public void deleteSowing(Long id) {
        // Silinecek ekim kaydını bulur.
        Sowing existingSowing = sowingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ekim bulunamadı"));

        // İlgili araziyi bulur.
        Land land = existingSowing.getLand();

        // Ekim alanını ekilebilir alana geri ekler.
        double sowingField = existingSowing.getSowingField();
        landService.addToClayableLand(land.getId(), sowingField);

        // Ekim kaydını siler.
        sowingRepository.delete(existingSowing);
    }
}
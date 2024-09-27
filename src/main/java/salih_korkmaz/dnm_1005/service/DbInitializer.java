package salih_korkmaz.dnm_1005.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.entity.*;
import salih_korkmaz.dnm_1005.repository.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DbInitializer {

    private final CityRepository cityRepository;
    private final DistrictRepository districtRepository;
    private final LocalityRepository localityRepository;


    private final ResourceLoader resourceLoader;
    private final PlantCategoryRepository plantCategoryRepository;
    private final PlantRepository plantRepository;

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void initialize() throws IOException {
        addCities();
        addDistricts();
        addLocalities();
        addPlantCategories();
        addPlants();

    }


    private void addCities() throws IOException {
        List<City> sehirListesi = cityRepository.findAll();
        if (sehirListesi.isEmpty()) {


            Resource resource = resourceLoader.getResource("classpath:" + "db\\cities.xlsx");
            try(InputStream inputStream = resource.getInputStream();
                Workbook workbook = new XSSFWorkbook(inputStream)) {

                Sheet sheet = workbook.getSheetAt(0);

                for (Row row : sheet) {
                    int code = 0;
                    if (row.getCell(0).getCellType() == CellType.NUMERIC) {
                        code = (int) row.getCell(0).getNumericCellValue();
                    }
                    else if (row.getCell(0).getCellType() == CellType.STRING) {
                        code = Integer.parseInt(row.getCell(0).getStringCellValue());
                    }

                    String name = row.getCell(3).getStringCellValue();

                    String latitude = "";
                    if (row.getCell(1).getCellType() == CellType.STRING) {
                        latitude = row.getCell(1).getStringCellValue();
                    }
                    else if (row.getCell(1).getCellType() == CellType.NUMERIC) {
                        latitude = String.valueOf(row.getCell(1).getNumericCellValue());
                    }

                    String longitude = "";
                    if (row.getCell(2).getCellType() == CellType.STRING) {
                        longitude = row.getCell(2).getStringCellValue();
                    }
                    else if (row.getCell(2).getCellType() == CellType.NUMERIC) {
                        longitude = String.valueOf(row.getCell(2).getNumericCellValue());
                    }

                    City city = new City(code, name, "", "", latitude, longitude, new ArrayList<>());
                    cityRepository.save(city);
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }


    private void addDistricts() throws IOException {
        List<District> districtList = districtRepository.findAll();
        if (districtList.isEmpty()) {
            Resource resource = resourceLoader.getResource("classpath:" + "db\\districts.xlsx");
            try(InputStream inputStream = resource.getInputStream();
                Workbook workbook = new XSSFWorkbook(inputStream)) {

                Sheet sheet = workbook.getSheetAt(0);

                for (Row row : sheet) {
                    int code = 0;
                    if (row.getCell(0).getCellType() == CellType.NUMERIC) {
                        code = (int) row.getCell(0).getNumericCellValue();
                    }
                    else if (row.getCell(0).getCellType() == CellType.STRING) {
                        code = Integer.parseInt(row.getCell(0).getStringCellValue());
                    }

                    String latitude = row.getCell(1).getStringCellValue();
                    String longitude = row.getCell(2).getStringCellValue();
                    String name = row.getCell(3).getStringCellValue();

                    int parentCode = 0;
                    if (row.getCell(6).getCellType() == CellType.NUMERIC) {
                        parentCode = (int) row.getCell(6).getNumericCellValue();
                    }
                    else if (row.getCell(6).getCellType() == CellType.STRING) {
                        parentCode = Integer.parseInt(row.getCell(6).getStringCellValue());
                    }

                    City parentCity = cityRepository.findById(parentCode).orElse(null);
                    if (parentCity == null) {
                        continue;
                    }

                    District district = new District(code, name, latitude, longitude, "", "", parentCity, new ArrayList<>());
                    districtRepository.save(district);
                }
            }
            catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

    }


    private void addLocalities() throws IOException {
        List<Locality> localityList = localityRepository.findAll();
        if (localityList.isEmpty()) {
            Resource resource = resourceLoader.getResource("classpath:" + "db\\localities.xlsx");
            try(InputStream inputStream = resource.getInputStream();
                Workbook workbook = new XSSFWorkbook(inputStream)) {
                Sheet sheet = workbook.getSheetAt(0);

                for (Row row : sheet) {
                    int code = 0;
                    if (row.getCell(0).getCellType() == CellType.NUMERIC) {
                        code = (int) row.getCell(0).getNumericCellValue();
                    }
                    else if (row.getCell(0).getCellType() == CellType.STRING) {
                        code = Integer.parseInt(row.getCell(0).getStringCellValue());
                    }

                    String name = row.getCell(1).getStringCellValue();
                    String slug = row.getCell(2).getStringCellValue();
                    String type = row.getCell(3).getStringCellValue();

                    long parentCode = 0;
                    if (row.getCell(4).getCellType() == CellType.NUMERIC) {
                        parentCode = (long) row.getCell(4).getNumericCellValue();
                    }
                    else if (row.getCell(4).getCellType() == CellType.STRING) {
                        parentCode = Long.parseLong(row.getCell(4).getStringCellValue());
                    }

                    District parentDistrict = districtRepository.findById(parentCode).orElse(null);
                    if (parentDistrict == null) {
                        continue;
                    }

                    Locality locality = new Locality();
                    locality.setCode(code);
                    locality.setName(name);
                    locality.setSlug(slug);
                    locality.setType(type);
                    locality.setDistrict(parentDistrict);

                    localityRepository.save(locality);
                }
            }
            catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
    private void addPlantCategories() throws IOException {
        List<PlantCategory> categoryList = plantCategoryRepository.findAll();
        if (categoryList.isEmpty()) {
            Resource resource = resourceLoader.getResource("classpath:" + "db\\plantCategory.xlsx");
            try (InputStream inputStream = resource.getInputStream();
                 Workbook workbook = new XSSFWorkbook(inputStream)) {

                Sheet sheet = workbook.getSheetAt(0);
                for (Row row : sheet) {
                    String categoryName = row.getCell(1).getStringCellValue();

                    PlantCategory category = new PlantCategory();
                    category.setCategoryName(categoryName);

                    plantCategoryRepository.save(category);
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private void addPlants() throws IOException {
        List<Plant> plantList = plantRepository.findAll();
        if (plantList.isEmpty()) {
            Resource resource = resourceLoader.getResource("classpath:" + "db\\plants.xlsx");
            try (InputStream inputStream = resource.getInputStream();
                 Workbook workbook = new XSSFWorkbook(inputStream)) {

                Sheet sheet = workbook.getSheetAt(0);

                for (Row row : sheet) {
                    try {
                        // Hücre 2: Bitkinin adı (String)
                        String plantName = row.getCell(2).getStringCellValue();

                        // Hücre 1: Resim (String)
                        String image = row.getCell(1).getStringCellValue();

                        // Hücre 3: Verim değeri (Numeric)
                        double yieldPerSquareMeter;
                        if (row.getCell(3).getCellType() == CellType.NUMERIC) {
                            yieldPerSquareMeter = row.getCell(3).getNumericCellValue();
                        } else if (row.getCell(3).getCellType() == CellType.STRING) {
                            yieldPerSquareMeter = Double.parseDouble(row.getCell(3).getStringCellValue());
                        } else {
                            System.err.println("Hatalı veri tipi: yieldPerSquareMeter");
                            continue;
                        }

                        // Hücre 4: Kategori ID (Numeric)
                        long categoryId;
                        if (row.getCell(4).getCellType() == CellType.NUMERIC) {
                            categoryId = (long) row.getCell(4).getNumericCellValue();
                        } else if (row.getCell(4).getCellType() == CellType.STRING) {
                            categoryId = Long.parseLong(row.getCell(4).getStringCellValue());
                        } else {
                            System.err.println("Hatalı veri tipi: categoryId");
                            continue;
                        }

                        // İlgili kategoriyi bul
                        PlantCategory category = plantCategoryRepository.findById(categoryId).orElse(null);
                        if (category == null) {
                            System.err.println("Kategori bulunamadı: ID = " + categoryId);
                            continue; // Kategori bulunamazsa bitkiyi kaydetme
                        }

                        // Yeni Plant oluştur
                        Plant plant = new Plant();
                        plant.setName(plantName);
                        plant.setImage(image);
                        plant.setYieldPerSquareMeter(yieldPerSquareMeter);
                        plant.setPlantCategory(category); // Kategori ile ilişkilendir

                        // Veritabanına kaydet
                        plantRepository.save(plant);
                        System.out.println("Bitki kaydedildi: " + plantName);
                    } catch (Exception e) {
                        System.err.println("Satır işlenirken hata oluştu: " + e.getMessage());
                    }
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
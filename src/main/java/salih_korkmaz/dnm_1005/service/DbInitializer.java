package salih_korkmaz.dnm_1005.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.entity.City;
import salih_korkmaz.dnm_1005.entity.District;
import salih_korkmaz.dnm_1005.entity.Locality;
import salih_korkmaz.dnm_1005.repository.CityRepository;
import salih_korkmaz.dnm_1005.repository.DistrictRepository;
import salih_korkmaz.dnm_1005.repository.LocalityRepository;

import java.io.FileInputStream;
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

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void initialize() throws IOException {
        addCities();
        addDistricts();
        addLocalities();
    }


    private void addCities() throws IOException {
        List<City> sehirListesi = cityRepository.findAll();
        if (sehirListesi.isEmpty()) {


            Resource resource = resourceLoader.getResource("classpath:" + "db\\cities.xlsx");
            //InputStream inputStream = resource.getInputStream();
            try(InputStream inputStream = resource.getInputStream();
                Workbook workbook = new XSSFWorkbook(inputStream)) {

                //FileInputStream excelFile = new FileInputStream("claspath:db\\cities.xlsx");
                //FileInputStream excelFile = new FileInputStream("db\\cities.xlsx");
                //Workbook workbook = new XSSFWorkbook(inputStream);
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

                    String latitude = "";
                    if (row.getCell(3).getCellType() == CellType.STRING) {
                        latitude = row.getCell(3).getStringCellValue();
                    }
                    else if (row.getCell(3).getCellType() == CellType.NUMERIC) {
                        latitude = String.valueOf(row.getCell(3).getNumericCellValue());
                    }

                    String longitude = "";
                    if (row.getCell(4).getCellType() == CellType.STRING) {
                        longitude = row.getCell(4).getStringCellValue();
                    }
                    else if (row.getCell(4).getCellType() == CellType.NUMERIC) {
                        longitude = String.valueOf(row.getCell(4).getNumericCellValue());
                    }

                    City city = new City(code, name, "", "", latitude, longitude, new ArrayList<>());
                    cityRepository.save(city);
                }
            } catch (IOException e){

            }
            //workbook.close();
            //inputStream.close();
        }
    }


    private void addDistricts() throws IOException {
        List<District> districtList = districtRepository.findAll();
        if (districtList.isEmpty()) {
            Resource resource = resourceLoader.getResource("classpath:" + "db\\districts.xlsx");
            try(InputStream inputStream = resource.getInputStream();
                Workbook workbook = new XSSFWorkbook(inputStream)) {

                //                FileInputStream excelFile = new FileInputStream("C:\\Users\\Salih KORKMAZ\\IdeaProjects\\Tarim-Proje1\\src\\main\\resources\\db\\districts.xlsx");
                //            Workbook workbook = new XSSFWorkbook(excelFile);
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

                    District district = new District(code, latitude, longitude, name, "", "", parentCity, new ArrayList<>());
                    districtRepository.save(district);
                }
            }
            catch (IOException e){
                e.printStackTrace();
            }
            //workbook.close();
            //excelFile.close();

        }

    }


    private void addLocalities() throws IOException {
        List<Locality> localityList = localityRepository.findAll();
        if (!localityList.isEmpty()) {
            Resource resource = resourceLoader.getResource("classpath:" + "db\\localities.xlsx");
            try(InputStream inputStream = resource.getInputStream();
                Workbook workbook = new XSSFWorkbook(inputStream)) {

                //                FileInputStream excelFile = new FileInputStream("C:\\Users\\Salih KORKMAZ\\IdeaProjects\\Tarim-Proje1\\src\\main\\resources\\db\\localities.xlsx");
                //            Workbook workbook = new XSSFWorkbook(excelFile);
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
                e.printStackTrace();
            }
//            workbook.close();
//            excelFile.close();
        }

    }
}

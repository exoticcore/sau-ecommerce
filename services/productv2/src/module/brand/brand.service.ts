import { DB } from '@database';
import { Brand } from '@/module/brand/brand.interface';
import { CreateBrandDto, UpdateBrandDto } from '@/module/brand/brand.dto';
import { HttpException } from '@exceptions/httpException';

export default class BrandService {
  public async readAllBrands(): Promise<Brand[]> {
    const brands = await DB.Brand.findAll();
    return brands;
  }

  public async getBrandByTitle(title: string): Promise<Brand> {
    const brand = await DB.Brand.findOne({ where: { title: title } });
    return brand;
  }

  public async createBrand(brandData: CreateBrandDto): Promise<Brand> {
    const brand: Brand = await this.getBrandByTitle(brandData.title);
    if (brand) throw new HttpException(409, `This brand title '${brandData.title}' already exists`);

    const createdBrandData = await DB.Brand.create({ ...brandData });
    return createdBrandData;
  }

  public async updateBrand(brandId: number, brandData: UpdateBrandDto): Promise<Brand> {
    const brand: Brand = await DB.Brand.findByPk(brandId);
    if (!brand) throw new HttpException(409, `This brand id ${brandId} not exists`);

    if (brandData.title) {
      const isBrand = await this.getBrandByTitle(brandData.title);
      if (isBrand && isBrand.title !== brand.title) throw new HttpException(409, `This brand title '${brandData.title}' already exists`);
    }

    await DB.Brand.update({ ...brandData }, { where: { id: brandId } });
    const updatedBrandData = await DB.Brand.findByPk(brandId);
    return updatedBrandData;
  }

  public async deleteBrand(brandId: number): Promise<Brand> {
    const brand: Brand = await DB.Brand.findByPk(brandId);
    if (!brand) throw new HttpException(409, `This brand id ${brandId} not exists`);

    await DB.Brand.destroy({ where: { id: brandId } });
    return brand;
  }
}

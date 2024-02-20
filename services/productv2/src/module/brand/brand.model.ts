import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Brand } from '@/module/brand/brand.interface';

export type BrandCreationAttributes = Optional<Brand, 'id' | 'title' | 'description'>;

export class BrandModel extends Model<Brand, BrandCreationAttributes> implements Brand {
  public id: number;
  public title: string;
  public description: string;
  public picture: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}

export default function (sequelize: Sequelize): typeof BrandModel {
  BrandModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      picture: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'brand',
      sequelize,
    },
  );

  return BrandModel;
}

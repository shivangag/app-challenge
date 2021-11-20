import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Restaurant extends Model<Restaurant> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  country: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  long: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  lat: string;
}

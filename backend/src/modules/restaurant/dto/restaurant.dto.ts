import { IsNotEmpty } from 'class-validator';

export class RestaurantDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly country: string;

  @IsNotEmpty()
  readonly address: string;

  @IsNotEmpty()
  readonly lat: number;
  @IsNotEmpty()
  readonly long: number;
  @IsNotEmpty()
  readonly user_id: string;
}

export class editRestaurantDto {
  readonly name: string;

  readonly address: string;
}

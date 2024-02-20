import { Column, Entity, ObjectId, ObjectIdColumn, Unique } from 'typeorm';

@Entity()
@Unique(['brandTitle', 'imageName'])
export class Brand {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  brandTitle: string;

  @Column()
  imageName: string;

  @Column()
  filetype: string;

  @Column()
  path: string;

  @Column({ default: false })
  isPrivate: boolean;
}

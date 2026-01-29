import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  @Field(() => [String])
  roles: string[];

  @Column({
    type: 'boolean',
    default: true,
  })
  @Field(() => Boolean)
  isActive: boolean;

  //Info: https://orkhan.gitbook.io/typeorm/docs/docs/relations/5-eager-and-lazy-relations
  @ManyToOne(() => User, (user) => user.lastUpdatedBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'last_updated_by' })
  @Field(() => User, { nullable: true })
  lastUpdatedBy: User;

  @OneToMany(() => Item, (item) => item.user, { lazy: true })
  //* Información: se removió el campo items y se agregó el resolve field en el resolver de users
  // @Field(() => [Item], { description: 'List of items owned by the user' })
  items: Item[];
}

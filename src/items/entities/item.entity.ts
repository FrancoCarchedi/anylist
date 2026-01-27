import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Item unique identifier' })
  id: string;

  @Column()
  @Field(() => String, { description: 'Item name' })
  name: string;

  @Column()
  @Field(() => Int, { description: 'Item quantity' })
  quantity: number;

  @Column({ nullable: true })
  @Field(() => String, { description: 'Item quantity units', nullable: true })
  quantityUnits?: string;

  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('idx_item_user')
  @Field(() => User, { description: 'Owner of the item' })
  user: User;
}

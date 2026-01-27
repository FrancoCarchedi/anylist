import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Item } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}
  

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    
    const newItem = this.itemsRepository.create({ ...createItemInput, user });
    await this.itemsRepository.save(newItem);
    return newItem;
  }

  async findAll(user: User): Promise<Item[]> {
    //TODO: filtrar, paginar, etc.
    return this.itemsRepository.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOne({ where: { id, user: { id: user.id } } });

    if (!item) throw new NotFoundException(`Item with ID ${id} not found`);

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {

    const item = await this.itemsRepository.preload({
      ...updateItemInput,
      id,
      user: { id: user.id }
    });

    if (!item) throw new NotFoundException(`Item with ID ${updateItemInput.id} not found`);

    return this.itemsRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    //TODO: Soft delete, integridad referencial, etc.
    const item = await this.findOne(id, user);
    await this.itemsRepository.remove(item);

    return {...item, id};
  }

  async itemCountByUser(user: User): Promise<number> {
    const itemsCount =  await this.itemsRepository.count({ where: { user: { id: user.id } } });
    return itemsCount;
  }
}

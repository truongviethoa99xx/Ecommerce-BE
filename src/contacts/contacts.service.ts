import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const contact = this.contactRepository.create({
      ...createContactDto,
      status: 'pending',
      submittedAt: new Date(),
    });
    
    return await this.contactRepository.save(contact);
  }

  async findAll() {
    return await this.contactRepository.find({
      order: { submittedAt: 'DESC' },
    });
  }

  async findByUser(userId: number) {
    return await this.contactRepository.find({
      where: { userId },
      order: { submittedAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }

    return contact;
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }

    await this.contactRepository.update(id, {
      ...updateContactDto,
      updatedAt: new Date(),
    });
    
    return await this.findOne(id);
  }

  async remove(id: number) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact message with ID ${id} not found`);
    }

    await this.contactRepository.remove(contact);
    return { message: 'Contact message deleted successfully' };
  }
}

import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesRepository } from './notes.repository';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(private readonly repository: NotesRepository) {}

  create(createNoteDto: CreateNoteDto) {
    return this.repository.upsertOne(Note.newInstanceFromDTO(createNoteDto));
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: string) {
    return this.repository.findByNoteId(id);
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const existingObject = await this.repository.findByNoteId(id);
    if (existingObject.content) {
      existingObject.content = updateNoteDto.content;
    }
    if (existingObject.title) {
      existingObject.title = updateNoteDto.title;
    }

    existingObject.updatedAt = new Date();

    return this.repository.upsertOne(existingObject);
  }

  remove(id: string) {
    return this.repository.deleteById(id);
  }
}

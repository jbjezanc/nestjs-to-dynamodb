import { CreateNoteDto } from '../dto/create-note.dto';
import { v4 as uuidv4 } from 'uuid';

export class Note {
  noteId: string;
  title?: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;

  static newInstanceFromDTO(data: CreateNoteDto) {
    const result = new Note();
    result.noteId = uuidv4();
    result.content = data.content;
    result.title = data.title;
    result.createdAt = new Date();

    return result;
  }

  static newInstanceFromDynamoDBObject(data: any): Note {
    const result = new Note();
    result.noteId = data.noteId.S;
    result.title = data?.title?.S;
    result.content = data.content.S;
    result.createdAt = new Date(Number(data.createdAt.N));
    if (data.updatedAt) {
      result.updatedAt = new Date(Number(data.updatedAt.N));
    }
    return result;
  }
}

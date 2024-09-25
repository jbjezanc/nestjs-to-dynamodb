import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesRepository {
  private readonly tableName = 'notes';
  private readonly client: DynamoDBClient;

  constructor() {
    this.client = new DynamoDBClient({
      region: 'eu-central-1',
    });
  }

  async findAll() {
    const result: Note[] = [];

    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const response = await this.client.send(command);

    if (response.Items) {
      response.Items.forEach((item) => {
        result.push(Note.newInstanceFromDynamoDBObject(item));
      });
    }

    return result;
  }

  async findByNoteId(noteId: string) {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: {
        noteId: {
          S: noteId,
        },
      },
    });

    const result = await this.client.send(command);

    if (result.Item) {
      return Note.newInstanceFromDynamoDBObject(result.Item);
    }

    return undefined;
  }

  async upsertOne(data: Note) {
    const itemObject: Record<string, AttributeValue> = {
      noteId: {
        S: data.noteId,
      },
      content: {
        S: data.content,
      },
      createdAt: {
        N: String(data.createdAt.getTime()),
      },
    };

    if (data.title) {
      itemObject.title = {
        S: data.title,
      };
    }

    if (data.updatedAt) {
      itemObject.updatedAt = {
        N: String(data.updatedAt.getTime()),
      };
    }

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: itemObject,
    });

    await this.client.send(command);

    return data;
  }

  async deleteById(noteId: string) {
    const command = new DeleteItemCommand({
      TableName: this.tableName,
      Key: {
        noteId: {
          S: noteId,
        },
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnValues: 'ALL_OLD',
    });

    const result = await this.client.send(command);
    if (result.Attributes) {
      return true;
    }
    return false;
  }
}

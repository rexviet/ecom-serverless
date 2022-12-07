import { IFileRepository } from '../../repositories/file.repository';

export interface IUploadFileToBlobStorageUS {
  execute(fileData: Buffer, fileName: string, contentType: string): Promise<void>;
}

export class UploadFileToBlobStorageUS implements IUploadFileToBlobStorageUS {
  constructor(private readonly repository: IFileRepository) {}

  public async execute(fileData: Buffer, fileName: string, contentType: string): Promise<void> {
    return this.repository.upload(fileData, fileName, contentType);
  }
}

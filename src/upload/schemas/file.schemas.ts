import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema({
  timestamps: true,
})
export class FileUpload {
  @Prop([String])
  images: [string]
}

export const FileUploadSchema = SchemaFactory.createForClass(FileUpload);

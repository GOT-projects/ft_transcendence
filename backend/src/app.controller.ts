import { Controller, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Put, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Request } from "express";
import { AppService } from "./app.service";
import { diskStorage } from "multer";
import { FileFastifyInterceptor, MulterFile } from "fastify-file-interceptor";

interface MultipartFile {
	toBuffer: () => Promise<Buffer>;
	file: NodeJS.ReadableStream;
	filepath: string;
	fieldname: string;
	filename: string;
	encoding: string;
	mimetype: string;
	fields: import("@fastify/multipart").MultipartFields;
}

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
	) {}

	@Put('upload')
	@UseInterceptors(
		FileFastifyInterceptor("file", {
			storage: diskStorage({
				destination: "./images",
			}),
		})
	)
	async changeProfileImage(@Req() req: Request, @UploadedFile(
		new ParseFilePipe({
		  validators: [
			new MaxFileSizeValidator({ maxSize: 10000000 }),
		  ],
		}),
	) file: MulterFile) {
		if (!req?.headers?.authorization || !file)
			throw new HttpException('No authorization header or no file', HttpStatus.BAD_REQUEST);
		const jwt = req.headers.authorization.split(' ')[1];
		return await this.appService.changeProfilImage(jwt, file);
	}

	@Get('images/:file')
	async getProfilImage(@Req() req: Request, @Param('file') file: string) {
		return await this.appService.getProfilImage(file);
	}
}
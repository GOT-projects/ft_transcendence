import { ConfigModule, ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";

export const multerModule = MulterModule.registerAsync({
	imports: [ConfigModule], 
	useFactory: async (configService: ConfigService) => ({
		dest: './images'
	  }),
	  inject: [ConfigService],
});

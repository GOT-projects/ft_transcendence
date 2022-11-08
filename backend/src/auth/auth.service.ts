import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

    async connect_intra(req: any) : Promise<string> {
        
        return 'test';
    }
}

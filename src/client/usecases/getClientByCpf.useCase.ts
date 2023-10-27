import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ClientRepository } from "../client.repository";
import { Client } from "../client.entity";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GetClientByCpfuseCase {

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService
  ) { }

  async handle(cpf: string): Promise<Client | null> {

    let url = this.configService.get<string>('AZURE_FUNCTION_URL') as string;
    let key = this.configService.get<string>('AZURE_FUNCTION_AUTHENTICATE_KEY');

    try {

      let result = await firstValueFrom(this.httpService.get<any>(url, {
        headers: {
          "x-functions-key": key
        }
      }));
      let person = result.data

      if (!person)
        throw new NotFoundException("Client not found");

      return person;

    } catch {
      throw new BadRequestException('azure function failed');
    }
  }
}
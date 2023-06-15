import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) { }

  getByCpf(cpf: string): Promise<Client | null> {
    return this.clientRepository.findOne({
      where: {
        cpf: cpf,
      }
    });
  }
}

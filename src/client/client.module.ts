import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "./client.entity";
import { Order } from "../order/order.entity";
import { ClientController } from "./client.controller";
import { ClientRepository } from "./client.repository";
import { HttpModule } from "@nestjs/axios";
import { CreateClientuseCase } from "./usecases/createClient.useCase";
import { GetClientByCpfuseCase } from "./usecases/getClientByCpf.useCase";
import { ReponseHttpHelper } from "../presentation/helpers/exception.http.helper";
import { IsUniqueCpfuseCase } from "./usecases/isUniqueCpf.useCase";

@Module({
    imports: [
        TypeOrmModule.forFeature([Client, Order]),
        HttpModule
    ],
    controllers: [ClientController],
    providers: [
        ReponseHttpHelper,
        ClientRepository,
        IsUniqueCpfuseCase,
        GetClientByCpfuseCase,
        CreateClientuseCase,
    ],
    exports : [
        GetClientByCpfuseCase
    ]
})
export class ClientModule {
    constructor() { }
}

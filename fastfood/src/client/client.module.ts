import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "./client.entity";
import { Order } from "src/order/order.entity";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";
import { DataSource } from "typeorm";
import { Cart, ItemCart } from "src/cart/cart.entity";
import { Product } from "src/product/product.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'soatuser',
        password: 'soatpassword',
        database: 'soatdb',
        entities: [Client, Order, Cart, ItemCart, Product],
        synchronize: true,
        }),
        TypeOrmModule.forFeature([Client, Order])
    ],
    controllers: [ClientController],
    providers: [ClientService],
})
export class ClientModule {
constructor(private dataSource: DataSource) { }
}

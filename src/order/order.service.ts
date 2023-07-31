import { ItemCart } from './../cart/cart.entity';
import { Injectable } from '@nestjs/common';
import { Order, StatusOrder } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateOrderDTO } from './dto/createorder.dto';
import { Product } from 'src/product/product.entity';
import { Client } from 'src/client/client.entity';
import { ConflictException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { UpdateStatusOrderDTO } from './dto/updatestatusorder.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) { }

  getAll(status: string): Promise<Order[]> {
    if (!status) {
      return this.ordersRepository.find();
    }
    return this.ordersRepository.find({ where: { status: +status }, order: { dateTime: "ASC" } });
  }

  async findById(orderId: number){
    var storedOrder = await this.ordersRepository.findOneBy({ id: orderId})
    
    if (!storedOrder) 
      throw new NotFoundException();

    return storedOrder;
  }

  async fakeCheckout(orderId: number){
    var storedOrder = await this.ordersRepository.findOneBy({ id: orderId})
    
    if (!storedOrder) 
      throw new NotFoundException();
    
    storedOrder.status = StatusOrder.FINALIZADO;
    await this.ordersRepository.save(storedOrder);

    return storedOrder;
  }

  async getAllUnfinished(): Promise<Order[]> {

    let orders = await this.ordersRepository.find({
       where: { status: Not(StatusOrder.FINALIZADO) }
       , order: { dateTime: "ASC" } 
       , relations : {
          cart: {
            itens: {
              product : true
            }
          },
          client: true
       }
      });

    return orders.sort((order1, order2) => {
      if(order1.status > order2.status)
        return -1
      return 1;
    })
  }



  
  async save(orderDto: CreateOrderDTO): Promise<Order> {

    var order = new Order();
    order.observation = orderDto.observation;
    order.cart = orderDto.cart;
    order.client = orderDto.client;
    order.dateTime = Date.now().toString()


    order.cart.itens = await this.getExistentProducts(orderDto.cart.itens);
    order.client = await this.getExistentClient(orderDto.client);

    return await this.ordersRepository.save(order);

  }

  private async getExistentProducts(itensCard: ItemCart[]): Promise<ItemCart[]> {
    for (const itemCart of itensCard) {

      var product = await this.productRepository.findOne({ where: { code: itemCart.product.code } });

      if (product) {
        itemCart.product = product;
      }
    }

    return itensCard;
  }

  private async getExistentClient(client: Client) {

    var clientExist = await this.clientRepository.findOne({ where: { cpf: client.cpf } });

    if (clientExist)
      client = clientExist

    return client;

  }

  async updateStatus(orderId: string, updateStatusOrderDTO: UpdateStatusOrderDTO): Promise<Order> {
    var order = await this.ordersRepository.findOneBy({
      id: +orderId
    })
    
    if(!order){
      throw new NotFoundException()
    }

    order.status = updateStatusOrderDTO.status

    return this.ordersRepository.save(order);

  }
}

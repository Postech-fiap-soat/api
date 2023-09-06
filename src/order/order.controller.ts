import { CheckoutOrderuseCase } from './useCases/checkoutOrder.useCase';
import { ConflictException, NotFoundException, Patch, Put } from '@nestjs/common';
import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import { Order } from './order.entity';
import { CreateOrderDTO } from './dto/createorder.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateStatusOrderDTO } from './dto/updatestatusorder.dto';
import { GetAllOrdersuseCase } from './useCases/getAllOrders.useCase';
import { GetOrdersUnfinisheduseCase } from './useCases/getOrdersUnfinished.useCase';
import { GetOrdersByStatususeCase } from './useCases/getOrdersByStatus.useCase';
import { CreateOrderuseCase } from './useCases/createOrder.useCase';
import { UpdateStatusOrderuseCase } from './useCases/updateStatusOrder.useCase';
import { GetOrderByIduseCase } from './useCases/getOrderById.useCase';
import { ResponseDTO } from 'src/presentation/helpers/response.dto';
import { ReponseHttpHelper } from 'src/presentation/helpers/excption.http.helper';
import { HttpStatusCode } from 'axios';

@Controller("api/v1/orders")
@ApiTags('orders')
export class OrderController {
  constructor(
    private readonly reponseHttpHelper: ReponseHttpHelper,
    private readonly createOrderuseCase: CreateOrderuseCase,
    private readonly getOrdersByStatususeCase: GetOrdersByStatususeCase,
    private readonly getAllOrdersuseCase: GetAllOrdersuseCase,
    private readonly getOrdersUnfinisheduseCase: GetOrdersUnfinisheduseCase,
    private readonly checkoutOrderuseCase: CheckoutOrderuseCase,
    private readonly updateStatusOrderuseCase: UpdateStatusOrderuseCase,
    private readonly getOrderByIduseCase: GetOrderByIduseCase,
  ) { }

  @Get()
  @ApiOperation({ summary: 'get orders by status' })
  async getAll(@Query('status') status: string): Promise<ResponseDTO> {

    try {
      const orders = status ?
        await this.getOrdersByStatususeCase.handle(status) :
        await this.getAllOrdersuseCase.handle();

      return this.reponseHttpHelper.handleReponse(HttpStatusCode.Ok, '', orders)
    } catch (error) {
      return this.reponseHttpHelper.handleException(error);
    }
  }


  @Get("unfinished")
  @ApiOperation({ summary: 'get orders unfinished' })
  async getAllUnfinished(): Promise<ResponseDTO> {
    try {
      const orders = await this.getOrdersUnfinisheduseCase.handle();

      return this.reponseHttpHelper.handleReponse(HttpStatusCode.Ok, '', orders)
    } catch (error) {
      return this.reponseHttpHelper.handleException(error);
    }
  }

  @Get("/:id/status-pagamento")
  @ApiOperation({ summary: 'get order payment status' })
  async getPaymentStatus(@Param('id') orderId: string): Promise<ResponseDTO> {
    try {

      const order = await this.getOrderByIduseCase.handle(+orderId);

      return this.reponseHttpHelper.handleReponse(HttpStatusCode.Ok, '', order.paymentstatus)

    } catch (error) {
      return this.reponseHttpHelper.handleException(error);
    }
  }

  @Post()
  @ApiBody({
    type: CreateOrderDTO
  })
  @ApiOperation({ summary: 'create order' })
  async post(@Body() orderDto: CreateOrderDTO): Promise<ResponseDTO> {
    try {
      let order = await this.createOrderuseCase.handle(orderDto);
      return this.reponseHttpHelper.handleReponse(HttpStatusCode.Created, '', order)

    } catch (error) {
      return this.reponseHttpHelper.handleException(error);
    }
  }

  @Put("checkout")
  @ApiOperation({ summary: 'finish de order' })
  async put(@Query('orderId') orderId: number): Promise<any> {
    try {
      let order = await this.checkoutOrderuseCase.handle(orderId)

      return this.reponseHttpHelper.handleReponse(HttpStatusCode.Ok, 'order was finished', order)
    } catch (error) {
      return this.reponseHttpHelper.handleException(error);
    }
  }

  @Patch("/:id/status")
  @ApiOperation({ summary: 'update status order' })
  async updateStatus(@Param('id') orderId: number, @Body() updateStatusOrderDTO: UpdateStatusOrderDTO): Promise<any> {
    try {
      let order = await this.updateStatusOrderuseCase.handle(orderId, updateStatusOrderDTO)

      return this.reponseHttpHelper.handleReponse(HttpStatusCode.Ok, 'status was updated', order)
    } catch (error) {
      return this.reponseHttpHelper.handleException(error);
    }
  }

}
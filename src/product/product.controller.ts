import { Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Res } from "@nestjs/common";
import { CreateProductDTO } from "./dto/createproduct.dto";
import { UpdateProductDTO } from "./dto/updateproduct.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetProductsByCategoryuseCase } from './usecases/getproductsbycategory.usecase';
import { GetAllProductsuseCase } from './usecases/getallproducts.usecase';
import { CreateProductuseCase } from './usecases/createproduct.usecase';
import { UpdateProductuseCase } from './usecases/updateproduct.usecase';
import { DeleteProductuseCase } from './usecases/deleteproduct.usecase';
import { ReponseHttpHelper } from "../presentation/helpers/exception.http.helper";
import { ResponseDTO } from "../presentation/helpers/response.dto";

@Controller("/api/v1/products")
@ApiTags('products')
export class ProductController {
  constructor(
    private readonly reponseHttpHelper: ReponseHttpHelper,
    private readonly getProductByCategoryuseCase: GetProductsByCategoryuseCase,
    private readonly createProductuseCase: CreateProductuseCase,
    private readonly updateProductuseCase: UpdateProductuseCase,
    private readonly deleteProductuseCase: DeleteProductuseCase,
    private readonly getAllProductsuseCase: GetAllProductsuseCase) { }

  @Get()
  @ApiOperation({ summary: 'get products by category' })
  async getAll(@Query('category') category: string): Promise<ResponseDTO> {

    try {
      let products = category ?
        await this.getProductByCategoryuseCase.handle(category) :
        await this.getAllProductsuseCase.handle();

      return this.reponseHttpHelper.handleReponse(200, '', products)

    } catch (error) {
      return this.reponseHttpHelper.handleException(error);
    }
  }

  @Post()
  @ApiOperation({ summary: 'create product' })
  async create(@Body() createProductDto: CreateProductDTO): Promise<ResponseDTO> {
    try {
      let product = await this.createProductuseCase.handle(createProductDto)
      return this.reponseHttpHelper.handleReponse(201, 'product was created successfully', product)
    } catch (error) {
      return this.reponseHttpHelper.handleException(error);
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'update product by id' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDTO): Promise<ResponseDTO> {
    try {
      let product = await this.updateProductuseCase.handle(id, updateProductDto)
      return this.reponseHttpHelper.handleReponse(200, 'product was updated successfully', product)
    } catch (error) {
      return this.reponseHttpHelper.handleException(error);
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'delete product by id' })
  async delete(@Param('id') id: number): Promise<ResponseDTO> {
    try {
      await this.deleteProductuseCase.handle(id);
      return this.reponseHttpHelper.handleReponse(200, 'product was deleted successfully', null)
    } catch (error) {
      return this.reponseHttpHelper.handleException(error);
    }
  }
}

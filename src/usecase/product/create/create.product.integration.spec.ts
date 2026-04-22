import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";
import { InputCreateProductDto, OutputCreateProductDto } from "./create.product.dto";
import Product from "../../../domain/product/entity/product";
import { OutputCreateCustomerDto } from "../../customer/create/create.customer.dto";

describe("Integration test for product create use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);

        const product = new Product("123", "Product 1", 100);

        await productRepository.create(product);

        const input: InputCreateProductDto = {
            name: "Product 1",
            price: 100,
            type: "a"
        }

        const output: OutputCreateProductDto = {
            id: expect.any(String),
            name: "Product 1",
            price: 100,
        }

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
    });

});
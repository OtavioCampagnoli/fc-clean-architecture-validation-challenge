import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ListProductUseCase from "./list.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { OutputListProductDto } from "./list.product.dto";

describe("Integration test for list product use case", () => {
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

    it("should list all products", async () => {
        const productRepository = new ProductRepository();
        const useCase = new ListProductUseCase(productRepository);

        const product1 = new ProductModel({
            id: "123",
            name: "Product 1",
            price: 100,
        });
        await product1.save();
        const product2 = new ProductModel({
            id: "456",
            name: "Product 2",
            price: 200,
        });
        await product2.save();

        const input = {};
        const output: OutputListProductDto = {
            products: [
                {
                    id: "123",
                    name: "Product 1",
                    price: 100,
                },
                {
                    id: "456",
                    name: "Product 2",
                    price: 200,
                },
            ]
        };
        const result = await useCase.execute(input);
        expect(result).toEqual(output);
    });
});
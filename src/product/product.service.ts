import { Injectable } from '@nestjs/common';
import { ProductModel } from './product.model';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ReviewModel } from '../review/review.model';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(ProductModel)
        private readonly productModel: ModelType<ProductModel>,
    ) {}

    async create(dto: CreateProductDto) {
        return this.productModel.create(dto);
    }

    async findById(id: string) {
        return this.productModel.findById(id).exec();
    }

    async deleteById(id: string) {
        return this.productModel.findByIdAndDelete(id).exec();
    }

    async updateById(id: string, dto: CreateProductDto) {
        return this.productModel.findOneAndReplace({ _id: id }, dto, {
            new: true,
        });
    }

    async findWithReviews(dto: FindProductDto) {
        return (await this.productModel
            .aggregate([
                {
                    $match: {
                        categories: dto.category,
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
                {
                    $limit: dto.limit,
                },
                {
                    $lookup: {
                        from: 'Review',
                        localField: '_id',
                        foreignField: 'productId',
                        as: 'review',
                    },
                },
                {
                    $addFields: {
                        reviewCount: { $size: '$review' },
                        reviewAvg: { $avg: '$review.rating' },
                        review: {
                            $function: {
                                body: `function (review) {
                                    review.sort((a, b) => new Date(a.createdAt) - new Date(a.createdAt))
                                    return review;
                                }`,
                                arg: ['$review'],
                                lang: 'js',
                            },
                        },
                    },
                },
            ])
            .exec()) as unknown as (ProductModel & {
            review: ReviewModel[];
            reviewCount: number;
            reviewAvg: number;
        })[];
    }
}

import { Injectable } from '@nestjs/common';
import { ReviewModel } from './review.model';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { CreateReviewDto } from './dto/create-review.dto';
import * as mongoose from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';

class Leak {}

const leaks = [];

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(ReviewModel)
        private readonly reviewModel: ModelType<ReviewModel>,
    ) {}

    async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
        return this.reviewModel.create(dto);
    }

    async delete(id: string): Promise<DocumentType<ReviewModel> | null> {
        return this.reviewModel.findByIdAndDelete(id).exec();
    }

    async findByProductId(
        productId: string,
    ): Promise<DocumentType<ReviewModel>[]> {
        return this.reviewModel
            .find({ productId: new mongoose.Types.ObjectId(productId) })
            .exec();
    }

    async deleteByProductId(productId: string) {
        leaks.push(new Leak());
        return this.reviewModel
            .deleteMany({
                productId: new mongoose.Types.ObjectId(productId),
            })
            .exec();
    }
}

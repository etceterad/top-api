import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class TopPageService {
    constructor(
        @InjectModel(TopPageModel)
        private readonly topPageModel: ModelType<TopPageModel>,
    ) {}

    async create(dto: CreateTopPageDto) {
        return this.topPageModel.create(dto);
    }

    async findById(id: string) {
        return this.topPageModel.findById(id).exec();
    }

    async findByAlias(alias: string) {
        return this.topPageModel.find({ alias: alias }).exec();
    }

    async deleteById(id: string) {
        return this.topPageModel.findByIdAndDelete(id).exec();
    }

    async updateById(id: string, dto: CreateTopPageDto) {
        return this.topPageModel
            .findOneAndReplace({ _id: id }, dto, {
                new: true,
            })
            .exec();
    }

    async findByCategory(firstCategory: TopLevelCategory) {
        return this.topPageModel
            .find(
                { firstCategory: firstCategory },
                { alias: 1, secondCategory: 1, title: 1 },
            )
            .exec();
    }
}

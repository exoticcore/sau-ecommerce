"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoryService = class CategoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async uploadImage(file, info) {
        let fileType;
        if (file.mimetype === 'image/png')
            fileType = 'png';
        const fileName = `${info.title}_${Date.now()}.${fileType}`;
        const filePath = `upload/category/${fileName}`;
        (0, fs_1.renameSync)(file.path, filePath);
        const created = await this.prisma.category.create({
            data: {
                title: info.title,
                file_name: fileName,
                content_type: file.mimetype,
                local: filePath,
            },
        });
        console.log(created);
        return created;
    }
    async getAllCategoryImage() {
        return await this.prisma.category.findFirst();
    }
    async deleteImage(id) {
        return await this.prisma.category.delete({
            where: {
                id: id,
            },
        });
    }
    async deleteAll() {
        return await this.prisma.category.deleteMany();
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryService);
//# sourceMappingURL=category.service.js.map
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const category_service_1 = require("./category.service");
const create_database_dto_1 = require("./dto/create-database.dto");
const path_1 = require("path");
const promises_1 = require("fs/promises");
const stream_1 = require("stream");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async uploadPicture(file, myInfo) {
        if (file) {
            return this.categoryService.uploadImage(file, myInfo);
        }
        return null;
    }
    async getPicture(param, bucket, res) {
        const mongo = await this.categoryService.getAllCategoryImage();
        const fileBase64 = await (0, promises_1.readFile)((0, path_1.join)(process.cwd(), mongo.local), 'base64');
        const fileBuffer = Buffer.from(fileBase64, 'base64');
        const fileStream = stream_1.Readable.from(fileBuffer);
        res.set({
            'Content-Type': 'image/png',
            'Content-Deisposition': ``,
        });
        return fileStream.pipe(res);
    }
    async deleteAllPicture() {
        return await this.categoryService.deleteAll();
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Post)('/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('picture')),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: 'image/png' || 'image/jpg' || 'image/jpeg',
    })
        .build({
        errorHttpStatusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
    }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_database_dto_1.UploadPictureDTO]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "uploadPicture", null);
__decorate([
    (0, common_1.Get)('/:picture/:bucket'),
    __param(0, (0, common_1.Param)('picture')),
    __param(1, (0, common_1.Param)('bucket')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getPicture", null);
__decorate([
    (0, common_1.Delete)('/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteAllPicture", null);
exports.CategoryController = CategoryController = __decorate([
    (0, common_1.Controller)('/category'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
//# sourceMappingURL=category.controller.js.map
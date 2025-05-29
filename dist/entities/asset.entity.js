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
exports.Asset = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const category_entity_1 = require("./category.entity");
const tag_entity_1 = require("./tag.entity");
let Asset = class Asset {
};
exports.Asset = Asset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Asset.prototype, "asset_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Asset.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Asset.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1024 }),
    __metadata("design:type", String)
], Asset.prototype, "file_path", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Asset.prototype, "file_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Asset.prototype, "mime_type", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Asset.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Asset.prototype, "upload_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.assets, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], Asset.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => category_entity_1.Category, (category) => category.assets),
    (0, typeorm_1.JoinTable)({
        name: 'asset_categories',
        joinColumn: { name: 'asset_id', referencedColumnName: 'asset_id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'category_id' }
    }),
    __metadata("design:type", Array)
], Asset.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => tag_entity_1.Tag, (tag) => tag.assets),
    (0, typeorm_1.JoinTable)({
        name: 'asset_tags',
        joinColumn: { name: 'asset_id', referencedColumnName: 'asset_id' },
        inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tag_id' }
    }),
    __metadata("design:type", Array)
], Asset.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Asset.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Asset.prototype, "updated_at", void 0);
exports.Asset = Asset = __decorate([
    (0, typeorm_1.Entity)('assets')
], Asset);

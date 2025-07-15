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
exports.ExcelImportExportService = void 0;
const prisma_service_1 = require("../prisma/prisma.service");
const member_system_type_enum_1 = require("../members/enums/member-system-type.enum");
const common_1 = require("@nestjs/common");
const ExcelJS = require("exceljs");
const library_1 = require("../../generated/prisma/runtime/library");
const loyalty_card_utils_1 = require("../utils/loyalty-card.utils");
let ExcelImportExportService = class ExcelImportExportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async exportExcel(res, count, businessId) {
        try {
            const members = await this.prisma.member.findMany({
                where: {
                    BusinessID: businessId,
                },
                include: {
                    HeldCardType: true,
                },
            });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('TestExportXLS');
            worksheet.columns = [
                { header: 'MemberID', key: 'MemberID', width: 15 },
                { header: 'FirstName', key: 'FirstName', width: 25 },
                { header: 'LastName', key: 'LastName', width: 25 },
                { header: 'MobileNumber', key: 'MobileNumber', width: 25 },
                { header: 'Email', key: 'Email', width: 25 },
                { header: 'MemberType', key: 'MemberType', width: 20 },
                { header: 'Gender', key: 'Gender', width: 20 },
                { header: 'Address', key: 'Address', width: 35 },
                { header: 'Age', key: 'Age', width: 15 },
                { header: 'CardTypeName', key: 'CardTypeName', width: 25 },
                { header: 'SmartCardNumber', key: 'SmartCardNumber', width: 25 },
                {
                    header: 'CurrentLoyaltyPoints',
                    key: 'CurrentLoyaltyPoints',
                    width: 25,
                },
            ];
            const memberTypes = [
                'Patient',
                'Consultant',
                'Regular',
                'VIP',
                'Standard',
            ];
            const cardTypes = ['Silver Card', 'Gold Card', 'Platinum Card'];
            const GenderType = ['Male', 'Female', 'Other'];
            let currentIndex = 0;
            members.forEach((m, index) => {
                const row = worksheet.addRow({
                    MemberID: m && m.MemberID ? m.MemberID : '',
                    FirstName: m && m.FirstName ? m.FirstName : '',
                    LastName: m && m.LastName ? m.LastName : '',
                    MobileNumber: m && m.MobileNumber ? `'${m.MobileNumber}` : '',
                    Email: m && m.Email ? m.Email : '',
                    MemberType: m && m.MemberType ? m.MemberType : '',
                    Gender: m && m.Gender ? m.Gender : '',
                    Address: m && m.Address ? m.Address : '',
                    Age: m && m.Age ? m.Age : '',
                    CardTypeName: m && m.HeldCardType ? m.HeldCardType?.CardName : '',
                    SmartCardNumber: m && m.SmartCardNumber ? `'${m.SmartCardNumber}` : '',
                    CurrentLoyaltyPoints: m.CurrentLoyaltyPoints?.toNumber() ?? '',
                });
                currentIndex = row.number;
                if (index < count) {
                    worksheet.getCell(`F${currentIndex}`).dataValidation = {
                        type: 'list',
                        allowBlank: true,
                        formulae: [`"${memberTypes.join(',')}"`],
                    };
                    worksheet.getCell(`J${currentIndex}`).dataValidation = {
                        type: 'list',
                        allowBlank: true,
                        formulae: [`"${cardTypes.join(',')}"`],
                    };
                    worksheet.getCell(`G${currentIndex}`).dataValidation = {
                        type: 'list',
                        allowBlank: true,
                        formulae: [`"${GenderType.join(',')}"`],
                    };
                }
            });
            if (members.length < count) {
                const extraRows = count - members.length;
                for (let i = 0; i < extraRows; i++) {
                    const row = worksheet.addRow({
                        MemberId: '',
                        FirstName: '',
                        LastName: '',
                        MobileNumber: '',
                        Email: '',
                        MemberType: '',
                        Gender: '',
                        Address: '',
                        Age: '',
                        CardTypeName: '',
                        SmartCardNumber: '',
                        CurrentLoyaltyPoints: '',
                    });
                    currentIndex = row.number;
                    worksheet.getCell(`F${currentIndex}`).dataValidation = {
                        type: 'list',
                        allowBlank: true,
                        formulae: [`"${memberTypes.join(',')}"`],
                    };
                    worksheet.getCell(`J${currentIndex}`).dataValidation = {
                        type: 'list',
                        allowBlank: true,
                        formulae: [`"${cardTypes.join(',')}"`],
                    };
                    worksheet.getCell(`G${currentIndex}`).dataValidation = {
                        type: 'list',
                        allowBlank: true,
                        formulae: [`"${GenderType.join(',')}"`],
                    };
                }
            }
            worksheet.getRow(1).eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E3E3E3' },
                };
                cell.font = {
                    bold: true,
                };
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
            worksheet.eachRow((row) => {
                row.eachCell((cell) => {
                    cell.protection = { locked: false };
                });
            });
            worksheet.getColumn('A').eachCell((cell) => {
                cell.protection = { locked: true };
            });
            worksheet.getColumn('K').eachCell((cell) => {
                cell.protection = { locked: true };
            });
            await worksheet.protect('secure123', {
                selectLockedCells: true,
                selectUnlockedCells: true,
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=member_list.xlsx');
            await workbook.xlsx.write(res);
            res.end();
        }
        catch (err) {
            console.log('File genration failed ', err);
            throw new common_1.InternalServerErrorException('Could not generate Excel file');
        }
    }
    async inportExcel(worksheet, currentUser) {
        let unique;
        try {
            const members = [];
            const unknownCardTypes = [];
            const allCardTypes = await this.prisma.cardType.findMany({
                where: {
                    BusinessID: currentUser.BusinessID,
                },
            });
            const cardTypeMap = new Map(allCardTypes.map((card) => [card.CardName, card.CardTypeID]));
            const latestMember = await this.prisma.member.findFirst({
                orderBy: { MemberID: 'desc' },
                select: { SmartCardNumber: true },
            });
            let smartCardCounter = parseInt(latestMember?.SmartCardNumber ?? '0000000000000000');
            const memberRows = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1)
                    return;
                const firstName = row.getCell(2).value?.toString() || '';
                const lastName = row.getCell(3).value?.toString() || '';
                const mobile = row.getCell(4).value?.toString() || '';
                const email = row.getCell(5).value?.toString() || '';
                if (!firstName || !lastName || !mobile || !email)
                    return;
                const parsedMemberID = parseInt(row.getCell(1).value?.toString() || '');
                const isNew = isNaN(parsedMemberID) || parsedMemberID === 0;
                memberRows.push({
                    row,
                    isNew,
                    memberID: isNew ? undefined : parsedMemberID,
                });
            });
            for (const { row, isNew } of memberRows) {
                const cardName = row.getCell(10).value?.toString()?.trim() || '';
                const cardTypeId = cardTypeMap.get(cardName) ?? null;
                if (cardName && !cardTypeId) {
                    unknownCardTypes.push(cardName);
                }
                let mobileNumber = row.getCell(4).value?.toString();
                if (mobileNumber?.startsWith("'")) {
                    mobileNumber = mobileNumber.slice(1);
                }
                let smartCardNumber;
                if (isNew) {
                    smartCardCounter++;
                    smartCardNumber = smartCardCounter.toString().padStart(16, '0');
                }
                else {
                    smartCardNumber = row.getCell(11).value?.toString() || '';
                }
                if (smartCardNumber?.startsWith("'")) {
                    smartCardNumber = smartCardNumber.slice(1);
                }
                const member = {
                    BusinessID: currentUser.BusinessID,
                    MemberID: parseInt(row.getCell(1).value?.toString() || ''),
                    FirstName: row.getCell(2).value?.toString() || '',
                    LastName: row.getCell(3).value?.toString() || '',
                    MobileNumber: mobileNumber || '',
                    Email: row.getCell(5).value?.toString() || '',
                    MemberType: row.getCell(6).value?.toString() || '',
                    Gender: row.getCell(7).value?.toString() || '',
                    Address: row.getCell(8).value?.toString() || '',
                    Age: parseInt(row.getCell(9).value?.toString() || ''),
                    CardTypeID: cardTypeId,
                    SmartCardNumber: smartCardNumber,
                    CurrentLoyaltyPoints: parseInt(row.getCell(12)?.toString() ?? ''),
                    RegisteredByUserID: currentUser.UserID,
                };
                members.push(member);
            }
            if (unknownCardTypes.length > 0) {
                unique = [...unknownCardTypes];
                throw new common_1.BadRequestException(`Card type not found: ${unique}`);
            }
            for (const member of members) {
                const { MemberID, MemberType, Gender, ...rest } = member;
                const data = {
                    ...rest,
                    MemberType: MemberType
                        ? { set: MemberType }
                        : undefined,
                    Gender: Gender ? { set: Gender } : null,
                };
                if (MemberID) {
                    await this.prisma.member.update({
                        where: {
                            MemberID,
                        },
                        data,
                    });
                }
                else {
                    const newMember = await this.prisma.member.create({
                        data: {
                            BusinessID: currentUser.BusinessID,
                            RegisteredByUserID: currentUser.UserID,
                            FirstName: member.FirstName,
                            LastName: member.LastName,
                            MobileNumber: member.MobileNumber,
                            Email: member.Email,
                            Gender: member.Gender || null,
                            Address: member.Address,
                            Age: member.Age,
                            ProfileImageURL: undefined,
                            SmartCardNumber: member.SmartCardNumber,
                            CardTypeID: member.CardTypeID,
                            CurrentLoyaltyPoints: member.CurrentLoyaltyPoints,
                            MemberType: member.MemberType ||
                                member_system_type_enum_1.MemberSystemType.Patient,
                        },
                        include: { Business: true, HeldCardType: true },
                    });
                    let cardTypeName = newMember.HeldCardType?.CardName ?? 'N/A';
                    const memberLoyaltyCard = await (0, loyalty_card_utils_1.generateLoyaltyCard)(newMember, cardTypeName);
                }
            }
            return {
                statusCode: 200,
                message: 'Data imported successfully.',
            };
        }
        catch (err) {
            if (err instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(`Card type not found:-  ${unique}`);
            }
            if (err instanceof library_1.PrismaClientKnownRequestError) {
                console.log(err);
                throw new common_1.BadRequestException('Please download lates file');
            }
            else {
                console.log('Error while importing file', err);
                throw new common_1.InternalServerErrorException('Error while importing file');
            }
        }
    }
};
exports.ExcelImportExportService = ExcelImportExportService;
exports.ExcelImportExportService = ExcelImportExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExcelImportExportService);
//# sourceMappingURL=excel-import-export.service.js.map
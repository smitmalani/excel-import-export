-- CreateTable
CREATE TABLE `Businesses` (
    `BusinessID` INTEGER NOT NULL AUTO_INCREMENT,
    `BusinessName` VARCHAR(255) NOT NULL,
    `Address` TEXT NULL,
    `LogoURL` VARCHAR(255) NULL,
    `PhoneNumber` VARCHAR(20) NULL,
    `IsActive` BOOLEAN NOT NULL DEFAULT true,
    `CreatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`BusinessID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `BusinessID` INTEGER NULL,
    `Role` ENUM('SuperAdmin', 'BusinessAdmin', 'BusinessSubAdmin') NOT NULL,
    `Username` VARCHAR(100) NOT NULL,
    `PasswordHash` VARCHAR(255) NOT NULL,
    `FullName` VARCHAR(150) NULL,
    `Email` VARCHAR(255) NOT NULL,
    `IsActive` BOOLEAN NOT NULL DEFAULT true,
    `LastLogin` TIMESTAMP(0) NULL,
    `CreatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Users_Username_key`(`Username`),
    UNIQUE INDEX `Users_Email_BusinessID_key`(`Email`, `BusinessID`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CardTypes` (
    `CardTypeID` INTEGER NOT NULL AUTO_INCREMENT,
    `BusinessID` INTEGER NOT NULL,
    `CardName` VARCHAR(100) NOT NULL,
    `Description` TEXT NULL,

    UNIQUE INDEX `CardTypes_BusinessID_CardName_key`(`BusinessID`, `CardName`),
    PRIMARY KEY (`CardTypeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Members` (
    `MemberID` INTEGER NOT NULL AUTO_INCREMENT,
    `BusinessID` INTEGER NOT NULL,
    `MemberType` ENUM('Patient', 'Consultant', 'Regular', 'VIP', 'Standard') NOT NULL,
    `FirstName` VARCHAR(100) NOT NULL,
    `LastName` VARCHAR(100) NULL,
    `MobileNumber` VARCHAR(20) NOT NULL,
    `Email` VARCHAR(255) NULL,
    `Gender` ENUM('Male', 'Female', 'Other') NULL,
    `Address` TEXT NULL,
    `Age` INTEGER NULL,
    `ProfileImageURL` VARCHAR(255) NULL,
    `SmartCardNumber` VARCHAR(50) NULL,
    `CardTypeID` INTEGER NULL,
    `CurrentLoyaltyPoints` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `IsActive` BOOLEAN NOT NULL DEFAULT true,
    `RegisteredByUserID` INTEGER NULL,
    `CreatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Members_BusinessID_MobileNumber_key`(`BusinessID`, `MobileNumber`),
    UNIQUE INDEX `Members_BusinessID_SmartCardNumber_key`(`BusinessID`, `SmartCardNumber`),
    PRIMARY KEY (`MemberID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceOfferings` (
    `ServiceOfferingID` INTEGER NOT NULL AUTO_INCREMENT,
    `BusinessID` INTEGER NOT NULL,
    `ServiceName` VARCHAR(255) NOT NULL,
    `CardTypeID` INTEGER NOT NULL,
    `Description` TEXT NULL,
    `IsActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `ServiceOfferings_BusinessID_ServiceName_CardTypeID_key`(`BusinessID`, `ServiceName`, `CardTypeID`),
    PRIMARY KEY (`ServiceOfferingID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Departments` (
    `DepartmentID` INTEGER NOT NULL AUTO_INCREMENT,
    `BusinessID` INTEGER NOT NULL,
    `DepartmentName` VARCHAR(100) NOT NULL,
    `Description` TEXT NULL,
    `IsActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Departments_BusinessID_DepartmentName_key`(`BusinessID`, `DepartmentName`),
    PRIMARY KEY (`DepartmentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoyaltyRules` (
    `RuleID` INTEGER NOT NULL AUTO_INCREMENT,
    `BusinessID` INTEGER NOT NULL,
    `ServiceOfferingID` INTEGER NOT NULL,
    `RuleType` ENUM('Earn', 'Redeem') NOT NULL,
    `EarnPointPercentage` DECIMAL(5, 2) NULL,
    `PointsPerUnitCurrency` DECIMAL(10, 2) NULL,
    `Description` TEXT NULL,
    `IsActive` BOOLEAN NOT NULL DEFAULT true,
    `CreatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `LoyaltyRules_ServiceOfferingID_RuleType_key`(`ServiceOfferingID`, `RuleType`),
    PRIMARY KEY (`RuleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PointTransactions` (
    `TransactionID` INTEGER NOT NULL AUTO_INCREMENT,
    `BusinessID` INTEGER NOT NULL,
    `MemberID` INTEGER NOT NULL,
    `TransactionType` ENUM('Earn', 'Redeem', 'ManualAdjust', 'Expiry') NOT NULL,
    `Points` DECIMAL(12, 2) NOT NULL,
    `TransactionAmount` DECIMAL(12, 2) NULL,
    `RedeemedValue` DECIMAL(12, 2) NULL,
    `ServiceOfferingID` INTEGER NULL,
    `RuleID` INTEGER NULL,
    `BillNumber` VARCHAR(100) NULL,
    `Title` VARCHAR(255) NULL,
    `Description` TEXT NULL,
    `ProcessedByUserID` INTEGER NULL,
    `TransactionDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`TransactionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `LogID` INTEGER NOT NULL AUTO_INCREMENT,
    `BusinessID` INTEGER NULL,
    `UserID` INTEGER NULL,
    `ActionType` VARCHAR(100) NOT NULL,
    `TargetEntityType` VARCHAR(50) NULL,
    `TargetEntityID` INTEGER NULL,
    `OldValue` TEXT NULL,
    `NewValue` TEXT NULL,
    `Details` TEXT NULL,
    `Timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `IPAddress` VARCHAR(45) NULL,

    PRIMARY KEY (`LogID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_BusinessID_fkey` FOREIGN KEY (`BusinessID`) REFERENCES `Businesses`(`BusinessID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CardTypes` ADD CONSTRAINT `CardTypes_BusinessID_fkey` FOREIGN KEY (`BusinessID`) REFERENCES `Businesses`(`BusinessID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Members` ADD CONSTRAINT `Members_BusinessID_fkey` FOREIGN KEY (`BusinessID`) REFERENCES `Businesses`(`BusinessID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Members` ADD CONSTRAINT `Members_CardTypeID_fkey` FOREIGN KEY (`CardTypeID`) REFERENCES `CardTypes`(`CardTypeID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Members` ADD CONSTRAINT `Members_RegisteredByUserID_fkey` FOREIGN KEY (`RegisteredByUserID`) REFERENCES `Users`(`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOfferings` ADD CONSTRAINT `ServiceOfferings_BusinessID_fkey` FOREIGN KEY (`BusinessID`) REFERENCES `Businesses`(`BusinessID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOfferings` ADD CONSTRAINT `ServiceOfferings_CardTypeID_fkey` FOREIGN KEY (`CardTypeID`) REFERENCES `CardTypes`(`CardTypeID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Departments` ADD CONSTRAINT `Departments_BusinessID_fkey` FOREIGN KEY (`BusinessID`) REFERENCES `Businesses`(`BusinessID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoyaltyRules` ADD CONSTRAINT `LoyaltyRules_BusinessID_fkey` FOREIGN KEY (`BusinessID`) REFERENCES `Businesses`(`BusinessID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoyaltyRules` ADD CONSTRAINT `LoyaltyRules_ServiceOfferingID_fkey` FOREIGN KEY (`ServiceOfferingID`) REFERENCES `ServiceOfferings`(`ServiceOfferingID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PointTransactions` ADD CONSTRAINT `PointTransactions_BusinessID_fkey` FOREIGN KEY (`BusinessID`) REFERENCES `Businesses`(`BusinessID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PointTransactions` ADD CONSTRAINT `PointTransactions_MemberID_fkey` FOREIGN KEY (`MemberID`) REFERENCES `Members`(`MemberID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PointTransactions` ADD CONSTRAINT `PointTransactions_ServiceOfferingID_fkey` FOREIGN KEY (`ServiceOfferingID`) REFERENCES `ServiceOfferings`(`ServiceOfferingID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PointTransactions` ADD CONSTRAINT `PointTransactions_RuleID_fkey` FOREIGN KEY (`RuleID`) REFERENCES `LoyaltyRules`(`RuleID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PointTransactions` ADD CONSTRAINT `PointTransactions_ProcessedByUserID_fkey` FOREIGN KEY (`ProcessedByUserID`) REFERENCES `Users`(`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_BusinessID_fkey` FOREIGN KEY (`BusinessID`) REFERENCES `Businesses`(`BusinessID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;

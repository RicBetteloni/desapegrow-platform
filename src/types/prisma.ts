// Prisma Enums

export enum ItemRarity {
    COMMON = 'COMMON',
    UNCOMMON = 'UNCOMMON',
    RARE = 'RARE',
    LEGENDARY = 'LEGENDARY'
}

export enum ItemType {
    SEED = 'SEED',
    PLANT = 'PLANT',
    PRODUCT = 'PRODUCT'
}

export enum SourceType {
    NATURE = 'NATURE',
    MANUFACTURED = 'MANUFACTURED'
}

export enum GrowType {
    INDOOR = 'INDOOR',
    OUTDOOR = 'OUTDOOR'
}

export enum GrowSize {
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    LARGE = 'LARGE'
}

export enum AutoLevel {
    ENABLED = 'ENABLED',
    DISABLED = 'DISABLED'
}

export enum PlantStrain {
    INDICA = 'INDICA',
    SATIVA = 'SATIVA',
    HYBRID = 'HYBRID'
}

export enum GrowthStage {
    SEEDLING = 'SEEDLING',
    VEG = 'VEG',
    FLOWERING = 'FLOWERING',
    HARVEST = 'HARVEST'
}

export enum GameLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED'
}

export enum ProductStatus {
    AVAILABLE = 'AVAILABLE',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    DISCONTINUED = 'DISCONTINUED'
}

export enum ReviewStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export enum OrderStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

// Add other enums used in the application as necessary.
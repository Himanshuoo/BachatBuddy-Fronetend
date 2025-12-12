// Interface for Group Buying Product
export interface GroupBuyingProduct {
    id: number;
    productName: string;
    productImage: string;
    originalPrice: number;
    groupPrice: number;
    totalNeeded: number;
    currentJoined: number;
    category: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    expiresAt?: string;
    progressPercentage: number;
    isGroupComplete: boolean;
    hasUserJoined: boolean;
    savingsAmount?: number;
    savingsPercentage?: number;
    viewingNow?: number;
    timeLeft?: string;
}

// Interface for Join Group Request
export interface JoinGroupRequest {
    userId: number;
    groupBuyingProductId: number;
    quantity?: number;
}

// Interface for Join Group Response
export interface JoinGroupResponse {
    success: boolean;
    message: string;
    currentJoined: number;
    totalNeeded: number;
    isGroupComplete: boolean;
    progressPercentage: number;
}

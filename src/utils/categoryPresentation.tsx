import React from 'react';
import {
    Banknote,
    BriefcaseBusiness,
    Car,
    Clapperboard,
    Coffee,
    ForkKnife,
    Gift,
    GraduationCap,
    HandCoins,
    HeartPulse,
    Home,
    Landmark,
    PiggyBank,
    Receipt,
    ShoppingCart,
    Tag,
    Tv,
    Utensils,
    Zap,
    type LucideIcon,
} from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { Category } from '../modules/category/category.types';

export type CategoryIconKey =
    | 'shopping'
    | 'car'
    | 'home'
    | 'zap'
    | 'movie'
    | 'food'
    | 'salary'
    | 'bank'
    | 'gift'
    | 'health'
    | 'education'
    | 'coffee'
    | 'bills'
    | 'savings'
    | 'income'
    | 'other';

export type CategoryPalette = {
    key: string;
    color: string;
    backgroundColor: string;
};

export const CATEGORY_COLORS: CategoryPalette[] = [
    { key: 'blue', color: COLORS.primary, backgroundColor: '#dce8ff' },
    { key: 'red', color: '#b91c1c', backgroundColor: '#fee2e2' },
    { key: 'green', color: COLORS.success, backgroundColor: '#dcfce7' },
    { key: 'orange', color: '#c56a00', backgroundColor: '#ffedd5' },
    { key: 'purple', color: '#7c3aed', backgroundColor: '#ede9fe' },
    { key: 'gray', color: '#596170', backgroundColor: '#e5e7eb' },
];

const ICONS: Record<CategoryIconKey, LucideIcon> = {
    shopping: ShoppingCart,
    car: Car,
    home: Home,
    zap: Zap,
    movie: Clapperboard,
    food: Utensils,
    salary: BriefcaseBusiness,
    bank: Landmark,
    gift: Gift,
    health: HeartPulse,
    education: GraduationCap,
    coffee: Coffee,
    bills: Receipt,
    savings: PiggyBank,
    income: HandCoins,
    other: Tag,
};

export const CATEGORY_ICON_OPTIONS: Array<{ key: CategoryIconKey; label: string }> = [
    { key: 'shopping', label: 'Shopping' },
    { key: 'food', label: 'Food' },
    { key: 'car', label: 'Travel' },
    { key: 'home', label: 'Home' },
    { key: 'zap', label: 'Bills' },
    { key: 'movie', label: 'Fun' },
    { key: 'salary', label: 'Work' },
    { key: 'savings', label: 'Savings' },
    { key: 'health', label: 'Health' },
    { key: 'education', label: 'Study' },
    { key: 'gift', label: 'Gift' },
    { key: 'other', label: 'Other' },
];

const KEYWORD_PRESENTATION: Array<{
    keywords: string[];
    icon: CategoryIconKey;
    palette: CategoryPalette;
}> = [
    { keywords: ['grocery', 'groceries', 'shopping'], icon: 'shopping', palette: CATEGORY_COLORS[1] },
    { keywords: ['transport', 'car', 'uber', 'fuel', 'travel'], icon: 'car', palette: CATEGORY_COLORS[0] },
    { keywords: ['housing', 'rent', 'home', 'mortgage'], icon: 'home', palette: CATEGORY_COLORS[5] },
    { keywords: ['utilities', 'electric', 'bill', 'power'], icon: 'zap', palette: CATEGORY_COLORS[5] },
    { keywords: ['entertainment', 'movie', 'netflix', 'cinema'], icon: 'movie', palette: CATEGORY_COLORS[3] },
    { keywords: ['food', 'dining', 'restaurant'], icon: 'food', palette: CATEGORY_COLORS[1] },
    { keywords: ['salary', 'work', 'business', 'freelance'], icon: 'salary', palette: CATEGORY_COLORS[2] },
    { keywords: ['bank', 'interest'], icon: 'bank', palette: CATEGORY_COLORS[0] },
];

export const getIconComponent = (icon?: string): LucideIcon => {
    const key = (icon || 'other') as CategoryIconKey;
    return ICONS[key] || ICONS.other;
};

export const getCategoryPresentation = (category?: Pick<Category, 'title' | 'type' | 'icon' | 'color'>) => {
    if (!category) {
        return {
            Icon: ICONS.other,
            color: COLORS.primary,
            backgroundColor: '#eaf2ff',
        };
    }

    const explicitPalette = CATEGORY_COLORS.find((palette) => palette.color === category.color);
    if (category.icon || explicitPalette) {
        return {
            Icon: getIconComponent(category.icon),
            color: explicitPalette?.color || category.color || COLORS.primary,
            backgroundColor: explicitPalette?.backgroundColor || '#eaf2ff',
        };
    }

    const normalizedTitle = category.title.toLowerCase();
    const match = KEYWORD_PRESENTATION.find((item) =>
        item.keywords.some((keyword) => normalizedTitle.includes(keyword))
    );

    if (match) {
        return {
            Icon: ICONS[match.icon],
            color: match.palette.color,
            backgroundColor: match.palette.backgroundColor,
        };
    }

    const fallback = category.type === 'income' ? CATEGORY_COLORS[2] : CATEGORY_COLORS[0];
    return {
        Icon: category.type === 'income' ? Banknote : ICONS.other,
        color: fallback.color,
        backgroundColor: fallback.backgroundColor,
    };
};

export const renderCategoryIcon = (
    icon: string | undefined,
    color: string,
    size = 24,
    strokeWidth = 2
) => {
    const Icon = getIconComponent(icon);
    return <Icon color={color} size={size} strokeWidth={strokeWidth} />;
};

import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    StatusBar,
    TouchableOpacity,
    Alert,
    Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import { getCategories, deleteCategory } from '../services/categoryService';
import { Category } from '../category.types';
import { getCurrentUser } from '../../auth';
import { useLoading } from '../../../contexts/LoadingContext';
import { getTransactions } from '../../transaction/services/transactionService';
import AppHeader from '../../../components/common/AppHeader';
import SegmentedControl from '../../../components/common/SegmentedControl';
import CategoryModal from '../components/CategoryModal';
import { getCategoryPresentation } from '../../../utils/categoryPresentation';

const SCREEN_WIDTH = Dimensions.get('window').width;
const H_PADDING = 24;
const TILE_GAP = 12;
const TILE_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - TILE_GAP) / 2;

export default function CategoryListScreen() {
    const insets = useSafeAreaInsets();
    const { setIsLoading } = useLoading();
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactionCounts, setTransactionCounts] = useState<Record<string, number>>({});
    const [selectedType, setSelectedType] = useState<Category['type']>('expense');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        const user = getCurrentUser();
        if (user) {
            const [cats, txns] = await Promise.all([
                getCategories(user.uid),
                getTransactions(user.uid),
            ]);
            const counts = txns.reduce<Record<string, number>>((acc, txn) => {
                acc[txn.category] = (acc[txn.category] || 0) + 1;
                return acc;
            }, {});

            setCategories(cats);
            setTransactionCounts(counts);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, [loadData]);

    const handleDelete = async (category: Category) => {
        Alert.alert(
            'Delete Category',
            `Are you sure you want to delete "${category.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const user = getCurrentUser();
                        if (!user) return;

                        setIsLoading(true);
                        try {
                            await deleteCategory(user.uid, category.id);
                            await loadData();
                        } catch (err: any) {
                            if (err.message === 'CATEGORY_IN_USE') {
                                Alert.alert(
                                    'Cannot Delete',
                                    'This category is used by existing transactions. Please delete or reassign them first.',
                                );
                            } else {
                                Alert.alert('Error', 'Failed to delete category.');
                            }
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ],
        );
    };

    const filteredCategories = categories.filter((c) => c.type === selectedType);

    // Build rows of 2
    const rows: Category[][] = [];
    for (let i = 0; i < filteredCategories.length; i += 2) {
        rows.push(filteredCategories.slice(i, i + 2));
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} translucent={false} />
            <AppHeader />

            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Categories</Text>
                    <Text style={styles.subtitle}>Manage your spending and earning tags</Text>
                </View>

                {/* Segmented Control */}
                <View style={styles.segmentWrap}>
                    <SegmentedControl
                        value={selectedType}
                        onChange={setSelectedType}
                        variant="filled"
                        options={[
                            { label: 'Expense', value: 'expense' },
                            { label: 'Income', value: 'income' },
                        ]}
                    />
                </View>

                {/* Grid */}
                {rows.length > 0 ? (
                    <View>
                        {rows.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {row.map((item) => (
                                    <CategoryTile
                                        key={item.id}
                                        category={item}
                                        count={transactionCounts[item.id] || 0}
                                        onLongPress={() => handleDelete(item)}
                                    />
                                ))}
                                {/* Invisible spacer when odd number of items */}
                                {row.length === 1 && <View style={styles.tileSpacer} />}
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconWrap}>
                            <Plus color="#94a3b8" size={32} strokeWidth={1.5} />
                        </View>
                        <Text style={styles.emptyTitle}>No {selectedType} categories</Text>
                        <Text style={styles.emptyText}>
                            Tap the + button to create your first {selectedType} category.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* FAB */}
            <View style={styles.fabContainer}>
                <TouchableOpacity
                    onPress={() => setIsAddModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <View style={styles.fab}>
                        <Plus color="#fff" size={28} strokeWidth={2.5} />
                    </View>
                </TouchableOpacity>
            </View>

            <CategoryModal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onCreated={loadData}
            />
        </SafeAreaView>
    );
}

/* ─── Tile ─── */

type CategoryTileProps = {
    category: Category;
    count: number;
    onLongPress: () => void;
};

function CategoryTile({ category, count, onLongPress }: CategoryTileProps) {
    const presentation = getCategoryPresentation(category);
    const Icon = presentation.Icon;
    const countText =
        count > 0 ? `${count} ${count === 1 ? 'item' : 'items'}` : 'No transactions';

    return (
        <TouchableOpacity
            onLongPress={onLongPress}
            delayLongPress={350}
            activeOpacity={0.7}
        >
            <View style={styles.tile}>
                {/* Top: icon + count badge */}
                <View style={styles.tileTop}>
                    <View style={[styles.iconBubble, { backgroundColor: presentation.backgroundColor }]}>
                        <Icon color={presentation.color} size={22} strokeWidth={2.2} />
                    </View>
                    {count > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{count}</Text>
                        </View>
                    )}
                </View>

                {/* Title */}
                <Text style={styles.tileTitle} numberOfLines={1}>
                    {category.title}
                </Text>

                {/* Meta */}
                <Text style={styles.tileMeta} numberOfLines={1}>
                    {countText}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

/* ─── Styles ─── */

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingHorizontal: H_PADDING,
    },

    /* Header */
    header: {
        paddingTop: SPACING['2xl'],
        marginBottom: SPACING.xs,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.heading,
    },
    subtitle: {
        marginTop: SPACING.xs,
        fontSize: TYPOGRAPHY.sizes.sm,
        color: '#6b7280',
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    segmentWrap: {
        marginTop: SPACING.lg,
        marginBottom: SPACING.xl,
    },

    /* Grid rows */
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: TILE_GAP,
    },

    /* Tile */
    tile: {
        width: TILE_WIDTH,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    tileSpacer: {
        width: TILE_WIDTH,
    },
    tileTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    iconBubble: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        minWidth: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#eef3ff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: '700',
    },
    tileTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 3,
    },
    tileMeta: {
        color: '#9ca3af',
        fontSize: 12,
        fontWeight: '500',
    },

    /* FAB */
    fabContainer: {
        position: 'absolute',
        right: 24,
        bottom: 100,
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Empty */
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: SPACING.xl,
    },
    emptyIconWrap: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    emptyText: {
        color: '#9ca3af',
        fontSize: TYPOGRAPHY.sizes.base,
        fontFamily: TYPOGRAPHY.fonts.body,
        textAlign: 'center',
        lineHeight: 22,
    },
});

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import { SPACING } from '../../../constants/spacing';
import { TYPOGRAPHY } from '../../../constants/typography';
import { getCategories, deleteCategory } from '../services/categoryService';
import { Category } from '../category.types';
import { getCurrentUser } from '../../auth';
import { useLoading } from '../../../contexts/LoadingContext';
import { getTransactions } from '../../transaction/services/transactionService';
import AppHeader from '../../../components/common/AppHeader';
import SegmentedControl from '../../../components/common/SegmentedControl';
import CategoryModal from '../components/CategoryModal';
import { getCategoryPresentation } from '../../../utils/categoryPresentation';

const SCREEN_WIDTH = Dimensions.get('window').width;
const H_PADDING = 24;
const TILE_GAP = 12;
const TILE_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - TILE_GAP) / 2;

export default function CategoryListScreen() {
    const insets = useSafeAreaInsets();
    const { setIsLoading } = useLoading();
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactionCounts, setTransactionCounts] = useState<Record<string, number>>({});
    const [selectedType, setSelectedType] = useState<Category['type']>('expense');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        const user = getCurrentUser();
        if (user) {
            const [cats, txns] = await Promise.all([
                getCategories(user.uid),
                getTransactions(user.uid),
            ]);
            const counts = txns.reduce<Record<string, number>>((acc, txn) => {
                acc[txn.category] = (acc[txn.category] || 0) + 1;
                return acc;
            }, {});

            setCategories(cats);
            setTransactionCounts(counts);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, [loadData]);

    const handleDelete = async (category: Category) => {
        Alert.alert(
            'Delete Category',
            `Are you sure you want to delete "${category.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const user = getCurrentUser();
                        if (!user) return;

                        setIsLoading(true);
                        try {
                            await deleteCategory(user.uid, category.id);
                            await loadData();
                        } catch (err: any) {
                            if (err.message === 'CATEGORY_IN_USE') {
                                Alert.alert(
                                    'Cannot Delete',
                                    'This category is used by existing transactions. Please delete or reassign them first.',
                                );
                            } else {
                                Alert.alert('Error', 'Failed to delete category.');
                            }
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ],
        );
    };

    const filteredCategories = categories.filter((c) => c.type === selectedType);

    // Build rows of 2
    const rows: Category[][] = [];
    for (let i = 0; i < filteredCategories.length; i += 2) {
        rows.push(filteredCategories.slice(i, i + 2));
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} translucent={false} />
            <AppHeader />

            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Categories</Text>
                    <Text style={styles.subtitle}>Manage your spending and earning tags</Text>
                </View>

                {/* Segmented Control */}
                <View style={styles.segmentWrap}>
                    <SegmentedControl
                        value={selectedType}
                        onChange={setSelectedType}
                        variant="filled"
                        options={[
                            { label: 'Expense', value: 'expense' },
                            { label: 'Income', value: 'income' },
                        ]}
                    />
                </View>

                {/* Grid */}
                {rows.length > 0 ? (
                    <View>
                        {rows.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {row.map((item) => (
                                    <CategoryTile
                                        key={item.id}
                                        category={item}
                                        count={transactionCounts[item.id] || 0}
                                        onLongPress={() => handleDelete(item)}
                                    />
                                ))}
                                {/* Invisible spacer when odd number of items */}
                                {row.length === 1 && <View style={styles.tileSpacer} />}
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconWrap}>
                            <Plus color="#94a3b8" size={32} strokeWidth={1.5} />
                        </View>
                        <Text style={styles.emptyTitle}>No {selectedType} categories</Text>
                        <Text style={styles.emptyText}>
                            Tap the + button to create your first {selectedType} category.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* FAB */}
            <Pressable
                onPress={() => setIsAddModalVisible(true)}
                style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
            >
                <Plus color="#fff" size={28} strokeWidth={2.5} />
            </Pressable>

            <CategoryModal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onCreated={loadData}
            />
        </SafeAreaView>
    );
}

/* ─── Tile ─── */

type CategoryTileProps = {
    category: Category;
    count: number;
    onLongPress: () => void;
};

function CategoryTile({ category, count, onLongPress }: CategoryTileProps) {
    const presentation = getCategoryPresentation(category);
    const Icon = presentation.Icon;
    const countText =
        count > 0 ? `${count} ${count === 1 ? 'item' : 'items'}` : 'No transactions';

    return (
        <Pressable
            onLongPress={onLongPress}
            delayLongPress={350}
            style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
        >
            {/* Top: icon + count badge */}
            <View style={styles.tileTop}>
                <View style={[styles.iconBubble, { backgroundColor: presentation.backgroundColor }]}>
                    <Icon color={presentation.color} size={22} strokeWidth={2.2} />
                </View>
                {count > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{count}</Text>
                    </View>
                )}
            </View>

            {/* Title */}
            <Text style={styles.tileTitle} numberOfLines={1}>
                {category.title}
            </Text>

            {/* Meta */}
            <Text style={styles.tileMeta} numberOfLines={1}>
                {countText}
            </Text>
        </Pressable>
    );
}

/* ─── Styles ─── */

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingHorizontal: H_PADDING,
    },

    /* Header */
    header: {
        paddingTop: SPACING['2xl'],
        marginBottom: SPACING.xs,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        fontFamily: TYPOGRAPHY.fonts.heading,
    },
    subtitle: {
        marginTop: SPACING.xs,
        fontSize: TYPOGRAPHY.sizes.sm,
        color: '#6b7280',
        fontFamily: TYPOGRAPHY.fonts.body,
    },
    segmentWrap: {
        marginTop: SPACING.lg,
        marginBottom: SPACING.xl,
    },

    /* Grid rows */
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: TILE_GAP,
    },

    /* Tile */
    tile: {
        width: TILE_WIDTH,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    tileSpacer: {
        width: TILE_WIDTH,
    },
    tilePressed: {
        opacity: 0.75,
    },
    tileTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    iconBubble: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        minWidth: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#eef3ff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: '700',
    },
    tileTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 3,
    },
    tileMeta: {
        color: '#9ca3af',
        fontSize: 12,
        fontWeight: '500',
    },

    /* FAB */
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 100,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    fabPressed: {
        opacity: 0.85,
    },

    /* Empty */
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: SPACING.xl,
    },
    emptyIconWrap: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    emptyText: {
        color: '#9ca3af',
        fontSize: TYPOGRAPHY.sizes.base,
        fontFamily: TYPOGRAPHY.fonts.body,
        textAlign: 'center',
        lineHeight: 22,
    },
});
